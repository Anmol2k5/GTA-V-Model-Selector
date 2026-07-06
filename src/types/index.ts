export type AdapterType =
  | "copy_to_clipboard"
  | "launch_command"
  | "claude_code"
  | "codex"
  | "none";

export interface Preset {
  id: string;
  provider: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  colorHint: string;
  adapter: AdapterType;
  commandTemplate: string;
}
