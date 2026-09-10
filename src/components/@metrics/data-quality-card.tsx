"use client";

import { ShieldCheckIcon, WarningIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useDataQuality } from "@/hooks";
import { DataQualityCardSkeleton } from "@/skeletons";

interface DataQualityProps {
	daysSinceLastMeasurement?: number;
	averageGapDays?: number;
	loading?: boolean;
}

export function DataQualityCard({
	daysSinceLastMeasurement = 2,
	averageGapDays = 5,
	loading = false,
}: DataQualityProps) {
	const { isStale, lastLoggedText, status } = useDataQuality({
		daysSinceLastMeasurement,
		averageGapDays,
	});

	if (loading) return <DataQualityCardSkeleton />;

	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none">
			<CardHeader className="p-4 pb-2">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div
						className={`flex items-center justify-center border p-1.5 rounded-md shrink-0 ${
							isStale
								? "border-primary/30 bg-primary/10 text-primary"
								: "border-primary/30 bg-primary/10 text-primary"
						}`}
					>
						{isStale ? (
							<WarningIcon className="size-4" weight="bold" />
						) : (
							<ShieldCheckIcon className="size-4" weight="bold" />
						)}
					</div>
					Data Quality
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-1 space-y-2.5">
				<div className="grid grid-cols-2 gap-2">
					<div className="p-2 border border-border/40 bg-background/50 rounded-none">
						<span className="text-[10px] text-muted-foreground uppercase block">
							Last Logged
						</span>
						<span className="text-xs font-bold text-foreground">
							{lastLoggedText}
						</span>
					</div>
					<div className="p-2 border border-border/40 bg-background/50 rounded-none">
						<span className="text-[10px] text-muted-foreground uppercase block">
							Logging Interval
						</span>
						<span className="text-xs font-bold text-foreground">
							Every ~{averageGapDays} days
						</span>
					</div>
				</div>

				{isStale ? (
					<div className="p-2 border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
						<WarningIcon
							className="size-4 shrink-0"
							weight="bold"
						/>
						<span>{status.message}</span>
					</div>
				) : (
					<p className="text-[11px] text-muted-foreground">
						{status.message}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
