"use client";

import { ShieldCheckIcon, WarningIcon } from "@phosphor-icons/react";
import { CardsHeader } from "@/common";
import { Card, CardContent } from "@/components/ui/card";
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
		<Card className="fcard-flat card-ease">
			<CardsHeader
				icon={isStale ? WarningIcon : ShieldCheckIcon}
				title="Data Quality"
			/>

			<CardContent className="p-4 pt-1 fcol2_5">
				<div className="grid grid-cols-2 gap-2">
					<div className="p-2 border border-border/40 bg-background/50 rounded-none">
						<span className="ftext-2xs fmuted uppercase block">
							Last Logged
						</span>
						<span className="text-xs font-bold text-foreground">
							{lastLoggedText}
						</span>
					</div>
					<div className="p-2 border border-border/40 bg-background/50 rounded-none">
						<span className="ftext-2xs fmuted uppercase block">
							Logging Interval
						</span>
						<span className="text-xs font-bold text-foreground">
							Every ~{averageGapDays} days
						</span>
					</div>
				</div>

				{isStale ? (
					<div className="p-2 border border-destructive/30 bg-destructive/10 text-destructive text-xs fcy gap-2">
						<WarningIcon className="size-4 sh0" weight="bold" />
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
