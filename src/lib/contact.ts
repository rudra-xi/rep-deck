export const SUPPORT_EMAIL = "xi.rudra.code@gmail.com";
export const GITHUB_REPO = "https://github.com/rudra-xi/rep-deck";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;

interface MailtoOptions {
	subject: string;
	body?: string;
}

export function buildMailtoUrl({ subject, body }: MailtoOptions) {
	const params = new URLSearchParams({ subject });
	if (body) params.set("body", body);
	return `mailto:${SUPPORT_EMAIL}?${params.toString()}`;
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

export function buildPrivacyMailtoUrl({
	appVersion = "v0.1.0",
}: {
	appVersion?: string;
} = {}) {
	const body = [
		"Hi Rudra,",
		"",
		"I have a question about the Rep Deck Privacy Policy:",
		"",
		"—",
		"",
		"",
		"---",
		`App version: ${appVersion}`,
	].join("\r\n");

	return buildMailtoUrl({
		subject: "Rep Deck — Privacy Inquiry",
		body,
	});
}

export function buildTermsMailtoUrl({
	appVersion = "v0.1.0",
}: {
	appVersion?: string;
} = {}) {
	const body = [
		"Hi Rudra,",
		"",
		"I have a question about the Rep Deck Terms of Service:",
		"",
		"—",
		"",
		"",
		"---",
		`App version: ${appVersion}`,
	].join("\r\n");

	return buildMailtoUrl({
		subject: "Rep Deck — Terms Inquiry",
		body,
	});
}
