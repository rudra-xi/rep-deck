"use client";

import {
	ArrowUpRightIcon,
	BugIcon,
	ChatTextIcon,
	EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardsHeader } from "@/common";
import { buildMailtoUrl, GITHUB_ISSUES } from "@/lib/contact";

const FEEDBACK_MAILTO = buildMailtoUrl({
	subject: "Rep Deck Feedback",
	body: [
		"Hi Rudra,",
		"",
		"Here's my feedback on Rep Deck:",
		"",
		"— ",
		"",
		"---",
		"App version: v0.1.0",
		"Browser/OS: ",
	].join("\n"),
});

export function FeedbackSection() {
	return (
		<Card className="fcard-flat card-ease hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardsHeader icon={ChatTextIcon} title="Feedback" />

			<CardContent className="p-5 pt-1 fcol3">
				{/* Description */}
				<div className="p-3 border border-border/40 bg-background/50 rounded-none">
					<p className="text-xs font-bold text-foreground">
						Something not working? Have an idea?
					</p>
					<p className="text-[11px] text-muted-foreground mt-0.5">
						Help improve Rep Deck by sharing your thoughts or
						reporting issues.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					<Button
						nativeButton={false}
						variant="outline"
						size="sm"
						className="h-9 px-3 text-xs font-semibold rounded-none border-border/60 gap-2 justify-start hover:border-primary/50 hover:bg-primary/5 hover:text-primary base-ease group"
						render={
							<Link href={FEEDBACK_MAILTO}>
								<div className="fc border border-primary/20 bg-primary/5 p-1 text-primary rounded-md sh0 group-hover:bg-primary/10 transition-colors">
									<EnvelopeSimpleIcon
										className="size-3.5"
										weight="bold"
									/>
								</div>
								Send feedback
							</Link>
						}
					/>

					<Button
						nativeButton={false}
						variant="outline"
						size="sm"
						className="h-9 px-3 text-xs font-semibold rounded-none border-border/60 gap-2 justify-start hover:border-primary/50 hover:bg-primary/5 hover:text-primary base-ease group"
						render={
							<Link
								href={GITHUB_ISSUES}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="fc border border-primary/20 bg-primary/5 p-1 text-primary rounded-md sh0 group-hover:bg-primary/10 transition-colors">
									<BugIcon
										className="size-3.5"
										weight="bold"
									/>
								</div>
								Report a bug
								<ArrowUpRightIcon
									className="size-3 ml-auto opacity-50 group-hover:opacity-100 transition-opacity"
									weight="bold"
								/>
							</Link>
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
