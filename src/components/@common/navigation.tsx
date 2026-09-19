"use client";

import {
	BarbellIcon,
	CaretRightIcon,
	ListIcon,
	NotebookIcon,
	RulerIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOutButton, UserAvatar } from "@/auth";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { navigationData, navigationGroupOrder } from "@/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const navIconMap: Record<string, React.ElementType> = {
	log: BarbellIcon,
	metrics: RulerIcon,
	progress: TrendUpIcon,
	plans: NotebookIcon,
};

function NavGroup({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-5 last:mb-0">
			<p className="ftext-2xs fmuted fupper font-bold tracking-[0.18em] px-3 mb-1.5">
				{label}
			</p>
			<div className="space-y-0.5">{children}</div>
		</div>
	);
}

function NavLink({
	href,
	icon: Icon,
	label,
	description,
	active,
	primary,
	onNavigate,
}: {
	href: string;
	icon: React.ElementType;
	label: string;
	description?: string;
	active: boolean;
	primary?: boolean;
	onNavigate: () => void;
}) {
	return (
		<SheetClose
			nativeButton={false}
			render={<Link href={href} />}
			onClick={onNavigate}
		>
			<div
				className={cn(
					"fcy gap-3 px-3 py-2.5 transition-colors",
					primary && "py-3",
					active
						? "bg-primary/10 text-primary"
						: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
				)}
			>
				<div
					className={cn(
						"ficon-box-xs sh0",
						active && "border-primary bg-primary/15",
					)}
				>
					<Icon
						className="size-3.5"
						weight={active ? "fill" : "bold"}
					/>
				</div>

				<div className="fgrow min-w-0">
					<p
						className={cn(
							"text-sm font-medium truncate",
							active && "font-bold",
						)}
					>
						{label}
					</p>
					{description && (
						<p className="ftext-2xs fmuted truncate">
							{description}
						</p>
					)}
				</div>

				<CaretRightIcon className="size-3.5 sh0 opacity-50" />
			</div>
		</SheetClose>
	);
}

interface NavigationProps {
	userName?: string;
}

export const Navigation = ({ userName = "Account" }: NavigationProps) => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const isActive = (href: string) =>
		pathname === href || pathname?.startsWith(`${href}/`);

	const groupedItems = navigationGroupOrder
		.map((group) => ({
			group,
			items: navigationData.filter((item) => item.group === group),
		}))
		.filter(({ items }) => items.length > 0);

	return (
		<div className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-full lg:max-w-3xl top-4">
			<header className="fcy justify-between gap-2 border border-border/60 bg-background px-2.5 py-2">
				<Link
					href="/dashboard"
					className="group fcy gap-2 pl-1.5 pr-2 text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
				>
					<div className="fc size-7">
						<Logo className="size-full text-primary" />
					</div>
					<span className="text-xl tracking-tighter">Rep Deck</span>
				</Link>

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
											"group relative fcy h-8  gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
											active
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
										)}
									>
										<Icon
											className="size-4 sh0"
											weight={active ? "fill" : "bold"}
										/>
										<span>{item.label}</span>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}

						<NavigationMenuItem className="ml-2 fcy gap-3 pl-4">
							<Separator orientation="vertical" className="h-6" />
							<Link
								href="/account"
								title="Account"
								className="rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
							>
								<UserAvatar
									size="default"
									className="size-8 ring-1 ring-primary/20 base-ease hover:ring-primary/50"
								/>
							</Link>
							<SignOutButton variant="icon" />
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<div className="lg:hidden">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger
							aria-label="Open navigation menu"
							className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-accent/30 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
						>
							<ListIcon
								className="size-5 text-foreground"
								weight="bold"
							/>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="flex w-[85vw] max-w-sm flex-col p-0"
						>
							<SheetHeader className="fr items-center justify-between p-5 border-b border-border/60">
								<SheetTitle className="fcy gap-2 text-sm font-bold tracking-tight">
									<div className="flex size-6 items-center justify-center">
										<Logo className="size-full text-primary" />
									</div>
									Rep Deck
								</SheetTitle>
							</SheetHeader>

							<div className="fgrow overflow-y-auto px-3 py-4">
								{groupedItems.map(({ group, items }) => (
									<NavGroup key={group} label={group}>
										{items.map((item) => (
											<NavLink
												key={item.id}
												href={item.href}
												icon={
													navIconMap[item.id] ??
													BarbellIcon
												}
												label={item.label}
												description={item.description}
												active={isActive(item.href)}
												primary={item.id === "log"}
												onNavigate={() =>
													setOpen(false)
												}
											/>
										))}
									</NavGroup>
								))}
							</div>

							<div className="border-t border-border/60 p-3 space-y-1">
								<SheetClose
									nativeButton={false}
									render={<Link href="/account" />}
								>
									<div className="fcy gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors">
										<UserAvatar
											size="default"
											className="size-9 ring-1 ring-primary/20 sh0"
										/>
										<div className="fgrow min-w-0">
											<p className="text-xs font-bold text-foreground truncate">
												{userName}
											</p>
											<p className="ftext-xs2 fmuted truncate">
												View profile
											</p>
										</div>
										<CaretRightIcon className="size-3.5 fmuted sh0" />
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
