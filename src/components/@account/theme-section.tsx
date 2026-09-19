"use client";

import {
	CalendarCheckIcon,
	EyeIcon,
	FlowerIcon,
	FlowerLotusIcon,
	GameControllerIcon,
	LeafIcon,
	PaintBrushIcon,
	PlanetIcon,
	PlantIcon,
} from "@phosphor-icons/react";
import { CardsHeader } from "@/common";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { THEME_OPTIONS, type ThemeSlug, useThemeSelection } from "@/hooks";
import { cn } from "@/lib/utils";

const THEME_ICONS: Record<ThemeSlug, React.ElementType> = {
	green: PlantIcon,
	violateeye: EyeIcon,
	rosepine: FlowerIcon,
	retro: GameControllerIcon,
	cosmic: PlanetIcon,
	orchid: FlowerLotusIcon,
	booking: CalendarCheckIcon,
	lime: LeafIcon,
};

export function ThemeSection() {
	const { theme, isMounted, handleThemeChange } = useThemeSelection();

	return (
		<Card
			size="sm"
			className="fcard-flat card-ease hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]"
		>
			<CardsHeader icon={PaintBrushIcon} title="App Theme" />

			<CardContent className="p-5 pt-1">
				{isMounted ? (
					<RadioGroup
						value={theme}
						onValueChange={handleThemeChange}
						className="grid grid-cols-2 sm:grid-cols-4 gap-2"
					>
						{THEME_OPTIONS.map(({ value, label }) => {
							const Icon = THEME_ICONS[value];
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
											"group fcol items-center justify-center gap-1.5 border p-4 cursor-pointer rounded-none text-[10px] font-bold uppercase tracking-wider text-center base-ease",
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
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
						{THEME_OPTIONS.map(({ value, label }) => {
							const Icon = THEME_ICONS[value];
							return (
								<div
									key={value}
									className="group fcol items-center justify-center gap-1.5 border p-4 rounded-none text-[10px] font-bold uppercase tracking-wider text-center border-border/50 bg-background/50 text-muted-foreground"
								>
									<Icon
										className="size-5 text-muted-foreground"
										weight="bold"
									/>
									{label}
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
