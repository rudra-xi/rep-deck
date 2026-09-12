/**
 * Per-theme avatar palettes. Hex colors WITHOUT the `#` prefix,
 * as DiceBear's URL params expect.
 *
 * Keys must match the theme slugs used in `next-themes` and `themes.css`.
 */
export const AVATAR_PALETTES = {
	enterprise: { backgroundColor: "1e1b3a", shapeColor: "ffffff" },
	qraft: { backgroundColor: "121113", shapeColor: "e78a53" },
	rosepine: { backgroundColor: "403d52", shapeColor: "e0def4" },
	zen: { backgroundColor: "222222", shapeColor: "d1cfc0" },
	opcl: { backgroundColor: "16161e", shapeColor: "f59e0b" },
	barmell: { backgroundColor: "1a233b", shapeColor: "ff2e2e" },
} as const;

export type ThemeSlug = keyof typeof AVATAR_PALETTES;

export const DEFAULT_THEME: ThemeSlug = "enterprise";

/**
 * Generates a DiceBear Thumbs SVG avatar URL with colors matching the given theme.
 */
export function getDiceBearAvatarUrl(
	seed: string,
	theme: ThemeSlug = DEFAULT_THEME,
): string {
	const { backgroundColor, shapeColor } =
		AVATAR_PALETTES[theme] ?? AVATAR_PALETTES[DEFAULT_THEME];

	const params = new URLSearchParams({
		seed,
		backgroundColor,
		shapeColor,
		borderRadius: "0",
	});

	return `https://api.dicebear.com/10.x/thumbs/svg?${params}`;
}
