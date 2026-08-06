"use client";

import Link from "next/link";
import {
	GithubLogoIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { socialLinksData } from "@/constants";

// Icon mapping per Social Link ID
const socialIconMap = {
	1: GithubLogoIcon,
	2: LinkedinLogoIcon,
	3: InstagramLogoIcon,
};

export const Social = () => {
	return (
		<section className="w-full py-16 px-6 border-t border-border/40 bg-background">
			<div className="container max-w-4xl mx-auto text-center space-y-6">
				{/* Badge */}
				<div>
					<Badge
						variant="outline"
						className="px-3 py-1 text-xs uppercase tracking-wider border-foreground/30 text-primary"
					>
						Built by rudra-xi
					</Badge>
				</div>

				{/* Heading */}
				<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
					Stay connected.
				</h2>

				{/* Paragraph */}
				<p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
					Built by rudra-xi. Follow the journey, check project
					updates, and see what’s being built next.
				</p>

				{/* Social Links */}
				<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
					{socialLinksData.map((item) => {
						const SocialSpecificIcon =
							socialIconMap[
								item.id as keyof typeof socialIconMap
							] || GithubLogoIcon;

						return (
							<Link
								key={item.id}
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								className="fi gap-2 px-4 py-2 text-sm font-medium border border-border/80 bg-card/50 hover:bg-muted hover:border-primary/50 transition-colors"
							>
								<SocialSpecificIcon
									className="size-4"
									weight="bold"
								/>
								<span>{item.label}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
};
