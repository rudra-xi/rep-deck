"use client";

import { ArrowClockwiseIcon, WarningIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function RootGlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[RootGlobalError]", error);
	}, [error]);

	return (
		<html lang="en" className="violateeye h-full" suppressHydrationWarning>
			<body className="min-h-screen fc p-6 bg-background text-foreground antialiased">
				<div className="w-full max-w-md">
					<div className="fcard-flat p-8 sm:p-10 text-center">
						<div className="inline-flex border border-destructive/30 bg-destructive/10 p-3 text-destructive mb-4">
							<WarningIcon className="size-6" weight="fill" />
						</div>

						<h1 className="text-sm font-bold uppercase tracking-wider text-foreground">
							App failed to load
						</h1>

						<p className="mt-2 text-[11px] text-muted-foreground max-w-xs mx-auto">
							A critical error prevented the app from starting.
							Reloading usually fixes it.
						</p>

						{error.digest && (
							<p className="mt-3 text-[10px] font-mono text-muted-foreground/60 break-all">
								Ref: {error.digest}
							</p>
						)}

						<Separator className="my-6" />

						<Button
							onClick={reset}
							className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-semibold py-2.5 inline-flex gap-1.5 transition-colors"
						>
							<ArrowClockwiseIcon
								className="size-3.5"
								weight="bold"
							/>
							Reload app
						</Button>
					</div>
				</div>
			</body>
		</html>
	);
}
