import { useState } from "react";
import { cn } from "@/lib/utils";

// All available game icons with image paths and emoji fallbacks
// Icons sourced from FluffyMaguro/AoE4_Overlay (official AoE4 icons)
export const GAME_ICONS = {
  // Resources
  food: { path: "/icons/resource_food.webp", emoji: "🍖", color: "#ef4444" },
  wood: { path: "/icons/resource_wood.webp", emoji: "🪵", color: "#22c55e" },
  gold: { path: "/icons/resource_gold.webp", emoji: "🪙", color: "#eab308" },
  stone: { path: "/icons/resource_stone.webp", emoji: "🪨", color: "#94a3b8" },

  // Villagers
  villager: { path: "/icons/villager.webp", emoji: "👷", color: "#f59e0b" },

  // Economy buildings
  house: { path: "/icons/house.webp", emoji: "🏠", color: "#a78bfa" },
  mill: { path: "/icons/mill.webp", emoji: "🌾", color: "#fbbf24" },
  lumber_camp: { path: "/icons/lumber_camp.webp", emoji: "🪓", color: "#22c55e" },
  mining_camp: { path: "/icons/mining_camp.webp", emoji: "⛏️", color: "#eab308" },
  farm: { path: "/icons/farm.webp", emoji: "🌱", color: "#84cc16" },
  market: { path: "/icons/market.webp", emoji: "🏪", color: "#f97316" },
  dock: { path: "/icons/dock.webp", emoji: "⚓", color: "#3b82f6" },

  // Military buildings
  barracks: { path: "/icons/barracks.webp", emoji: "🏛️", color: "#ef4444" },
  archery_range: { path: "/icons/archery_range.webp", emoji: "🎯", color: "#f97316" },
  stable: { path: "/icons/stable.webp", emoji: "🐴", color: "#a855f7" },
  blacksmith: { path: "/icons/barracks.webp", emoji: "🔨", color: "#6b7280" },
  siege_workshop: { path: "/icons/siege_workshop.webp", emoji: "🏗️", color: "#78716c" },
  monastery: { path: "/icons/monk.webp", emoji: "⛪", color: "#8b5cf6" },
  university: { path: "/icons/castle_age.webp", emoji: "🎓", color: "#3b82f6" },

  // Landmarks & special
  town_center: { path: "/icons/town_center.webp", emoji: "🏰", color: "#fbbf24" },
  keep: { path: "/icons/castle_age.webp", emoji: "🏯", color: "#64748b" },
  castle: { path: "/icons/castle_age.webp", emoji: "🏰", color: "#a855f7" },
  wonder: { path: "/icons/imperial_age.webp", emoji: "🗼", color: "#ec4899" },
  outpost: { path: "/icons/house.webp", emoji: "🗼", color: "#78716c" },
  palisade: { path: "/icons/house.webp", emoji: "🪵", color: "#92400e" },
  stone_wall: { path: "/icons/house.webp", emoji: "🧱", color: "#64748b" },
  gate: { path: "/icons/house.webp", emoji: "🚪", color: "#78716c" },

  // Infantry units
  spearman: { path: "/icons/spearman.webp", emoji: "🗡️", color: "#64748b" },
  man_at_arms: { path: "/icons/man_at_arms.webp", emoji: "⚔️", color: "#475569" },
  pikeman: { path: "/icons/spearman.webp", emoji: "🗡️", color: "#334155" },

  // Ranged units
  archer: { path: "/icons/archer.webp", emoji: "🏹", color: "#22c55e" },
  crossbowman: { path: "/icons/crossbowman.webp", emoji: "🎯", color: "#16a34a" },
  handcannoneer: { path: "/icons/handcannoneer.webp", emoji: "🔫", color: "#dc2626" },
  longbowman: { path: "/icons/archer.webp", emoji: "🏹", color: "#b91c1c" },

  // Cavalry units
  scout: { path: "/icons/scout.webp", emoji: "🐎", color: "#84cc16" },
  horseman: { path: "/icons/horseman.webp", emoji: "🏇", color: "#65a30d" },
  knight: { path: "/icons/knight.webp", emoji: "🤺", color: "#a855f7" },
  lancer: { path: "/icons/lancer.webp", emoji: "🏇", color: "#7c3aed" },

  // Siege units
  ram: { path: "/icons/ram.webp", emoji: "🪵", color: "#78716c" },
  mangonel: { path: "/icons/mangonel.webp", emoji: "💥", color: "#f97316" },
  springald: { path: "/icons/springald.webp", emoji: "🎯", color: "#ea580c" },
  trebuchet: { path: "/icons/trebuchet.webp", emoji: "🏗️", color: "#c2410c" },
  bombard: { path: "/icons/bombard.webp", emoji: "💣", color: "#7f1d1d" },
  siege_tower: { path: "/icons/siege_tower.webp", emoji: "🗼", color: "#78716c" },
  culverin: { path: "/icons/culverin.webp", emoji: "🎯", color: "#475569" },
  ribauldequin: { path: "/icons/ribauldequin.webp", emoji: "💥", color: "#dc2626" },

  // Naval
  fishing_boat: { path: "/icons/fish.webp", emoji: "🎣", color: "#0ea5e9" },
  transport: { path: "/icons/dock.webp", emoji: "🚢", color: "#0284c7" },
  galley: { path: "/icons/dock.webp", emoji: "⛵", color: "#0369a1" },

  // Religious & Trade
  monk: { path: "/icons/monk.webp", emoji: "🧙", color: "#8b5cf6" },
  trader: { path: "/icons/trader.webp", emoji: "🐪", color: "#f59e0b" },
  prelate: { path: "/icons/prelate.webp", emoji: "⛪", color: "#fbbf24" },
  mehter: { path: "/icons/monk.webp", emoji: "🥁", color: "#8b5cf6" },

  // Ages
  dark_age: { path: "/icons/dark_age.webp", emoji: "🌑", color: "#374151" },
  feudal_age: { path: "/icons/feudal_age.webp", emoji: "🏰", color: "#059669" },
  castle_age: { path: "/icons/castle_age.webp", emoji: "⚔️", color: "#2563eb" },
  imperial_age: { path: "/icons/imperial_age.webp", emoji: "👑", color: "#dc2626" },

  // Resources on map
  sheep: { path: "/icons/sheep.webp", emoji: "🐑", color: "#fafafa" },
  deer: { path: "/icons/deer.webp", emoji: "🦌", color: "#a16207" },
  boar: { path: "/icons/boar.webp", emoji: "🐗", color: "#78350f" },
  wolf: { path: "/icons/wolf.webp", emoji: "🐺", color: "#6b7280" },
  berries: { path: "/icons/berries.webp", emoji: "🫐", color: "#7c3aed" },
  fish: { path: "/icons/fish.webp", emoji: "🐟", color: "#0ea5e9" },
  relic: { path: "/icons/relic.webp", emoji: "✨", color: "#fbbf24" },
  sacred_site: { path: "/icons/sacred_site.webp", emoji: "⭐", color: "#f59e0b" },
  cattle: { path: "/icons/cattle.webp", emoji: "🐄", color: "#a16207" },
  olive_oil: { path: "/icons/olive_oil.webp", emoji: "🫒", color: "#84cc16" },
  bounty: { path: "/icons/bounty.webp", emoji: "💰", color: "#eab308" },

  // Civ-specific buildings
  hunting_cabin: { path: "/icons/hunting_cabin.webp", emoji: "🏚️", color: "#22c55e" },
  ger: { path: "/icons/ger.webp", emoji: "⛺", color: "#f97316" },
  village: { path: "/icons/town_center.webp", emoji: "🏘️", color: "#eab308" },
  landmark: { path: "/icons/feudal_age.webp", emoji: "🏛️", color: "#a855f7" },

  // Technologies / Upgrades - Economy
  upgrade: { path: "/icons/feudal_age.webp", emoji: "⬆️", color: "#22c55e" },
  research: { path: "/icons/castle_age.webp", emoji: "📜", color: "#3b82f6" },
  wheelbarrow: { path: "/icons/wheelbarrow.webp", emoji: "🛒", color: "#f97316" },
  professional_scouts: { path: "/icons/professional-scouts.webp", emoji: "🔍", color: "#84cc16" },
  horticulture: { path: "/icons/horticulture.webp", emoji: "🌿", color: "#22c55e" },
  double_broadaxe: { path: "/icons/double-broadaxe.webp", emoji: "🪓", color: "#78716c" },
  survival_techniques: { path: "/icons/survival-techniques.webp", emoji: "🏕️", color: "#22c55e" },
  forestry: { path: "/icons/forestry.webp", emoji: "🌲", color: "#166534" },
  acid_distillation: { path: "/icons/acid-distillation.webp", emoji: "🧪", color: "#eab308" },
  crosscut_saw: { path: "/icons/crosscut-saw.webp", emoji: "🪚", color: "#22c55e" },
  cupellation: { path: "/icons/cupellation.webp", emoji: "🏆", color: "#eab308" },
  drift_nets: { path: "/icons/drift-nets.webp", emoji: "🎣", color: "#0ea5e9" },
  extended_lines: { path: "/icons/extended-lines.webp", emoji: "🎣", color: "#0ea5e9" },
  fertilization: { path: "/icons/fertilization.webp", emoji: "🌱", color: "#84cc16" },
  precision_cross_breeding: { path: "/icons/precision-cross-breeding.webp", emoji: "🧬", color: "#84cc16" },
  specialized_pick: { path: "/icons/specialized-pick.webp", emoji: "⛏️", color: "#eab308" },
  textiles: { path: "/icons/textiles.webp", emoji: "🧵", color: "#a78bfa" },

  // Technologies / Upgrades - Military
  iron_undermesh: { path: "/icons/iron-undermesh.webp", emoji: "🛡️", color: "#475569" },
  steeled_arrow: { path: "/icons/steeled-arrow.webp", emoji: "🏹", color: "#475569" },
  siege_engineering: { path: "/icons/siege-engineering.webp", emoji: "🏗️", color: "#78716c" },
  bloomery: { path: "/icons/bloomery.webp", emoji: "⚔️", color: "#78716c" },
  fitted_leatherwork: { path: "/icons/fitted-leatherwork.webp", emoji: "🛡️", color: "#92400e" },
  balanced_projectiles: { path: "/icons/balanced-projectiles.webp", emoji: "🎯", color: "#f97316" },
  chemistry: { path: "/icons/chemistry.webp", emoji: "🧪", color: "#dc2626" },
  damascus_steel: { path: "/icons/damascus-steel.webp", emoji: "⚔️", color: "#334155" },
  decarbonization: { path: "/icons/decarbonization.webp", emoji: "🔥", color: "#78716c" },
  elite_army_tactics: { path: "/icons/elite-army-tactics.webp", emoji: "📜", color: "#7c3aed" },
  geometry: { path: "/icons/geometry.webp", emoji: "📐", color: "#3b82f6" },
  insulated_helm: { path: "/icons/insulated-helm.webp", emoji: "⛑️", color: "#475569" },
  military_academy: { path: "/icons/military-academy.webp", emoji: "🎖️", color: "#dc2626" },
  platecutter_point: { path: "/icons/platecutter-point.webp", emoji: "🗡️", color: "#334155" },
  angled_surfaces: { path: "/icons/angled-surfaces.webp", emoji: "🛡️", color: "#475569" },
  master_smiths: { path: "/icons/master-smiths.webp", emoji: "🔨", color: "#78716c" },
  hardened_spearmen: { path: "/icons/hardened-spearmen.webp", emoji: "🗡️", color: "#64748b" },
  veteran_spearmen: { path: "/icons/veteran-spearmen.webp", emoji: "🗡️", color: "#475569" },
  elite_spearmen: { path: "/icons/elite-spearmen.webp", emoji: "🗡️", color: "#334155" },
  veteran_archers: { path: "/icons/veteran-archers.webp", emoji: "🏹", color: "#16a34a" },
  elite_archers: { path: "/icons/elite-archers.webp", emoji: "🏹", color: "#166534" },
  veteran_horsemen: { path: "/icons/veteran-horsemen.webp", emoji: "🏇", color: "#65a30d" },
  elite_horsemen: { path: "/icons/elite-horsemen.webp", emoji: "🏇", color: "#4d7c0f" },

  // Civ-specific units
  ronin: { path: "/icons/ronin.webp", emoji: "⚔️", color: "#dc2626" },
  landsknecht: { path: "/icons/landsknecht.webp", emoji: "⚔️", color: "#facc15" },
  mangudai: { path: "/icons/mangudai.webp", emoji: "🏹", color: "#f97316" },
  keshik: { path: "/icons/keshik.webp", emoji: "🏇", color: "#ea580c" },
  khan: { path: "/icons/khan.webp", emoji: "🏹", color: "#fbbf24" },
  king: { path: "/icons/king.webp", emoji: "👑", color: "#fbbf24" },
  // Delhi
  ghazi_raider: { path: "/icons/horseman.webp", emoji: "🏇", color: "#f97316" },
  tower_elephant: { path: "/icons/archer.webp", emoji: "🐘", color: "#fbbf24" },
  war_elephant: { path: "/icons/spearman.webp", emoji: "🐘", color: "#fbbf24" },

  // Byzantine units
  limitanei: { path: "/icons/spearman.webp", emoji: "🛡️", color: "#64748b" },
  varangian_guard: { path: "/icons/man_at_arms.webp", emoji: "🪓", color: "#475569" },
  cataphract: { path: "/icons/knight.webp", emoji: "🏇", color: "#a855f7" },
  cheirosiphon: { path: "/icons/siege_tower.webp", emoji: "🔥", color: "#dc2626" },
  dromon: { path: "/icons/fish.webp", emoji: "🚢", color: "#0ea5e9" },

  // Ottoman units
  sipahi: { path: "/icons/horseman.webp", emoji: "🏇", color: "#f97316" },
  janissary: { path: "/icons/handcannoneer.webp", emoji: "🔫", color: "#dc2626" },
  great_bombard: { path: "/icons/bombard.webp", emoji: "💣", color: "#7f1d1d" },

  // Malian units
  donso: { path: "/icons/spearman.webp", emoji: "🗡️", color: "#64748b" },
  musofadi_warrior: { path: "/icons/man_at_arms.webp", emoji: "🥷", color: "#475569" },
  sofa: { path: "/icons/knight.webp", emoji: "🏇", color: "#a855f7" },
  musofadi_gunner: { path: "/icons/handcannoneer.webp", emoji: "🔫", color: "#dc2626" },

  // Special buildings & Landmarks
  military_school: { path: "/icons/barracks.webp", emoji: "🏫", color: "#ef4444" },
  cistern: { path: "/icons/mill.webp", emoji: "💧", color: "#3b82f6" },
  pit_mine: { path: "/icons/mining_camp.webp", emoji: "⛏️", color: "#eab308" },
  kura_storehouse: { path: "/icons/mill.webp", emoji: "🏠", color: "#fbbf24" },
  
  // More landmarks
  abbey_of_kings: { path: "/icons/monk.webp", emoji: "⛪", color: "#8b5cf6" },
  kings_palace: { path: "/icons/town_center.webp", emoji: "🏰", color: "#fbbf24" },
  berkshire_palace: { path: "/icons/white-tower.webp", emoji: "🏯", color: "#64748b" },
  wynguard_palace: { path: "/icons/military-academy.webp", emoji: "🏰", color: "#ef4444" },
  guild_hall: { path: "/icons/market.webp", emoji: "🏛️", color: "#f97316" },
  royal_institute: { path: "/icons/castle_age.webp", emoji: "📜", color: "#3b82f6" },
  red_palace: { path: "/icons/white-tower.webp", emoji: "🏰", color: "#dc2626" },
  college_of_artillery: { path: "/icons/siege_workshop.webp", emoji: "🎓", color: "#78716c" },
  elzbach_palace: { path: "/icons/white-tower.webp", emoji: "🏰", color: "#64748b" },
  palace_of_swabia: { path: "/icons/town_center.webp", emoji: "🏰", color: "#fbbf24" },
  grand_winery: { path: "/icons/mill.webp", emoji: "🍷", color: "#84cc16" },
  imperial_hippodrome: { path: "/icons/stable.webp", emoji: "🏟️", color: "#a855f7" },
  golden_horn_tower: { path: "/icons/white-tower.webp", emoji: "🗼", color: "#fbbf24" },

  // Japanese landmarks
  koka_township: { path: "/icons/shinobi.webp", emoji: "🥷", color: "#374151" },
  floating_gate: { path: "/icons/monk.webp", emoji: "⛩️", color: "#8b5cf6" },
  temple_of_equality: { path: "/icons/monk.webp", emoji: "🧘", color: "#8b5cf6" },
  castle_of_the_crow: { path: "/icons/white-tower.webp", emoji: "🐦", color: "#64748b" },
  tanegashima_gunsmith: { path: "/icons/siege_workshop.webp", emoji: "🔫", color: "#78716c" },

  // Malian landmarks
  mansa_quarry: { path: "/icons/mining_camp.webp", emoji: "💎", color: "#eab308" },
  saharan_trade_network: { path: "/icons/market.webp", emoji: "🐫", color: "#f97316" },
  farimba_garrison: { path: "/icons/barracks.webp", emoji: "⛺", color: "#ef4444" },
  fort_of_the_huntress: { path: "/icons/white-tower.webp", emoji: "🏹", color: "#dc2626" },

  // Ottoman landmarks
  twin_minaret_medrese: { path: "/icons/mill.webp", emoji: "🕌", color: "#fbbf24" },
  istanbul_observatory: { path: "/icons/castle_age.webp", emoji: "🔭", color: "#3b82f6" },
  tophane_arsenal: { path: "/icons/siege_workshop.webp", emoji: "🏭", color: "#78716c" },

  // Units
  streltsy: { path: "/icons/handcannoneer.webp", emoji: "🔫", color: "#7f1d1d" },
  zhuge_nu: { path: "/icons/zhuge-nu.webp", emoji: "🏹", color: "#dc2626" },
  palace_guard: { path: "/icons/palace-guard.webp", emoji: "⚔️", color: "#facc15" },
  nest_of_bees: { path: "/icons/nest-of-bees.webp", emoji: "💥", color: "#f97316" },
  fire_lancer: { path: "/icons/fire-lancer.webp", emoji: "🔥", color: "#ea580c" },
  grenadier: { path: "/icons/grenadier.webp", emoji: "💣", color: "#dc2626" },
  imperial_official: { path: "/icons/imperial-official.webp", emoji: "📜", color: "#fbbf24" },
  camel_archer: { path: "/icons/archer.webp", emoji: "🐪", color: "#facc15" },
  warrior_monk: { path: "/icons/monk.webp", emoji: "🧙", color: "#22c55e" },

  // Landmarks & Key Buildings
  council_hall: { path: "/icons/council-hall.webp", emoji: "🏛️", color: "#ef4444" },
  school_of_cavalry: { path: "/icons/school-of-cavalry.webp", emoji: "🐴", color: "#3b82f6" },
  meinwerk_palace: { path: "/icons/meinwerk-palace.webp", emoji: "🔨", color: "#fbbf24" },
  white_tower: { path: "/icons/white-tower.webp", emoji: "🏯", color: "#64748b" },
  aachen_chapel: { path: "/icons/aachen-chapel.webp", emoji: "⛪", color: "#fbbf24" },
  regnitz_cathedral: { path: "/icons/regnitz-cathedral.webp", emoji: "⛪", color: "#fbbf24" },
  golden_gate: { path: "/icons/golden-gate.webp", emoji: "🪙", color: "#22c55e" },
  barbican_of_the_sun: { path: "/icons/barbican-of-the-sun.webp", emoji: "🗼", color: "#dc2626" },
  imperial_academy: { path: "/icons/imperial-academy.webp", emoji: "🏘️", color: "#eab308" },
  astronomical_clocktower: { path: "/icons/astronomical-clocktower.webp", emoji: "⏰", color: "#3b82f6" },
  house_of_wisdom: { path: "/icons/house-of-wisdom.webp", emoji: "📚", color: "#0ea5e9" },
  military_wing: { path: "/icons/military-wing.webp", emoji: "⚔️", color: "#ef4444" },
  economic_wing: { path: "/icons/economic-wing.webp", emoji: "🌾", color: "#22c55e" },
  trade_wing: { path: "/icons/trade-wing.webp", emoji: "🐪", color: "#f59e0b" },
  culture_wing: { path: "/icons/culture-wing.webp", emoji: "🎨", color: "#8b5cf6" },

  // Japanese units
  samurai: { path: "/icons/samurai.webp", emoji: "⚔️", color: "#dc2626" },
  onna_bugeisha: { path: "/icons/onna-bugeisha.webp", emoji: "🗡️", color: "#dc2626" },
  shinobi: { path: "/icons/shinobi.webp", emoji: "🥷", color: "#374151" },
  ozutsu: { path: "/icons/ozutsu.webp", emoji: "💣", color: "#7f1d1d" },

  // Civ Variants
  jeanne_d_arc: { path: "/icons/king.webp", emoji: "👸", color: "#3b82f6" },
  order_of_the_dragon: { path: "/icons/knight.webp", emoji: "🐉", color: "#dc2626" },
  zhu_xi_legacy: { path: "/icons/zhuge-nu.webp", emoji: "📜", color: "#eab308" },
  ayyubids: { path: "/icons/archer.webp", emoji: "🕌", color: "#16a34a" },
  knights_templar: { path: "/icons/knight.webp", emoji: "✚", color: "#f8fafc" },
  house_of_lancaster: { path: "/icons/council-hall.webp", emoji: "🌹", color: "#ef4444" },
  jin_dynasty: { path: "/icons/imperial-academy.webp", emoji: "🏯", color: "#eab308" },

  // Actions
  rally: { path: "/icons/rally.webp", emoji: "🚩", color: "#22c55e" },
  repair: { path: "/icons/repair.webp", emoji: "🔧", color: "#3b82f6" },
  time: { path: "/icons/time.webp", emoji: "⏱️", color: "#f59e0b" },

  // Generic
  attack: { path: "/icons/knight.webp", emoji: "⚔️", color: "#ef4444" },
  defense: { path: "/icons/spearman.webp", emoji: "🛡️", color: "#3b82f6" },
  speed: { path: "/icons/scout.webp", emoji: "💨", color: "#22d3d1" },
  timer: { path: "/icons/dark_age.webp", emoji: "⏱️", color: "#f59e0b" },
} as const;

