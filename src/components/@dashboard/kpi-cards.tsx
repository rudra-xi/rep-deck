"use client";

import {
	BarbellIcon,
	CalendarCheckIcon,
	CaretDownIcon,
	DotOutlineIcon,
	ScalesIcon,
	TrendDownIcon,
	TrendUpIcon,
	TrophyIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useUnits } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKpiCards } from "@/hooks";
import { KpiCardsSkeleton } from "@/skeletons";

export interface KpiTrend {
	direction: "up" | "down" | "neutral";
	value?: string;
	rawDiffKg?: number;
}

export interface KpiCardOption {
	label: string;
	value: string;
	targetValue: string;
	rawWeightKg?: number;
	subtext?: string;
	trend?: KpiTrend;
}

export interface KpiCardData {
	id: string;
	label: string;
	value: string;
	rawWeightKg?: number;
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
	const { fmtWeightStr } = useUnits();

	const program = data?.program;
	const sessionsThisWeek = data?.sessionsThisWeek;
	const bestLift = data?.bestLift;
	const bodyWeight = data?.bodyWeight;

	const { setSelectedLiftValue, getActiveLiftOption } = useKpiCards(
		bestLift?.dropdownOptions,
	);

	const activeLiftOption = getActiveLiftOption(bestLift?.dropdownOptions);

	const formattedBestLiftValue = activeLiftOption?.rawWeightKg
		? fmtWeightStr(activeLiftOption.rawWeightKg)
		: (activeLiftOption?.targetValue ?? bestLift?.value ?? "—");

	const activeLiftTrend = activeLiftOption?.trend;
	const formattedLiftTrendValue =
		activeLiftTrend?.rawDiffKg !== undefined
			? `${activeLiftTrend.direction === "up" ? "+" : activeLiftTrend.direction === "down" ? "-" : ""}${fmtWeightStr(activeLiftTrend.rawDiffKg)}`
			: activeLiftTrend?.value;

	const formattedBodyWeightValue = bodyWeight?.rawWeightKg
		? fmtWeightStr(bodyWeight.rawWeightKg)
		: (bodyWeight?.value ?? "—");

	const bodyWeightTrend = bodyWeight?.trend;
	const formattedBodyWeightTrendValue =
		bodyWeightTrend?.rawDiffKg !== undefined
			? `${bodyWeightTrend.direction === "up" ? "+" : bodyWeightTrend.direction === "down" ? "-" : ""}${fmtWeightStr(bodyWeightTrend.rawDiffKg)}`
			: bodyWeightTrend?.value;

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
			subtext: sessionsThisWeek?.subtext ?? "Target: 0",
			icon: CalendarCheckIcon,
		},
		{
			id: bestLift?.id ?? "best-lift",
			label: bestLift?.label ?? "Best Lift",
			value: formattedBestLiftValue,
			subtext:
				activeLiftOption?.subtext ??
				bestLift?.subtext ??
				"No data logged",
			trend: activeLiftTrend
				? { ...activeLiftTrend, value: formattedLiftTrendValue }
				: undefined,
			icon: TrophyIcon,
			dropdownOptions: bestLift?.dropdownOptions,
		},
		{
			id: bodyWeight?.id ?? "body-weight",
			label: bodyWeight?.label ?? "Body weight",
			value: formattedBodyWeightValue,
			subtext: bodyWeight?.subtext ?? "No records yet",
			trend: bodyWeightTrend
				? { ...bodyWeightTrend, value: formattedBodyWeightTrendValue }
				: undefined,
			icon: ScalesIcon,
			action: bodyWeight?.action,
		},
	];

	if (loading) return <KpiCardsSkeleton count={4} />;

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => {
				const Icon = card.icon;

				return (
					<Card
						key={card.id}
						size="sm"
						className="relative fcard-flat base-ease card-ease"
					>
						<CardHeader className="flex fr items-center justify-between space-y-0 pb-2">
							<CardTitle className="fcard-label">
								{card.label}
							</CardTitle>
							<div className="ficon-box">
								<Icon className="size-4" weight="bold" />
							</div>
						</CardHeader>

						<CardContent>
							<div className="flex items-baseline justify-between gap-2 min-h-8">
								<div className="text-2xl font-bold tracking-tight text-foreground ">
									{card.value}
								</div>

								{card.action && !card.dropdownOptions && (
									<Button
										nativeButton={false}
										variant="link"
										size="sm"
										className="h-auto p-0 fmuted hover:text-primary text-xs"
										render={
											<Link href={card.action.href}>
												{card.action.label}
											</Link>
										}
									/>
								)}

								{card.dropdownOptions &&
									card.dropdownOptions.length > 0 && (
										<DropdownMenu>
											<DropdownMenuTrigger
												render={
													<Button
														variant="ghost"
														size="sm"
														className="h-7 px-2 text-xs fmuted hover:text-foreground fg1 border border-border/50"
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
													(option) => {
														const formattedOptionValue =
															option.rawWeightKg
																? fmtWeightStr(
																		option.rawWeightKg,
																	)
																: option.targetValue;
														return (
															<DropdownMenuItem
																key={
																	option.value
																}
																onClick={() =>
																	setSelectedLiftValue(
																		option.value,
																	)
																}
																className="text-xs flex justify-between cursor-pointer"
															>
																<span>
																	{
																		option.label
																	}
																</span>
																<span className="fmuted  font-semibold ml-2">
																	{
																		formattedOptionValue
																	}
																</span>
															</DropdownMenuItem>
														);
													},
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									)}
							</div>

							<div className="fg1_5 mt-1.5 text-xs h-4">
								{card.trend && (
									<span
										className={`fcy gap-0.5 font-medium ${
											card.trend.direction === "up"
												? "text-primary"
												: card.trend.direction ===
														"down"
													? "text-destructive"
													: "fmuted"
										}`}
									>
										{card.trend.direction === "up" ? (
											<TrendUpIcon
												className="size-3"
												weight="bold"
											/>
										) : card.trend.direction === "down" ? (
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
								<span className="fmuted ">{card.subtext}</span>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
