"use client";

import {
	ArrowUpRightIcon,
	InfoIcon,
	GithubLogoIcon
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/common";
import Link from "next/link";
import { GITHUB_REPO } from "@/lib/contact";
import { CURRENT_VERSION } from "@/lib/roadmap";
import { RoadmapDialog } from "./roadmap-dialog";

export function AboutSection() {
	return (
		<Card className="...">
			{/* ...header unchanged... */}
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
										{CURRENT_VERSION}
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

					<div className="flex items-center gap-2 shrink-0">
						<Link
							href={GITHUB_REPO}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[11px] font-semibold text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 px-2.5 py-1.5 transition-all duration-200 rounded-none"
						>
							<GithubLogoIcon
								className="size-3.5"
								weight="bold"
							/>
							Source
						</Link>

						<RoadmapDialog />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
