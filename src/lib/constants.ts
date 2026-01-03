export const THEME_COLORS = {
    cyber: {
        primary: "#06b6d4", // Cyan-500
        accent: "#8b5cf6",  // Violet-500
        background: "#030014", // Deep Navy
    },
    crimson: {
        primary: "#ef4444", // Red-500
        accent: "#f97316",  // Orange-500
        background: "#0f0505", // Deep Red/Black
    },
    emerald: {
        primary: "#10b981", // Emerald-500
        accent: "#84cc16",  // Lime-500
        background: "#020a05", // Deep Green/Black
    },
    amber: {
        primary: "#f59e0b", // Amber-500
        accent: "#eab308",  // Yellow-500
        background: "#0f0a00", // Deep Amber/Black
    },
    royal: {
        primary: "#2563eb", // Blue-600
        accent: "#6366f1",  // Indigo-500
        background: "#020410", // Deep Blue/Black
    },
} as const;

export type ThemeName = keyof typeof THEME_COLORS;
