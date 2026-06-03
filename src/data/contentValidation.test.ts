import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BuildOrderSchema,
  CIVILIZATIONS,
  CONTENT_BASELINE_VERSION,
} from "@/types";
import { GAME_ICONS } from "@/components/overlay/icons/GameIcons";
import { ICON_ASSET_MANIFEST } from "./assetManifest";

const repoRoot = process.cwd();

describe("content baseline", () => {
  it("includes current 2026 civilizations", () => {
    expect(CIVILIZATIONS).toContain("Golden Horde");
    expect(CIVILIZATIONS).toContain("Macedonian Dynasty");
    expect(CIVILIZATIONS).toContain("Sengoku Daimyo");
    expect(CIVILIZATIONS).toContain("Tughlaq Dynasty");
    expect(CIVILIZATIONS).toContain("Knights Templar");
    expect(CIVILIZATIONS).toContain("House of Lancaster");
    expect(CIVILIZATIONS).toContain("Jin Dynasty");
    expect(CONTENT_BASELINE_VERSION).toBe("2026-05-07");
  });

  it("all rendered icon paths resolve to local assets", () => {
    for (const [key, icon] of Object.entries(GAME_ICONS)) {
      const relativePath = icon.path.replace(/^\//, "");
      expect(
        existsSync(join(repoRoot, "public", relativePath)),
        `${key} references missing asset ${icon.path}`
      ).toBe(true);
    }
  });

  it("manifest entries have resolvable assets or declared fallbacks", () => {
    const manifestKeys = new Set(ICON_ASSET_MANIFEST.map((entry) => entry.key));
    for (const entry of ICON_ASSET_MANIFEST) {
      const relativePath = entry.path.replace(/^\//, "");
      const exists = existsSync(join(repoRoot, "public", relativePath));
      expect(
        exists || Boolean(entry.fallbackKey),
        `${entry.key} needs a local asset or fallback`
      ).toBe(true);
      if (entry.fallbackKey) {
        expect(
          manifestKeys.has(entry.fallbackKey) || entry.fallbackKey in GAME_ICONS,
          `${entry.key} fallback ${entry.fallbackKey} should be known`
        ).toBe(true);
      }
    }
  });

  it("bundled build orders are schema-valid and reference known icons", () => {
    const buildDir = join(repoRoot, "public", "build-orders");
    const files = readdirSync(buildDir).filter((file) => file.endsWith(".json"));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const raw = JSON.parse(readFileSync(join(buildDir, file), "utf8"));
      const build = BuildOrderSchema.parse(raw);
      expect(CIVILIZATIONS).toContain(build.civilization);
      expect(build.contentVersion, `${file} missing contentVersion`).toBe("2026-05-07");
      expect(build.source?.type, `${file} missing bundled source`).toBe("bundled");

      const steps = [
        ...build.steps,
        ...(build.branches ?? []).flatMap((branch) => branch.steps),
      ];
      for (const step of steps) {
        const matches = step.description.matchAll(/\[icon:([a-zA-Z0-9_-]+)\]/g);
        for (const match of matches) {
          expect(match[1] in GAME_ICONS, `${file} references unknown icon ${match[1]}`).toBe(true);
        }
      }

      for (const branch of build.branches ?? []) {
        expect(branch.startStepIndex).toBeLessThanOrEqual(build.steps.length);
      }
    }
  });
});
