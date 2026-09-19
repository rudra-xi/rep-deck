"use client";

import {
	GithubLogoIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Logo } from "@/common";
import { socialLinksData } from "@/constants";

const socialIconMap = {
	1: GithubLogoIcon,
	2: LinkedinLogoIcon,
	3: InstagramLogoIcon,
} as const;

export const Footer = () => {
	return (
		<footer className="w-full border-t border-border/80 bg-background py-8 px-6">
			<div className="container max-w-6xl mx-auto fresp">
				<div className="fg2">
					<div className="fc size-7">
						<Logo className="size-full text-primary" />
					</div>
					<span className="font-extrabold uppercase tracking-wider text-sm">
						Rep Deck
					</span>
					<span className="text-muted-foreground text-xs">
						© {new Date().getFullYear()} rudra-xi. All rights
						reserved.
					</span>
				</div>

				<div className="fg6 text-xs text-muted-foreground uppercase tracking-wider font-medium">
					<Link
						href="/privacy"
						className="hover:text-foreground transition-colors"
					>
						Privacy Policy
					</Link>
					<Link
						href="/terms"
						className="hover:text-foreground transition-colors"
					>
						Terms of Service
					</Link>
				</div>

				<div className="fg2">
					{socialLinksData.map((item) => {
						const SocialSpecificIcon =
							socialIconMap[
								item.id as keyof typeof socialIconMap
							] ?? GithubLogoIcon;

						return (
							<Link
								key={item.id}
								href={item.href}
								target="_blank"
								rel="noreferrer"
								className="fc p-2 border border-border/80 hover:border-primary/50 bg-card/50 transition-colors rounded-sm"
								aria-label={item.label}
							>
								<SocialSpecificIcon
									className="size-4"
									weight="bold"
								/>
							</Link>
						);
					})}
				</div>
			</div>
		</footer>
	);
};
