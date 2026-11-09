"use client";

import {
	BarbellIcon,
	NotebookIcon,
	RulerIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, UserAvatar } from "@/auth";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { navigationData } from "@/constants";
import { useHideOnScroll } from "@/hooks";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MobileDock } from "./mobile-dock";

const navIconMap: Record<string, React.ElementType> = {
	log: BarbellIcon,
	metrics: RulerIcon,
	progress: TrendUpIcon,
	plans: NotebookIcon,
};

export const Navigation = () => {
	const pathname = usePathname();
	const hidden = useHideOnScroll();

	const isActive = (href: string) =>
		pathname === href || pathname?.startsWith(`${href}/`);

	return (
		<>
			<div
				className={cn(
					"fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-full lg:max-w-3xl top-4",
					"transition-transform duration-300 ease-out",
					"motion-reduce:transition-none",
					hidden && "-translate-y-[calc(100%+2rem)]",
				)}
			>
				<header className="fcy justify-between gap-3 border border-border/60 bg-background px-2.5 py-2">
					<Link
						href="/dashboard"
						className="group fcy gap-2 pl-1.5 pr-2 text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-80 sh0"
					>
						<div className="fc size-7">
							<Logo className="size-full text-primary" />
						</div>
						<span className="text-xl tracking-tighter">
							Rep Deck
						</span>
					</Link>

					{/* Desktop nav */}
					<NavigationMenu className="hidden lg:flex">
						<NavigationMenuList className="fcy gap-0.5">
							{navigationData.map((item) => {
								const active = isActive(item.href);
								const Icon = navIconMap[item.id] ?? BarbellIcon;

								return (
									<NavigationMenuItem key={item.id}>
										<NavigationMenuLink
											render={<Link href={item.href} />}
											className={cn(
												"group relative fcy h-8 gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
												active
													? "text-primary"
													: "text-muted-foreground hover:text-foreground",
											)}
										>
											{active && (
												<motion.span
													layoutId="desktop-nav-active-pill"
													className="absolute inset-0 rounded-md bg-primary/10 -z-10"
													transition={{
														type: "spring",
														stiffness: 500,
														damping: 35,
													}}
												/>
											)}
											<Icon
												className="size-4 sh0"
												weight={
													active ? "fill" : "bold"
												}
											/>
											<span>{item.label}</span>
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>

					{/* Right-side controls — grouped with consistent gap */}
					<div className="fcy gap-2 sh0">
						<Separator
							orientation="vertical"
							className="h-6 mt-1"
						/>
						<Link
							href="/account"
							title="Account"
							aria-label="Account"
							className="fcy rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
						>
							<UserAvatar
								size="default"
								className="size-8 ring-1 ring-primary/20 base-ease hover:ring-primary/50"
							/>
						</Link>
						<SignOutButton
							variant="icon"
							className="border border-border/40 hover:border-destructive/40"
						/>
					</div>
				</header>
			</div>

			<MobileDock />
		</>
	);
};
