"use client";

import {
	ActivityIcon,
	MinusIcon,
	NotePencilIcon,
	RulerIcon,
	ScalesIcon,
	TargetIcon,
	TrendDownIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuickStats } from "@/hooks";
import { cn } from "@/lib/utils";
import { QuickStatsSkeleton } from "@/skeletons";

const iconMap = {
	NotePencilIcon,
	ScalesIcon,
	TargetIcon,
	RulerIcon,
	ActivityIcon,
};

interface QuickStatsProps {
	stats?: {
		notes?: string | null;
		weight?: { current: number | null; delta: number | null };
		bodyFat?: { current: number | null; delta: number | null };
		arms?: { current: number | null; delta: number | null };
	};
	loading?: boolean;
}

export function QuickStats({ stats, loading = false }: QuickStatsProps) {
	const { statCards } = useQuickStats(stats);

	// Loading State
	if (loading) return <QuickStatsSkeleton count={4} />;

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
			{statCards.map((card) => {
				const Icon =
					iconMap[card.icon as keyof typeof iconMap] ||
					NotePencilIcon;
				const isNotes =
					card.key === "notes" ||
					card.label.toLowerCase() === "notes";
				const isUp = card.trend?.direction === "up";
				const isDown = card.trend?.direction === "down";

				return (
					<Card
						key={card.label}
						size="sm"
						className="relative border border-secondary/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.15)]"
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
								{isNotes ? (
									<p
										className="text-xs font-medium text-foreground line-clamp-2 leading-tight capitalize"
										title={card.value || "No notes"}
									>
										{card.value || "No notes"}
									</p>
								) : (
									<span className="text-2xl font-bold tracking-tight text-foreground truncate">
										{card.value}
									</span>
								)}
							</div>

							<div className="flex items-center mt-1.5 gap-1.5 text-xs h-4">
								{isNotes ? (
									<span className="text-[10px] text-muted-foreground uppercase tracking-wider">
										Latest Log Entry
									</span>
								) : (
									<>
										{card.trend && (
											<span
												className={cn(
													"flex items-center gap-0.5 font-medium",
													isUp
														? "text-primary"
														: isDown
															? "text-destructive"
															: "text-muted-foreground",
												)}
											>
												{isUp ? (
													<TrendUpIcon
														className="size-3.5"
														weight="bold"
													/>
												) : isDown ? (
													<TrendDownIcon
														className="size-3.5"
														weight="bold"
													/>
												) : (
													<MinusIcon
														className="size-3.5"
														weight="bold"
													/>
												)}
												<span className="ml-0.5">
													{card.trend.value}
												</span>
											</span>
										)}
										{!card.trend && (
											<span className="text-muted-foreground">
												No recent change
											</span>
										)}
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
