"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
	text?: string;
	/** Optional className overrides */
	className?: string;
}

export const BackButton = ({ text = "Back", className }: BackButtonProps) => {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => router.back()}
			aria-label="Go back"
			className={cn(
				"w-fit h-7 gap-2 px-2 -ml-2 rounded-none",
				"text-[11px] uppercase tracking-widest font-semibold",
				"text-muted-foreground hover:text-primary",
				"hover:bg-primary/5",
				"transition-colors",
				className,
			)}
		>
			<ArrowLeftIcon className="size-3.5" weight="bold" />
			<span>{text}</span>
		</Button>
	);
};