"use client";

import {
	ClockCounterClockwiseIcon,
	CalendarDotsIcon,
	CaretRightIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAST_SESSIONS_DATA } from "@/constants/mock-data";

export function SessionHistoryList() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
					<ClockCounterClockwiseIcon
						weight="bold"
						className="text-popover-foreground"
					/>
					Past Sessions
				</CardTitle>

				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<CalendarDotsIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-2">
				<div className="divide-y divide-border/30">
					{PAST_SESSIONS_DATA.map((session) => (
						<div
							key={session.id}
							className="py-2.5 flex items-center justify-between hover:bg-background/40 transition-colors cursor-pointer px-1"
						>
							<div className="space-y-0.5">
								<div className="flex items-center gap-2">
									<span className="text-xs font-bold text-foreground">
										{session.date}
									</span>
									<span className="text-[10px] font-semibold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20">
										{session.programName} –{" "}
										{session.dayLabel}
									</span>
								</div>
								<p className="text-[11px] text-muted-foreground">
									{session.keyLiftsSummary}
								</p>
							</div>

							<div className="flex items-center gap-3">
								<span className="text-xs font-semibold text-foreground hidden sm:inline">
									{session.totalVolume}
								</span>
								<CaretRightIcon className="size-4 text-muted-foreground" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
