export const SUPPORT_EMAIL = "xi.rudra.code@gmail.com";
export const GITHUB_REPO = "https://github.com/rudra-xi/rep-deck";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;

export function buildMailtoUrl({
	subject,
	body,
}: {
	subject: string;
	body?: string;
}) {
	const params = new URLSearchParams({ subject });
	if (body) params.set("body", body);
	return `mailto:${SUPPORT_EMAIL}?${params.toString()}`;
}