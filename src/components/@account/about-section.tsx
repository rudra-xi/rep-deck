"use client";

import {
	ArrowUpRightIcon,
	InfoIcon,
	GithubLogoIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { CardsHeader, Logo } from "@/common";
import Link from "next/link";
import { GITHUB_REPO } from "@/lib/contact";
import { CURRENT_VERSION } from "@/lib/roadmap";
import { RoadmapDialog } from "./roadmap-dialog";

export function AboutSection() {
	return (
		<Card className="fcard-flat">
			<CardsHeader icon={InfoIcon} title="About" />

			<CardContent className="p-5 pt-1">
				<div className="fcol sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border border-border/40 bg-background/50 rounded-none hover:border-primary/30 base-ease">
					<div className="fg3">
						<div className="fcol1">
							<div className="fg2">
								<div className="fc size-6 sh0">
									<Logo className="size-full text-primary" />
								</div>
								<p className="text-xs font-bold text-foreground">
									Rep Deck
									<span className="ml-2 ftext-2xs font-bold fupper text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5">
										{CURRENT_VERSION}
									</span>
								</p>
							</div>
							<p className="ftext-xs2 fmuted">
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

					<div className="fcy gap-2 sh0">
						<Link
							href={GITHUB_REPO}
							target="_blank"
							rel="noopener noreferrer"
							className="ftext-xs2 font-semibold fmuted hover:text-primary inline-flex items-center gap-1.5 border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 px-2.5 py-1.5 base-ease"
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
