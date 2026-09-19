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
	const parts = [`subject=${encodeURIComponent(subject)}`];
	if (body) parts.push(`body=${encodeURIComponent(body)}`);
	return `mailto:${SUPPORT_EMAIL}?${parts.join("&")}`;
}

export function buildFeedbackMailtoUrl({
	appVersion = "v0.1.0",
	userAgent,
}: {
	appVersion?: string;
	userAgent?: string;
} = {}) {
	const ua =
		userAgent ??
		(typeof navigator !== "undefined" ? navigator.userAgent : "");

	const body = [
		"Hi Rudra,",
		"",
		"Here's my feedback on Rep Deck:",
		"",
		"—",
		"",
		"",
		"---",
		`App version: ${appVersion}`,
		`Browser/OS: ${ua}`,
	].join("\r\n");

	return buildMailtoUrl({
		subject: "Rep Deck — Feedback",
		body,
	});
}
