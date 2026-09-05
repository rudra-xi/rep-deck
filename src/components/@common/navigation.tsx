"use client";

import {
	BarbellIcon,
	InfoIcon,
	ListIcon,
	NotebookIcon,
	PersonIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/assets/image";
import { SignOutButton, UserAvatar } from "@/auth";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { navigationData } from "@/constants";
import { Separator } from "@/components/ui/separator";

// Phosphor React Icon Mapping
const navIconMap: Record<number, React.ElementType> = {
	1: NotebookIcon,
	2: TrendUpIcon,
	3: BarbellIcon,
	4: InfoIcon,
	5: PersonIcon,
};

export const Navigation = () => {
	const [open, setOpen] = useState(false);

	return (
		<div className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-full lg:max-w-6/10 top-4">
			<header className="fcb rounded-xl border border-border/80 bg-background/60 px-3 py-2 shadow-xl backdrop-blur-md">
				{/* --- Left Side: Always-Visible Logo & Brand --- */}
				<Link
					href="/dashboard"
					className="fcy sh0 gap-2 text-sm font-extrabold uppercase tracking-wider lg:text-base text-foreground hover:opacity-90 transition-opacity"
				>
					<div className="fc size-7">
						<Image
							src={Logo}
							alt="Rep Deck Logo"
							className="object-contain"
						/>
					</div>
					<span>Rep Deck</span>
				</Link>

				{/* --- Right Side: Desktop Inline Navigation --- */}
				<NavigationMenu className="hidden lg:flex">
					<NavigationMenuList className="fcy gap-1">
						{navigationData.map((item) => {
							const NavSpecificIcon =
								navIconMap[item.id] || BarbellIcon;

							return (
								<NavigationMenuItem key={item.id}>
									<NavigationMenuLink
										render={<Link href={item.href} />}
										className={`${navigationMenuTriggerStyle()} fcy h-8 gap-1.5 px-3 text-xs font-semibold uppercase tracking-wider cursor-pointer`}
										title={item.label}
									>
										<NavSpecificIcon
											className="size-4 sh0"
											weight="bold"
										/>
										<span>{item.label}</span>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}
						
						{/* Desktop Avatar and Sign Out Button */}
						<NavigationMenuItem className="pl-6 fcy gap-4">
						<Separator orientation="vertical"/>
							<Link href="/account" title="Account">
								<UserAvatar size="default" />
							</Link>
							<SignOutButton variant="icon" className="" />
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* --- Right Side: Mobile Sheet Drawer --- */}
				<div className="lg:hidden">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger
							aria-label="Open Navigation Menu"
							className="fc size-8 rounded-lg border border-border/60 bg-accent/30 transition-colors hover:bg-accent focus-visible:outline-none"
						>
							<ListIcon
								className="size-5 text-foreground"
								weight="bold"
							/>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="w-72 p-6 fcol justify-between"
						>
							<div>
								{/* Mobile Sheet Header */}
								<SheetHeader className="text-left mb-6">
									<SheetTitle className="fcy gap-2 text-base font-extrabold uppercase tracking-wider">
										<div className="fc size-6 sh0">
											<Image
												src={Logo}
												alt="Rep Deck Logo"
												className="object-contain"
											/>
										</div>
										Rep Deck
									</SheetTitle>
								</SheetHeader>

								{/* Navigation Links */}
								<nav className="fcol gap-1.5">
									{navigationData.map((item) => {
										const NavSpecificIcon =
											navIconMap[item.id] || BarbellIcon;

										return (
											<SheetClose
												nativeButton={false}
												key={item.id}
												render={
													<Link href={item.href} />
												}
											>
												<div className="fcy gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent">
													<NavSpecificIcon
														className="size-4 sh0 text-primary"
														weight="bold"
													/>
													<span>{item.label}</span>
												</div>
											</SheetClose>
										);
									})}
								</nav>
							</div>

							{/* Drawer Footer: Account & Logout Action */}
							<div className="border-t border-border/60 pt-4 fcb">
								<SheetClose
									nativeButton={false}
									render={<Link href="/account" />}
								>
									<div className="fcy gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors cursor-pointer">
										<UserAvatar size="default" />
										<span>Account</span>
									</div>
								</SheetClose>

								<SignOutButton variant="default" />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</header>
		</div>
	);
};
