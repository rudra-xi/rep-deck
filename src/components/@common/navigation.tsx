"use client";

import {
	BarbellIcon,
	InfoIcon,
	NotebookIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/assets/image";
import { SignOutButton } from "@/auth";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navigationData } from "@/constants";

// Icon mapping per Navigation ID (Updated to standard Phosphor icon names)
const navIconMap = {
	1: NotebookIcon,
	2: TrendUpIcon,
	3: BarbellIcon,
	4: InfoIcon,
};

export const Navigation = () => {
	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
			<header className="w-full border border-border/80 bg-background/90 backdrop-blur-md px-4 py-2.5 shadow-xl flex items-center justify-between">
				{/* Left: Brand Logo */}
				<Link
					href="/dashboard"
					className="flex items-center gap-2 font-extrabold tracking-wider uppercase text-sm lg:text-base shrink-0"
				>
					<div className="size-7 flex items-center justify-center">
						<Image
							src={Logo}
							alt="Rep Deck Logo"
							className="object-contain"
						/>
					</div>
					<span className="hidden lg:inline">Rep Deck</span>
				</Link>

				{/* Center/Right: Navigation Links & Auth Actions */}
				<NavigationMenu>
					<NavigationMenuList className="gap-0.5 lg:gap-1 items-center">
						{navigationData.map((item) => {
							const NavSpecificIcon =
								navIconMap[
									item.id as keyof typeof navIconMap
								] || BarbellIcon;

							return (
								<NavigationMenuItem key={item.id}>
									<NavigationMenuLink
										render={<Link href={item.href} />}
										className={`${navigationMenuTriggerStyle()} uppercase text-[11px] lg:text-xs tracking-wider cursor-pointer font-semibold px-2.5 lg:px-3 h-8 flex items-center gap-1.5`}
									>
										<NavSpecificIcon
											className="size-3.5 lg:size-4"
											weight="bold"
										/>
										<span>{item.label}</span>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}

						{/* Sign Out Button integrated inside Navigation Menu */}
						<NavigationMenuItem className="pl-1">
							<SignOutButton variant="icon" className="h-8 w-8" />
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</header>
		</div>
	);
};
