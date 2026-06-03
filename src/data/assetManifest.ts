export type IconAssetCategory =
  | "unit"
  | "building"
  | "resource"
  | "technology"
  | "age"
  | "landmark"
  | "civilization"
  | "other";

export interface IconAssetManifestEntry {
  key: string;
  displayName: string;
  category: IconAssetCategory;
  path: string;
  aliases: string[];
  fallbackKey?: string;
  source: "verified-local" | "fallback-local" | "planned";
  contentVersion: string;
  verified: boolean;
}

export const ASSET_CONTENT_VERSION = "2026-05-07";

export const ICON_ASSET_MANIFEST: IconAssetManifestEntry[] = [
  {
    key: "camel_archer",
    displayName: "Camel Archer",
    category: "unit",
    path: "/icons/archer.webp",
    aliases: ["camel-archer", "camelarcher"],
    fallbackKey: "archer",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
  {
    key: "keep",
    displayName: "Keep",
    category: "building",
    path: "/icons/white-tower.webp",
    aliases: ["castle", "fortress"],
    fallbackKey: "white_tower",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
  {
    key: "monastery",
    displayName: "Monastery",
    category: "building",
    path: "/icons/monk.webp",
    aliases: ["religious-building"],
    fallbackKey: "monk",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
  {
    key: "university",
    displayName: "University",
    category: "building",
    path: "/icons/castle_age.webp",
    aliases: ["academy"],
    fallbackKey: "castle_age",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
  {
    key: "knights_templar",
    displayName: "Knights Templar",
    category: "civilization",
    path: "/icons/knight.webp",
    aliases: ["templar", "knights-templar"],
    fallbackKey: "knight",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
  {
    key: "house_of_lancaster",
    displayName: "House of Lancaster",
    category: "civilization",
    path: "/icons/council-hall.webp",
    aliases: ["lancaster", "house-of-lancaster"],
    fallbackKey: "council_hall",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
  {
    key: "jin_dynasty",
    displayName: "Jin Dynasty",
    category: "civilization",
    path: "/icons/imperial-academy.webp",
    aliases: ["jin", "jin-dynasty"],
    fallbackKey: "imperial_academy",
    source: "fallback-local",
    contentVersion: ASSET_CONTENT_VERSION,
    verified: false,
  },
];

export function getManifestEntry(key: string) {
  return ICON_ASSET_MANIFEST.find(
    (entry) => entry.key === key || entry.aliases.includes(key)
  );
}
