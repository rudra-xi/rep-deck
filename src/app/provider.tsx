"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer, Navigation } from "@/common";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function LayoutProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const hideOnRoutes = "/";
	const show = !hideOnRoutes.includes(pathname);
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="enterprise"
			enableSystem={false}
			themes={[
				"enterprise",
				"qraft",
				"rosepine",
				"zen",
				"opcl",
				"barmell",
			]}
			disableTransitionOnChange
		>
			{show && <Navigation />}
			{children}
			<Toaster position="top-right" />
			{show && <Footer />}
		</ThemeProvider>
	);
}
