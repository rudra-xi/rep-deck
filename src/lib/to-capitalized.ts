/**
 * Capitalizes the first letter of each word in a string
 * Example: "push pull legs" → "Push Pull Legs"
 */
export function toCapitalized(str: string): string {
	if (!str) return str;
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}
