"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
	PaintBrushIcon,
	BuildingsIcon,
	DropIcon,
	FlowerIcon,
	MoonStarsIcon,
	TargetIcon,
	FireIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
	{ value: "enterprise", label: "Enterprise", icon: BuildingsIcon },
	{ value: "zen", label: "Zen", icon: MoonStarsIcon },
	{ value: "opcl", label: "OPCL", icon: TargetIcon },
	{ value: "qraft", label: "qrafthive", icon: DropIcon },
	{ value: "rosepine", label: "Rose Pine", icon: FlowerIcon },
	{ value: "barmell", label: "Barmell", icon: FireIcon },
] as const;

export function ThemeSection() {
	const { theme, setTheme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	// next-themes can't know the active theme during SSR — wait until mount
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		const label =
			THEME_OPTIONS.find((t) => t.value === newTheme)?.label ?? newTheme;
		toast.success(`Theme set to ${label}`);
	};

	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<PaintBrushIcon className="size-4" weight="bold" />
					</div>
					App Theme
				</CardTitle>
			</CardHeader>

			<CardContent className="p-5 pt-0">
				{isMounted ? (
					<RadioGroup
						value={theme}
						onValueChange={handleThemeChange}
						className="grid grid-cols-2 sm:grid-cols-3 gap-2"
					>
						{THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
							const isSelected = theme === value;
							return (
								<div key={value}>
									<RadioGroupItem
										value={value}
										id={`theme-${value}`}
										className="sr-only peer"
									/>
									<Label
										htmlFor={`theme-${value}`}
										className={cn(
											"group flex flex-col items-center justify-center gap-1.5 border p-4 cursor-pointer rounded-none text-[10px] font-bold uppercase tracking-wider text-center transition-all duration-200",
											isSelected
												? "border-primary bg-primary/10 text-primary shadow-[0_0_20px_-8px_rgba(var(--primary),0.3)]"
												: "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
										)}
									>
										<Icon
											className={cn(
												"size-5 transition-colors",
												isSelected
													? "text-primary"
													: "text-muted-foreground group-hover:text-primary",
											)}
											weight={
												isSelected ? "fill" : "bold"
											}
										/>
										{label}
									</Label>
								</div>
							);
						})}
					</RadioGroup>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
							<div
								key={value}
								className="group flex flex-col items-center justify-center gap-1.5 border p-4 rounded-none text-[10px] font-bold uppercase tracking-wider text-center border-border/50 bg-background/50 text-muted-foreground"
							>
								<Icon
									className="size-5 text-muted-foreground"
									weight="bold"
								/>
								{label}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
