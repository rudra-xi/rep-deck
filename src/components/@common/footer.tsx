"use client";

import {
	GithubLogoIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/assets/image";
import { socialLinksData } from "@/constants";

// Icon mapping per Social Link ID
const socialIconMap = {
	1: GithubLogoIcon,
	2: LinkedinLogoIcon,
	3: InstagramLogoIcon,
};

export const Footer = () => {
	return (
		<footer className="w-full border-t border-border/80 bg-background py-8 px-6">
			<div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
				{/* Brand & Copyright */}
				<div className="flex items-center gap-3">
					<div className="size-6 flex items-center justify-center">
						<Image
							src={Logo}
							alt="Rep Deck Logo"
							className="object-contain"
						/>
					</div>
					<span className="font-extrabold uppercase tracking-wider text-sm">
						Rep Deck
					</span>
					<span className="text-muted-foreground text-xs">
						© {new Date().getFullYear()} rudra-xi. All rights
						reserved.
					</span>
				</div>

				{/* Legal Links */}
				<div className="flex items-center gap-6 text-xs text-muted-foreground uppercase tracking-wider font-medium">
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

				{/* Social Row mapped from constants */}
				<div className="flex items-center gap-2">
					{socialLinksData.map((item) => {
						const SocialSpecificIcon =
							socialIconMap[
								item.id as keyof typeof socialIconMap
							] || GithubLogoIcon;

						return (
							<a
								key={item.id}
								href={item.href}
								target="_blank"
								rel="noreferrer"
								className="p-2 border border-border/80 hover:border-primary/50 bg-card/50 transition-colors"
								aria-label={item.label}
							>
								<SocialSpecificIcon
									className="size-4"
									weight="bold"
								/>
							</a>
						);
					})}
				</div>
			</div>
		</footer>
	);
};
