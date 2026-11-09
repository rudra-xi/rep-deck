"use client";

import {
	BarbellIcon,
	HouseIcon,
	NotebookIcon,
	RulerIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHideOnScroll } from "@/hooks";
import { cn } from "@/lib/utils";

const DOCK_ITEMS = [
	{ id: "dashboard", href: "/dashboard", label: "Home", icon: HouseIcon },
	{ id: "log", href: "/workout-log", label: "Log", icon: BarbellIcon },
	{ id: "metrics", href: "/metrics", label: "Metrics", icon: RulerIcon },
	{
		id: "progress",
		href: "/progress",
		label: "Progress",
		icon: TrendUpIcon,
	},
	{ id: "plans", href: "/plans", label: "Plans", icon: NotebookIcon },
] as const;

export function MobileDock() {
	const pathname = usePathname();
	const hidden = useHideOnScroll();

	return (
		<nav
			aria-label="Primary"
			className={cn(
				"lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
				"transition-transform duration-300 ease-out",
				"motion-reduce:transition-none",
				hidden && "translate-y-[calc(100%+2rem)]",
			)}
			style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
		>
			<div className="fcy gap-1 px-2 py-1.5 bg-secondary/85 backdrop-blur-md border border-border/60 shadow-lg shadow-black/20">
				{DOCK_ITEMS.map((item) => {
					const active =
						pathname === item.href ||
						pathname?.startsWith(`${item.href}/`);
					const Icon = item.icon;

					return (
						<Link
							key={item.id}
							href={item.href}
							aria-current={active ? "page" : undefined}
							aria-label={item.label}
							className={cn(
								"group relative fc fcol gap-0.5 w-14 h-12 transition-colors",
								active
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
							)}
						>
							{active && (
								<motion.span
									layoutId="dock-active-indicator"
									className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-primary rounded-b-sm"
									transition={{
										type: "spring",
										stiffness: 500,
										damping: 35,
									}}
								/>
							)}
							<Icon
								className="size-4.5 transition-transform duration-200 group-hover:scale-110"
								weight={active ? "fill" : "bold"}
							/>
							<span className="text-[9px] font-semibold leading-none">
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
