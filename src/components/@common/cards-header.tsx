"use client";

import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardsHeaderProps {
	/** Phosphor icon component */
	icon: Icon;
	/** Title text (rendered uppercase via `fupper`) */
	title: string;
	/** Optional trailing content: badges, buttons, actions */
	trailing?: ReactNode;
	/** Optional className overrides on the CardHeader */
	className?: string;
}

export function CardsHeader({
	icon: Icon,
	title,
	trailing,
	className,
}: CardsHeaderProps) {
	return (
		<CardHeader className={cn("p-4 pb-2", className)}>
			<CardTitle className="text-xs font-bold fupper text-foreground flex items-center justify-between gap-2.5">
				<div className="flex items-center gap-2.5 min-w-0">
					<div className="ficon-box shrink-0">
						<Icon className="size-4" weight="bold" />
					</div>
					<span className="truncate">{title}</span>
				</div>

				{trailing && (
					<div className="flex items-center gap-1.5 shrink-0">
						{trailing}
					</div>
				)}
			</CardTitle>
		</CardHeader>
	);
}
