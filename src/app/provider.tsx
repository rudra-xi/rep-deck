"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Footer, Navigation } from "@/common";
import { Toaster } from "@/components/ui/sonner";
import { useToastPosition } from "@/hooks";
import { ProgressProvider } from "@bprogress/next/app";

export default function LayoutProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const hideOnRoutes = "/";
	const show = !hideOnRoutes.includes(pathname);

	const toastPosition = useToastPosition({
		mobilePosition: "bottom-center",
		desktopPosition: "top-right",
	});

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="violateeye"
			enableSystem={false}
			themes={[
				"green",
				"violateeye",
				"rosepine",
				"retro",
				"cosmic",
				"orchid",
				"booking",
				"lime",
			]}
			disableTransitionOnChange
		>
			<ProgressProvider
				height="1px"
				color="var(--primary)"
				options={{
					showSpinner: false,
					minimum: 0.1,
					trickleSpeed: 200,
				}}
				shallowRouting
			>
				{show && <Navigation />}
				{children}
				<Toaster
					position={toastPosition}
					mobileOffset={{ bottom: "5rem" }}
				/>
				{show && <Footer />}
			</ProgressProvider>
		</ThemeProvider>
	);
}
