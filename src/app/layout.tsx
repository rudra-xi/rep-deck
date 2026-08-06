import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutProvider from "./provider";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: {
		template: "%s | Rep Deck",
		default: "Rep Deck | Strength in Motion",
		absolute: "Rep Deck",
	},
	description:
		"Rep Deck is a dynamic visual and performance-driven space exploring discipline, repetition, and the power of progression. A focused study in training energy, sharp aesthetics, and modern athletic identity.",
	icons: {
		icon: [
			{
				url: "/icon.svg",
				type: "image/svg+xml",
			},
			{
				url: "/favicon.ico",
				sizes: "any",
			},
		],
		apple: "/apple-icon.png",
	},
	authors: [{ name: "rudra-xi", url: "https://rudra-geek-nook.vercel.app/" }],
	creator: "rudra-xi",
	keywords: [
		"Rep Deck",
		"fitness gallery",
		"strength training",
		"workout aesthetic",
		"athletic identity",
		"training progression",
		"modern fitness design",
		"performance visuals",
	],
	openGraph: {
		title: "Rep Deck — Built by Repetition",
		description:
			"A sharp visual journey through training, structure, and the mindset behind disciplined progress. Designed around intensity, motion, and strength-forward aesthetics.",
		url: "https://rep-deck.vercel.app/",
		type: "website",
		siteName: "Rep Deck",
		images: [
			{
				url: "https://rep-deck.vercel.app/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Rep Deck – A strength-focused visual and training identity",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Rep Deck | Strength-Driven Visual Identity",
		description:
			"A curated, scroll-first experience centered on training, repetition, and athletic aesthetics.",
		creator: "rudra-xi",
		images: ["https://rep-deck.vercel.app/og-image.jpg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				"font-sans",
				oxanium.variable,
			)}
		>
			<body className="min-h-screen flex flex-col dark">
				<LayoutProvider>{children}</LayoutProvider>
			</body>
		</html>
	);
}
