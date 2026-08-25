"use client";

import {
	BarbellIcon,
	CalendarCheckIcon,
	CaretDownIcon,
	DotIcon,
	MinusIcon,
	ScalesIcon,
	TrendDownIcon,
	TrendUpIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { KpiCardData } from "@/constants/mock-data";
import { DotOutlineIcon } from "@phosphor-icons/react/dist/ssr";

interface KpiCardsProps {
	data?: {
		program?: KpiCardData;
		sessionsThisWeek?: KpiCardData;
		bestLift?: KpiCardData;
		bodyWeight?: KpiCardData;
	};
}

export function KpiCards({ data }: KpiCardsProps) {
	const program = data?.program;
	const sessionsThisWeek = data?.sessionsThisWeek;
	const bestLift = data?.bestLift;
	const bodyWeight = data?.bodyWeight;

	// State to control selected best lift variant dynamically
	const [selectedLiftValue, setSelectedLiftValue] = useState(
		bestLift?.dropdownOptions?.[0]?.value ?? "bench",
	);

	const activeLiftOption = bestLift?.dropdownOptions?.find(
		(opt) => opt.value === selectedLiftValue,
	);

	const cards = [
		{
			...program,
			id: program?.id ?? "program",
			label: program?.label ?? "Program",
			value: program?.value ?? "—",
			subtext: program?.subtext ?? "No active program",
			icon: BarbellIcon,
		},
		{
			...sessionsThisWeek,
			id: sessionsThisWeek?.id ?? "sessions",
			label: sessionsThisWeek?.label ?? "Sessions this week",
			value: sessionsThisWeek?.value ?? "0",
			subtext: sessionsThisWeek?.subtext ?? "Target: 0",
			icon: CalendarCheckIcon,
		},
		{
			...bestLift,
			id: bestLift?.id ?? "best-lift",
			label: bestLift?.label ?? "Best Lift (Last 30d)",
			value: activeLiftOption?.targetValue ?? bestLift?.value ?? "—",
			subtext:
				activeLiftOption?.subtext ?? bestLift?.subtext ?? "No data",
			icon: TrophyIcon,
			dropdownOptions: bestLift?.dropdownOptions,
		},
		{
			...bodyWeight,
			id: bodyWeight?.id ?? "body-weight",
			label: bodyWeight?.label ?? "Body weight",
			value: bodyWeight?.value ?? "—",
			subtext: bodyWeight?.subtext ?? "No data",
			icon: ScalesIcon,
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => {
				const Icon = card.icon;

				return (
					<Card
						size="sm"
						key={card.id}
						className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 w-98 lg:w-full"
					>
						<CardHeader className="space-y-0 pb-2 flex fcb">
							<CardTitle className="text-xs font-medium uppercase tracking-wider text-foreground">
								{card.label}
							</CardTitle>

							<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
								<Icon className="size-4" weight="bold" />
							</div>
						</CardHeader>

						<CardContent>
							<div className="fbe gap-2">
								<div className="text-2xl font-bold tracking-tight text-foreground">
									{card.value}
								</div>

								{/* Static Link Action */}
								{card.action && !card.dropdownOptions && (
									<Button
										nativeButton={false}
										variant="link"
										size="sm"
										className="h-auto p-0 text-muted-foreground hover:text-primary text-xs"
										render={
											<Link href={card.action.href}>
												{card.action.label}
											</Link>
										}
									/>
								)}

								{/* Shadcn Dropdown Action for Variants */}
								{card.dropdownOptions && (
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													variant="ghost"
													size="sm"
													className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border/50"
												>
													{activeLiftOption?.label ??
														"Select"}
													<CaretDownIcon className="size-3" />
												</Button>
											}
										/>
										<DropdownMenuContent
											align="end"
											className="w-40"
										>
											{card.dropdownOptions.map(
												(option) => (
													<DropdownMenuItem
														key={option.value}
														onClick={() =>
															setSelectedLiftValue(
																option.value,
															)
														}
														className="text-xs fcb cursor-pointer"
													>
														{option.label}
													</DropdownMenuItem>
												),
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>

							<div className="fcy mt-1.5 gap-1.5 text-xs">
								{card.trend && (
									<span
										className={`fcx gap-0.5 font-medium ${
											card.trend.direction === "up"
												? "text-primary"
												: card.trend.direction ===
													  "down"
													? "text-destructive"
													: "text-muted-foreground"
										}`}
									>
										{card.trend && (
											<span
												className={`fcx gap-0.5 font-medium ${
													card.trend.direction ===
													"up"
														? "text-primary"
														: card.trend
																	.direction ===
															  "down"
															? "text-destructive"
															: "text-foreground"
												}`}
											>
												{card.trend.direction ===
												"up" ? (
													<TrendUpIcon
														className="size-3"
														weight="bold"
													/>
												) : card.trend.direction ===
												  "down" ? (
													<TrendDownIcon
														className="size-3"
														weight="bold"
													/>
												) : (
													<DotOutlineIcon
														className="size-3"
														weight="bold"
													/>
												)}
											</span>
										)}
									</span>
								)}
								<span className="text-muted-foreground">
									{card.subtext}
								</span>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