export type GameIconType = keyof typeof GAME_ICONS;

// Track which icons have failed to load globally (persists across renders)
const globalFailedIcons = new Set<string>();

interface GameIconProps {
  type: GameIconType;
  size?: number;
  className?: string;
  glow?: boolean;
  showLabel?: boolean;
}

// Icons that need labels because they're unclear (only for emoji fallbacks now)
const NEEDS_LABEL: Set<GameIconType> = new Set([
  "upgrade", "research", "wheelbarrow", "landmark",
]);

// Human-readable labels for icon types
const ICON_LABELS: Partial<Record<GameIconType, string>> = {
  scout: "Scout",
  horseman: "Horseman",
  knight: "Knight",
  lancer: "Lancer",
  spearman: "Spearman",
  man_at_arms: "MAA",
  pikeman: "Pikeman",
  archer: "Archer",
  crossbowman: "Xbow",
  handcannoneer: "HC",
  longbowman: "Longbow",
  monk: "Monk",
  trader: "Trader",
  hunting_cabin: "Cabin",
  ger: "Ger",
  village: "Village",
  landmark: "Landmark",
  ram: "Ram",
  mangonel: "Mango",
  springald: "Spring",
  trebuchet: "Treb",
  bombard: "Bombard",
  siege_tower: "Tower",
  culverin: "Culv",
  ribauldequin: "Rib",
  upgrade: "Upgrade",
  research: "Research",
  wheelbarrow: "WB",
  town_center: "TC",
  lumber_camp: "LC",
  mining_camp: "MC",
  rally: "Rally",
  repair: "Repair",
  ronin: "Ronin",
  cattle: "Cattle",
  olive_oil: "Oil",
  bounty: "Bounty",
  // Technology labels
  professional_scouts: "Pro Scouts",
  horticulture: "Hort",
  double_broadaxe: "Axe",
  survival_techniques: "Survival",
  forestry: "Forestry",
  acid_distillation: "Acid",
  crosscut_saw: "Saw",
  cupellation: "Cup",
  drift_nets: "Nets",
  extended_lines: "Lines",
  fertilization: "Fert",
  precision_cross_breeding: "Breeding",
  specialized_pick: "Pick",
  textiles: "Textiles",
  iron_undermesh: "Mesh",
  steeled_arrow: "Arrow",
  siege_engineering: "Siege Eng",
  bloomery: "Bloom",
  fitted_leatherwork: "Leather",
  balanced_projectiles: "Proj",
  chemistry: "Chem",
  damascus_steel: "Damascus",
  decarbonization: "Decarb",
  elite_army_tactics: "Tactics",
  geometry: "Geo",
  insulated_helm: "Helm",
  military_academy: "Academy",
  platecutter_point: "Plate",
  angled_surfaces: "Angled",
  master_smiths: "Smiths",
  hardened_spearmen: "Hard Spear",
  veteran_spearmen: "Vet Spear",
  elite_spearmen: "Elite Spear",
  veteran_archers: "Vet Archer",
  elite_archers: "Elite Archer",
  veteran_horsemen: "Vet Horse",
  elite_horsemen: "Elite Horse",
};

