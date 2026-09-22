"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useToastPosition } from "@/hooks";

export default function LayoutProvider({ children }: { children: ReactNode }) {
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
				{children}
				<Toaster
					position={toastPosition}
					mobileOffset={{ bottom: "5rem" }}
				/>
			</ProgressProvider>
		</ThemeProvider>
	);
}
