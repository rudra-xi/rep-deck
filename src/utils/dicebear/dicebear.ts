export const AVATAR_PALETTES = {
	green: { backgroundColor: "1e293b", shapeColor: "aff33e" },
	violateeye: { backgroundColor: "1d1b30", shapeColor: "846feb" },
	rosepine: { backgroundColor: "403d52", shapeColor: "e0def4" },
	retro: { backgroundColor: "262626", shapeColor: "f36a2d" },
	cosmic: { backgroundColor: "252e3d", shapeColor: "9690f1" },
	orchid: { backgroundColor: "35334d", shapeColor: "b2a5e9" },
	booking: { backgroundColor: "1c1b37", shapeColor: "f7514b" },
	lime: { backgroundColor: "303030", shapeColor: "d9e96e" },
} as const;

export type ThemeSlug = keyof typeof AVATAR_PALETTES;

export const DEFAULT_THEME: ThemeSlug = "violateeye";

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
		animationVariant: "fastest",
	});

	return `https://api.dicebear.com/10.x/thumbs/svg?${params}`;
}