export function GameIcon({ type, size = 20, className, glow = false, showLabel = false }: GameIconProps) {
  const icon = GAME_ICONS[type];
  // Use local state to trigger re-render on error, check global set first
  const [hasError, setHasError] = useState(() => globalFailedIcons.has(type));

  // Determine if we should show a label
  const shouldShowLabel = showLabel || (hasError && NEEDS_LABEL.has(type));
  const label = ICON_LABELS[type];

  const glowFilter = glow
    ? `drop-shadow(0 0 6px ${icon.color}) drop-shadow(0 0 12px ${icon.color}80)`
    : `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))`;

  // Show emoji if we already know this icon fails or if error occurred
  if (hasError || globalFailedIcons.has(type)) {
    return (
      <span
        className={cn("inline-flex items-center gap-0.5", className)}
        style={{
          filter: glowFilter,
        }}
        title={type.replace(/_/g, ' ')}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{
            fontSize: size * 0.85,
            width: size,
            height: size,
          }}
        >
          {icon.emoji}
        </span>
        {shouldShowLabel && label && (
          <span
            className="text-white/80 font-medium"
            style={{ fontSize: size * 0.55 }}
          >
            {label}
          </span>
        )}
      </span>
    );
  }

  // For icons with labels, wrap in span
  if (shouldShowLabel && label) {
    return (
      <span
        className={cn("inline-flex items-center gap-0.5", className)}
        title={type.replace(/_/g, ' ')}
      >
        <img
          src={icon.path}
          alt={type}
          width={size}
          height={size}
          className="inline-block"
          style={{
            imageRendering: "auto",
            filter: glowFilter,
            transform: glow ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
          onError={() => {
            globalFailedIcons.add(type);
            setHasError(true);
          }}
        />
        <span
          className="text-white/80 font-medium"
          style={{ fontSize: size * 0.55 }}
        >
          {label}
        </span>
      </span>
    );
  }

  return (
    <img
      src={icon.path}
      alt={type}
      width={size}
      height={size}
      className={cn("inline-block", className)}
      style={{
        imageRendering: "auto",
        filter: glowFilter,
        transform: glow ? "scale(1.1)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
      onError={() => {
        // Add to global set so other instances know immediately
        globalFailedIcons.add(type);
        // Trigger re-render for this component
        setHasError(true);
      }}
      title={type.replace(/_/g, ' ')}
    />
  );
}

// Convenience function to render inline icons in text
export function renderIconText(text: string, size = 18): React.ReactNode {
  if (!text) return "";

  const autoMappings: Record<string, GameIconType> = {
    "monk": "monk",
    "official": "imperial_official",
    "tax": "bounty",
    "pro scouts": "professional_scouts",
    "villagers": "villager",
    "villager": "villager",
    "vills": "villager",
    "vill": "villager",
    "scout": "scout",
    "knight": "knight",
    "relic": "relic",
    "landmark": "landmark",
    "house": "house",
    "barracks": "barracks",
    "stable": "stable",
    "archery range": "archery_range",
    "blacksmith": "blacksmith",
    "mining camp": "mining_camp",
    "lumber camp": "lumber_camp",
    "mill": "mill",
    "dock": "dock",
    "market": "market",
    "town center": "town_center",
    "tc": "town_center",
    "janissary": "janissary",
    "sipahi": "sipahi",
    "mehter": "mehter",
    "donso": "donso",
    "musofadi": "musofadi_warrior",
    "sofa": "sofa",
    "limitanei": "limitanei",
    "varangian": "varangian_guard",
    "cataphract": "cataphract",
    "elephant": "tower_elephant",
    "cistern": "cistern",
    "pit mine": "pit_mine",
    "school": "military_school",
    "samurai": "samurai",
    "shinobi": "shinobi",
    "prelate": "prelate",
    "zhuge nu": "zhuge_nu",
    "longbow": "longbowman",
    "lancer": "lancer",
    "horseman": "horseman",
    "archer": "archer",
    "crossbow": "crossbowman",
    "spearman": "spearman",
    "maa": "man_at_arms",
    "ram": "ram",
    "mangonel": "mangonel",
    "springald": "springald",
    "bombard": "bombard",
    "trebuchet": "trebuchet",
  };

  // 1. Split text into parts (text and existing [icon:...] tags)
  // Using parentheses in split regex includes the delimiter in the result array
  const pattern = /(\[icon:[a-zA-Z0-9_-]+\])/g;
  const hasExplicitIcons = /\[icon:[a-zA-Z0-9_-]+\]/.test(text);
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    // If it's an existing icon tag, render it
    const iconMatch = part.match(/^\[icon:([a-zA-Z0-9_-]+)\]$/);
    if (iconMatch) {
      const iconType = iconMatch[1] as GameIconType;
      if (iconType in GAME_ICONS) {
        return <GameIcon key={index} type={iconType} size={size} className="mx-0.5 align-middle" />;
      }
      // Fallback for unknown icons
      const fallbackText = iconType.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return <span key={index} className="mx-0.5 font-bold text-amber-400/80">{fallbackText}</span>;
    }

    if (hasExplicitIcons) {
      return <span key={index}>{part}</span>;
    }

    // It's a text part, apply auto-mappings
    let processedPart: (string | React.ReactNode)[] = [part];
    
    const sortedKeywords = Object.keys(autoMappings).sort((a, b) => b.length - a.length);
    
    for (const keyword of sortedKeywords) {
      const iconType = autoMappings[keyword];
      const re = new RegExp(`(\\b${keyword}\\b)`, "gi");
      
      const newProcessedPart: (string | React.ReactNode)[] = [];
      
      for (const subPart of processedPart) {
        if (typeof subPart !== "string") {
          newProcessedPart.push(subPart);
          continue;
        }
        
        const subSubParts = subPart.split(re);
        for (const ssp of subSubParts) {
          if (ssp.toLowerCase() === keyword.toLowerCase()) {
            newProcessedPart.push(<GameIcon key={`${index}-${keyword}-${newProcessedPart.length}`} type={iconType} size={size} className="mx-0.5 align-middle" />);
          } else if (ssp !== "") {
            newProcessedPart.push(ssp);
          }
        }
      }
      processedPart = newProcessedPart;
    }
    
    return <span key={index}>{processedPart}</span>;
  });
}

export { ResourceIcon } from "./ResourceIcons";
