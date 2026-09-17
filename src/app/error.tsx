"use client";

import { useEffect } from "react";
import {
	WarningIcon,
	ArrowClockwiseIcon,
	HouseIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/common";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Hook in your error reporting here (Sentry, LogRocket, etc.)
		console.error("[GlobalError]", error);
	}, [error]);

	return (
		<main className="min-h-screen flex items-center justify-center p-6 bg-background">
			<div className="w-full max-w-md">
				<div className="fcard-flat p-8 sm:p-10 text-center">
					{/* Brand */}
					<div className="flex items-center justify-center mb-8">
						<div className="fc size-12">
							<Logo className="size-full text-primary" />
						</div>
					</div>

					{/* Icon */}
					<div className="inline-flex items-center justify-center border border-destructive/30 bg-destructive/10 p-3 text-destructive mb-4">
						<WarningIcon className="size-6" weight="fill" />
					</div>

					{/* Title */}
					<h1 className="text-sm font-bold uppercase tracking-wider text-foreground">
						Something went wrong
					</h1>

					{/* Description */}
					<p className="mt-2 text-[11px] text-muted-foreground max-w-xs mx-auto">
						An unexpected error occurred. Try refreshing the page —
						if it keeps happening, let us know.
					</p>

					{/* Error digest for support */}
					{error.digest && (
						<p className="mt-3 text-[10px] font-mono text-muted-foreground/60 break-all">
							Ref: {error.digest}
						</p>
					)}

					{/* Divider */}
					<Separator className={"my-6"}/>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
						<Button
							nativeButton={false}
							variant="ghost"
							className="flex-1 rounded-none border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-[11px] font-semibold text-muted-foreground h-auto py-2.5 base-ease"
							render={
								<Link href="/">
									<HouseIcon
										className="size-3.5"
										weight="bold"
									/>
									Home
								</Link>
							}
						></Button>
						<Button
							onClick={reset}
							className="flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-semibold h-auto py-2.5"
						>
							<ArrowClockwiseIcon
								className="size-3.5"
								weight="bold"
							/>
							Try again
						</Button>
					</div>
				</div>

				<p className="mt-4 text-center text-[10px] text-muted-foreground/60 uppercase tracking-wider">
					Rep Deck
				</p>
			</div>
		</main>
	);
}
