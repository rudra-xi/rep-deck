import { CURRENT_VERSION } from "@/constants";

export const SUPPORT_EMAIL = "xi.rudra.code@gmail.com";
export const GITHUB_REPO = "https://github.com/rudra-xi/rep-deck";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;

interface MailtoOptions {
	subject: string;
	body?: string;
}

export function buildMailtoUrl({ subject, body }: MailtoOptions) {
	const parts: string[] = [];

	if (subject) {
		parts.push(`subject=${encodeURIComponent(subject)}`);
	}

	if (body) {
		parts.push(`body=${encodeURIComponent(body)}`);
	}

	const query = parts.join("&");
	return query
		? `mailto:${SUPPORT_EMAIL}?${query}`
		: `mailto:${SUPPORT_EMAIL}`;
}

export function buildFeedbackMailtoUrl({
	appVersion = CURRENT_VERSION,
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
	appVersion = CURRENT_VERSION,
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
	appVersion = CURRENT_VERSION,
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
