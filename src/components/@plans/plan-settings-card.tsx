"use client";

import { FloppyDiskIcon, GearFineIcon, GearIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Plan } from "@/constants/mock-data";

interface PlanSettingsCardProps {
	plan: Plan;
}

export function PlanSettingsCard({ plan }: PlanSettingsCardProps) {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease hover:border-primary/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div>
					<CardTitle className="text-xs font-bold uppercase tracking-wider text-primary fc gap-2">
						<GearIcon
							weight="bold"
							className="text-popover-foreground"
						/>
						Configuration: {plan.name} ({plan.version})
					</CardTitle>
				</div>

				<div className="fc border border-primary/30 bg-primary/10 p-2 text-primary rounded-md shrink-0">
					<GearFineIcon className="size-4" weight="bold" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							Plan Name
						</span>
						<Input
							defaultValue={plan.name}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							Version Tag
						</span>
						<Input
							defaultValue={plan.version}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							Start Date
						</span>
						<Input
							type="date"
							defaultValue={plan.startDate}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							End Date
						</span>
						<Input
							type="date"
							defaultValue={plan.endDate}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
						/>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
					<Button
						size="sm"
						variant="outline"
						className="rounded-none h-8 text-xs gap-1 border-border/50"
					>
						<XIcon className="size-3.5" weight="bold" />
						Cancel
					</Button>
					<Button
						size="sm"
						variant="default"
						className="rounded-none h-8 text-xs gap-1 font-semibold"
					>
						<FloppyDiskIcon className="size-3.5" weight="bold" />
						Save Changes
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
