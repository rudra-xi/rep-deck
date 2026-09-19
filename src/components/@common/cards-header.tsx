"use client";

import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardsHeaderProps {
	icon: Icon;
	title: string | ReactNode;
	trailing?: ReactNode;
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
			<CardTitle className="text-xs font-bold fupper text-foreground fcb gap-2.5">
				<div className="fcy gap-2.5 min-w-0">
					<div className="ficon-box sh0">
						<Icon className="size-4" weight="bold" />
					</div>
					<span className="truncate">{title}</span>
				</div>

				{trailing && <div className="fcy gap-1.5 sh0">{trailing}</div>}
			</CardTitle>
		</CardHeader>
	);
}
