"use client";

import Link from "next/link";
import {
	BarbellIcon,
	CalendarCheckIcon,
	CaretDownIcon,
	ScalesIcon,
	TrendDownIcon,
	TrendUpIcon,
	TrophyIcon,
	DotOutlineIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useKpiCards } from "@/hooks";

export interface KpiTrend {
	direction: "up" | "down" | "neutral";
	value?: string;
}

export interface KpiCardOption {
	label: string;
	value: string;
	targetValue: string;
	subtext?: string;
	trend?: KpiTrend;
}

export interface KpiCardData {
	id: string;
	label: string;
	value: string;
	subtext: string;
	action?: { href: string; label: string };
	dropdownOptions?: KpiCardOption[];
	trend?: KpiTrend;
}

interface KpiCardsProps {
	data?: {
		program?: KpiCardData;
		sessionsThisWeek?: KpiCardData;
		bestLift?: KpiCardData;
		bodyWeight?: KpiCardData;
	};
	loading?: boolean;
}

export function KpiCards({ data, loading = false }: KpiCardsProps) {
	const program = data?.program;
	const sessionsThisWeek = data?.sessionsThisWeek;
	const bestLift = data?.bestLift;
	const bodyWeight = data?.bodyWeight;

	const { selectedLiftValue, setSelectedLiftValue, getActiveLiftOption } =
		useKpiCards(bestLift?.dropdownOptions);

	const activeLiftOption = getActiveLiftOption(bestLift?.dropdownOptions);

	const cards = [
		{
			id: program?.id ?? "program",
			label: program?.label ?? "Program",
			value: program?.value ?? "—",
			subtext: program?.subtext ?? "No active program",
			action: program?.action,
			icon: BarbellIcon,
		},
		{
			id: sessionsThisWeek?.id ?? "sessions",
			label: sessionsThisWeek?.label ?? "Sessions this week",
			value: sessionsThisWeek?.value ?? "0",
			subtext: sessionsThisWeek?.subtext ?? "Target: 4",
			icon: CalendarCheckIcon,
		},
		{
			id: bestLift?.id ?? "best-lift",
			label: bestLift?.label ?? "Best Lift",
			value: activeLiftOption?.targetValue ?? bestLift?.value ?? "—",
			subtext:
				activeLiftOption?.subtext ??
				bestLift?.subtext ??
				"No data logged",
			trend: activeLiftOption?.trend ?? bestLift?.trend,
			icon: TrophyIcon,
			dropdownOptions: bestLift?.dropdownOptions,
		},
		{
			id: bodyWeight?.id ?? "body-weight",
			label: bodyWeight?.label ?? "Body weight",
			value: bodyWeight?.value ?? "—",
			subtext: bodyWeight?.subtext ?? "No records yet",
			trend: bodyWeight?.trend,
			icon: ScalesIcon,
			action: bodyWeight?.action,
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => {
				const Icon = card.icon;

				return (
					<Card
						key={card.id}
						size="sm"
						className="relative border border-secondary/50 bg-card/50 transition-colors hover:border-primary/50"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								{card.label}
							</CardTitle>

							<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
								<Icon className="size-4" weight="bold" />
							</div>
						</CardHeader>

						<CardContent>
							<div className="flex items-baseline justify-between gap-2 min-h-8">
								{/* Main Value Display */}
								{loading ? (
									<div className="flex items-center h-8">
										<Spinner className="size-4" />
									</div>
								) : (
									<div className="text-2xl font-bold tracking-tight text-foreground truncate">
										{card.value}
									</div>
								)}

								{/* Static Link Action */}
								{!loading &&
									card.action &&
									!card.dropdownOptions && (
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

								{/* Dropdown Action for Variant Lifts */}
								{!loading &&
									card.dropdownOptions &&
									card.dropdownOptions.length > 0 && (
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
												className="w-44"
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
															className="text-xs flex justify-between cursor-pointer"
														>
															<span>
																{option.label}
															</span>
															<span className="text-muted-foreground font-mono font-semibold ml-2">
																{
																	option.targetValue
																}
															</span>
														</DropdownMenuItem>
													),
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									)}
							</div>

							{/* Subtext and Trend Indicator */}
							<div className="flex items-center mt-1.5 gap-1.5 text-xs h-4">
								{loading ? (
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<Spinner className="size-3" />
									</div>
								) : (
									<>
										{card.trend && (
											<span
												className={`flex items-center gap-0.5 font-medium ${
													card.trend.direction ===
													"up"
														? "text-primary"
														: card.trend
																	.direction ===
															  "down"
															? "text-destructive"
															: "text-muted-foreground"
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
												{card.trend.value && (
													<span className="ml-0.5">
														{card.trend.value}
													</span>
												)}
											</span>
										)}
										<span className="text-muted-foreground truncate">
											{card.subtext}
										</span>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
