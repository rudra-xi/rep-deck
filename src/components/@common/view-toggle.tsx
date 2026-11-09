// components/@common/view-toggle.tsx
"use client";

import { ChartLineIcon, TableIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "chart" | "table";

interface ViewToggleProps {
	view: ViewMode;
	onChange: (view: ViewMode) => void;
	className?: string;
}

export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
	return (
		<div
			className={cn(
				"flex border border-border/50 p-0.5 bg-background",
				className,
			)}
		>
			<Button
				size="sm"
				variant={view === "chart" ? "default" : "ghost"}
				onClick={() => onChange("chart")}
				className="h-5 px-1.5 rounded-none"
				aria-label="Chart view"
				title="Chart view"
			>
				<ChartLineIcon className="size-3" weight="bold" />
			</Button>
			<Button
				size="sm"
				variant={view === "table" ? "default" : "ghost"}
				onClick={() => onChange("table")}
				className="h-5 px-1.5 rounded-none"
				aria-label="Table view"
				title="Table view"
			>
				<TableIcon className="size-3" weight="bold" />
			</Button>
		</div>
	);
}
