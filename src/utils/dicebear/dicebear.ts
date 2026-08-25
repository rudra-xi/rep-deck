/**
 * Generates a DiceBear Thumbs SVG avatar URL with custom preset colors matching the app theme.
 */
export function getDiceBearAvatarUrl(seed: string): string {
	const encodedSeed = encodeURIComponent(seed);

	// Hex colors without the `#` prefix
	const backgroundColor = "6e11b0"; // Dark Purple
	const shapeColor = "dab2ff"; // Light Purple Tint

	return `https://api.dicebear.com/10.x/thumbs/svg?seed=${encodedSeed}&backgroundColor=${backgroundColor}&shapeColor=${shapeColor}&borderRadius=0`;
}
