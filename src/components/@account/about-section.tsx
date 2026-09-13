"use client";

import { ArrowUpRightIcon, BugIcon, InfoIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/common";
import Link from "next/link";

export function AboutSection() {
	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<InfoIcon className="size-4" weight="bold" />
					</div>
					About
				</CardTitle>
			</CardHeader>

			<CardContent className="p-5 pt-0">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border border-border/40 bg-background/50 rounded-none transition-all duration-200 hover:border-primary/30">
					<div className="flex items-start gap-3">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<div className="fc size-6 shrink-0">
									<Logo className="size-full text-primary" />
								</div>
								<p className="text-xs font-bold text-foreground">
									Rep Deck
									<span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5">
										v0.1.0
									</span>
								</p>
							</div>
							<p className="text-[11px] text-muted-foreground">
								Built by{" "}
								<Link
									href="https://github.com/rudra-xi"
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium text-primary hover:underline inline-flex items-center gap-0.5 transition-colors"
								>
									rudra-xi
									<ArrowUpRightIcon
										className="size-3"
										weight="bold"
									/>
								</Link>
							</p>
						</div>
					</div>

					<Link
						href="https://github.com/rudra-xi/rep-deck/issues"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[11px] font-semibold text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 px-2.5 py-1.5 transition-all duration-200 shrink-0 rounded-none"
					>
						<BugIcon className="size-3.5" weight="bold" />
						Report an issue
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
