import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function CardsHeaderSkeleton({
	titleWidth = "w-32",
	trailing,
}: {
	titleWidth?: string;
	trailing?: React.ReactNode | true;
}) {
	return (
		<CardHeader className="p-4 pb-2 flex fcb">
			<div className="fcy gap-2.5 min-w-0">
				<Skeleton className="size-7 rounded-md sh0" />
				<Skeleton className={cn("h-3 rounded-sm", titleWidth)} />
			</div>
			{trailing === true ? (
				<Skeleton className="size-7 rounded-md sh0" />
			) : (
				trailing
			)}
		</CardHeader>
	);
}

function KpiMiniBoxSkeleton({ lines = 2 }: { lines?: number }) {
	return (
		<div className="p-2 bg-background/50 border border-border/40 rounded-none space-y-1.5">
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					className={cn(
						"rounded-sm",
						i === 0 ? "h-2.5 w-16" : "h-3.5 w-24",
					)}
				/>
			))}
		</div>
	);
}

function StatStripSkeleton() {
	return (
		<div className="grid grid-cols-3 gap-2">
			{Array.from({ length: 3 }).map((_, i) => (
				<KpiMiniBoxSkeleton key={i} lines={2} />
			))}
		</div>
	);
}

export function KpiCardsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: count }).map((_, i) => (
				<Card
					key={i}
					size="sm"
					className="relative fcard-flat hover:border-primary/50"
				>
					<CardHeader className="flex fcb space-y-0 pb-2">
						<Skeleton className="h-3 w-20 rounded-sm" />
						<Skeleton className="size-8 rounded-md" />
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline justify-between gap-2 min-h-8">
							<Skeleton className="h-7 w-24 rounded-sm" />
							{i === 2 && (
								/* Best Lift card has a dropdown next to the value */
								<Skeleton className="h-7 w-20 rounded-none" />
							)}
						</div>
						<div className="fcy mt-1.5 gap-1.5 h-4">
							<Skeleton className="h-3 w-32 rounded-sm" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function WorkoutTableSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card size="sm" className="fcard-flat w-full card-ease">
			<CardsHeaderSkeleton
				titleWidth="w-24"
				trailing={
					<div className="fwrap items-center gap-1.5">
						<Skeleton className="h-5 w-12 rounded-none" />
						<Skeleton className="h-6 w-20 rounded-none" />
					</div>
				}
			/>
			<CardContent className="p-4 pt-1 fcol4">
				<div className="fwb gap-3 p-3 border border-border/40 bg-background/50 rounded-none">
					<div className="fcy gap-1.5">
						<Skeleton className="size-3.5 rounded-sm" />
						<Skeleton className="h-3.5 w-24 rounded-sm" />
					</div>
					<div className="fwrap items-center gap-2">
						<Skeleton className="h-5 w-20 rounded-none" />
						<Skeleton className="h-4 w-24 rounded-sm" />
					</div>
				</div>

				<div className="border border-border/40 overflow-hidden">
					<div className="border-b border-border/60">
						<div className="grid grid-cols-[50%_25%_25%] gap-2 h-8 items-center px-3">
							<Skeleton className="h-3 w-16 rounded-sm" />
							<Skeleton className="h-3 w-12 rounded-sm ml-auto" />
							<Skeleton className="h-3 w-10 rounded-sm ml-auto" />
						</div>
					</div>
					{Array.from({ length: rows }).map((_, i) => (
						<div
							key={i}
							className="grid grid-cols-[50%_25%_25%] gap-2 items-center px-3 py-2.5 border-b border-border/40 last:border-b-0"
						>
							<div className="fcy gap-2 min-w-0">
								<Skeleton className="size-3.5 rounded-sm sh0" />
								<Skeleton className="h-3.5 w-28 rounded-sm" />
								{i === 0 && (
									<Skeleton className="size-3 rounded-sm" />
								)}
							</div>
							<Skeleton className="h-3.5 w-14 rounded-sm ml-auto" />
							<Skeleton className="h-3.5 w-8 rounded-sm ml-auto" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function DataQualityCardSkeleton() {
	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeaderSkeleton titleWidth="w-28" />
			<CardContent className="p-4 pt-1 fcol2_5">
				<div className="grid grid-cols-2 gap-2">
					<div className="p-2 border border-border/40 bg-background/50 rounded-none space-y-1">
						<Skeleton className="h-2.5 w-16 rounded-sm" />
						<Skeleton className="h-3.5 w-20 rounded-sm" />
					</div>
					<div className="p-2 border border-border/40 bg-background/50 rounded-none space-y-1">
						<Skeleton className="h-2.5 w-20 rounded-sm" />
						<Skeleton className="h-3.5 w-24 rounded-sm" />
					</div>
				</div>
				<Skeleton className="h-3.5 w-full rounded-sm" />
			</CardContent>
		</Card>
	);
}

export function QuickStatsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
			{Array.from({ length: count }).map((_, i) => (
				<Card
					key={i}
					size="sm"
					className="relative fcard-flat hover:border-primary/50"
				>
					<CardHeader className="flex fcb space-y-0 pb-2">
						<Skeleton className="h-3 w-20 rounded-sm" />
						<Skeleton className="size-8 rounded-md" />
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline justify-between gap-2 min-h-8">
							<Skeleton className="h-7 w-24 rounded-sm" />
						</div>
						<div className="fcy mt-1.5 gap-1.5 h-4">
							<Skeleton className="h-3 w-28 rounded-sm" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function PlansOverviewSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="space-y-3">
			<div className="block md:hidden space-y-2">
				<div className="fcb px-1">
					<span />
					<div className="fcx gap-1">
						<Skeleton className="size-7 rounded-md" />
						<Skeleton className="h-3 w-16 rounded-sm mt-1.5" />
						<Skeleton className="size-7 rounded-md" />
					</div>
				</div>
				<PlanCardItemSkeleton />
			</div>

			<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card
					size="sm"
					className="relative cursor-pointer border border-dashed border-primary/40 bg-card/30 rounded-none shadow-none base-ease h-full fcol justify-between"
				>
					<CardHeader className="space-y-0 pb-2 flex fcb">
						<div className="fcy gap-1.5">
							<Skeleton className="h-3 w-16 rounded-sm" />
							<Skeleton className="h-4 w-14 rounded-none" />
						</div>
						<Skeleton className="size-7 rounded-md sh0" />
					</CardHeader>
					<CardContent className="space-y-3 pt-1 fgrow fcol justify-between">
						<div className="fcol items-center justify-center py-4 text-center border-t border-border/40 gap-2">
							<Skeleton className="size-8 rounded-full" />
							<Skeleton className="h-3 w-28 rounded-sm" />
							<Skeleton className="h-3 w-32 rounded-sm" />
						</div>
					</CardContent>
				</Card>

				{Array.from({ length: count }).map((_, i) => (
					<PlanCardItemSkeleton key={i} />
				))}
			</div>
		</div>
	);
}

function PlanCardItemSkeleton() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 base-ease rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<div className="fcy gap-1.5 min-w-0">
					<Skeleton className="h-3 w-24 rounded-sm" />
					<Skeleton className="h-5 w-8 rounded-none" />
				</div>
				<Skeleton className="size-7 rounded-md sh0" />
			</CardHeader>
			<CardContent className="space-y-3 pt-1">
				<div className="fcb">
					<Skeleton className="h-3 w-14 rounded-sm" />
					<Skeleton className="h-3 w-24 rounded-sm" />
				</div>
				<div className="fcb gap-2 border-t border-border/40 pt-2.5">
					<Skeleton className="h-5 w-16 rounded-none" />
					<Skeleton className="h-6 w-16 rounded-none" />
				</div>
				<div className="flex items-end justify-end gap-2">
					<Skeleton className="size-7 rounded-none" />
					<Skeleton className="size-7 rounded-none" />
				</div>
			</CardContent>
		</Card>
	);
}

export function PlanDetailsCardSkeleton({
	dayCount = 3,
}: {
	dayCount?: number;
}) {
	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeaderSkeleton
				titleWidth="w-40"
				trailing={<Skeleton className="h-7 w-20 rounded-none" />}
			/>
			<CardContent className="p-4 pt-1 fcol2">
				<Skeleton className="h-3 w-28 rounded-sm" />
				<div className="space-y-1.5">
					{Array.from({ length: dayCount }).map((_, i) => (
						<div
							key={i}
							className="w-full fcb p-2.5 border border-border/40 bg-background/50"
						>
							<div className="fcy gap-2 min-w-0">
								<Skeleton className="h-5 w-12 rounded-none" />
								<Skeleton className="h-3 w-24 rounded-sm" />
							</div>
							<div className="fcy gap-1">
								<Skeleton className="size-6 rounded-sm" />
								<Skeleton className="size-3.5 rounded-sm" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function PlanSettingsCardSkeleton() {
	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeaderSkeleton titleWidth="w-48" />
			<CardContent className="p-4 pt-1 fcol4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="space-y-1">
							<Skeleton className="h-3 w-20 rounded-sm" />
							<Skeleton className="h-8 w-full rounded-none" />
						</div>
					))}
				</div>
				<div className="fcy justify-end gap-2 pt-2 border-t border-border/40">
					<Skeleton className="h-8 w-32 rounded-none" />
				</div>
			</CardContent>
		</Card>
	);
}

export function DayExercisesListSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeaderSkeleton
				titleWidth="w-36"
				trailing={<Skeleton className="h-7 w-28 rounded-none" />}
			/>
			<CardContent className="p-4 pt-1">
				{/* Desktop: table with drag handle column */}
				<div className="hidden md:block">
					<table className="w-full table-fixed text-left text-xs border-collapse">
						<thead>
							<tr className="border-b border-border/50">
								<th className="w-8 py-2 pl-2 pr-0" />
								<th className="py-2 px-2">
									<Skeleton className="h-3 w-16 rounded-sm" />
								</th>
								<th className="w-[10%] py-2 px-2">
									<Skeleton className="h-3 w-8 rounded-sm mx-auto" />
								</th>
								<th className="w-[20%] py-2 px-2">
									<Skeleton className="h-3 w-12 rounded-sm mx-auto" />
								</th>
								<th className="w-[15%] py-2 pl-1 pr-2">
									<Skeleton className="h-3 w-12 rounded-sm ml-auto" />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/30">
							{Array.from({ length: rows }).map((_, i) => (
								<tr key={i}>
									<td className="w-8 py-2.5 pl-2 pr-0">
										<Skeleton className="size-4 rounded-sm" />
									</td>
									<td className="py-2.5 px-2">
										<div className="fcy gap-2">
											<Skeleton className="h-3.5 w-32 rounded-sm" />
											<Skeleton className="h-3 w-12 rounded-sm" />
										</div>
									</td>
									<td className="w-[10%] py-2.5 px-2">
										<Skeleton className="h-3 w-6 rounded-sm mx-auto" />
									</td>
									<td className="w-[20%] py-2.5 px-2">
										<Skeleton className="h-3 w-12 rounded-sm mx-auto" />
									</td>
									<td className="w-[15%] py-2.5 pl-1 pr-2">
										<div className="fcy justify-end gap-1">
											<Skeleton className="size-6 rounded-sm" />
											<Skeleton className="size-6 rounded-sm" />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Mobile: cards with drag handle strip */}
				<div className="flex md:hidden flex-col gap-2">
					{Array.from({ length: rows }).map((_, i) => (
						<div
							key={i}
							className="flex items-stretch gap-2 border border-border/40 bg-background/50 p-2"
						>
							{/* Drag handle column */}
							<Skeleton className="w-8 shrink-0 rounded-sm" />

							<div className="flex flex-col gap-1.5 min-w-0 flex-1 py-0.5">
								<div className="flex items-start justify-between gap-2">
									<Skeleton className="h-3.5 w-32 rounded-sm" />
									<div className="flex items-center gap-0.5 shrink-0">
										<Skeleton className="size-6 rounded-sm" />
										<Skeleton className="size-6 rounded-sm" />
									</div>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<Skeleton className="h-4 w-14 rounded-none" />
									<Skeleton className="h-3 w-12 rounded-sm" />
									<Skeleton className="h-3 w-14 rounded-sm" />
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function ChartCardSkeleton({
	height = "h-[220px]",
	hasToggleRow = false,
	hasKpiRow = false,
	toggleCount = 4,
	titleWidth = "w-32",
	hasViewToggle = false,
}: {
	height?: string;
	hasToggleRow?: boolean;
	hasKpiRow?: boolean;
	toggleCount?: number;
	titleWidth?: string;
	hasViewToggle?: boolean;
}) {
	return (
		<Card size="sm" className="relative fcard-flat card-ease">
			<CardsHeaderSkeleton
				titleWidth={titleWidth}
				trailing={
					<div className="fcy gap-2">
						{hasToggleRow && (
							<div className="flex gap-1">
								{Array.from({ length: toggleCount }).map(
									(_, i) => (
										<Skeleton
											key={i}
											className="h-5 w-9 rounded-none"
										/>
									),
								)}
							</div>
						)}
						{hasViewToggle && (
							<div className="flex gap-1">
								<Skeleton className="h-5 w-6 rounded-none" />
								<Skeleton className="h-5 w-6 rounded-none" />
							</div>
						)}
					</div>
				}
			/>
			<CardContent className="p-4 pt-1 fcol3">
				{hasKpiRow && <StatStripSkeleton />}
				<Skeleton className={cn("w-full rounded-none", height)} />
			</CardContent>
		</Card>
	);
}

export function SessionHistoryListSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card size="sm" className="fcard-flat card-ease">
			<CardsHeaderSkeleton titleWidth="w-40" />
			<CardContent className="p-4 pt-1 fcol4">
				<Skeleton className="h-35 w-full rounded-none border-b border-border/30" />
				<div className="divide-y divide-border/30">
					{Array.from({ length: rows }).map((_, i) => (
						<div key={i} className="py-2.5 fcb px-1">
							<div className="space-y-1.5 min-w-0">
								<div className="fcy gap-2">
									<Skeleton className="h-3 w-28 rounded-sm" />
									<Skeleton className="h-4 w-32 rounded-sm" />
								</div>
								<Skeleton className="h-3 w-40 rounded-sm" />
							</div>
							<Skeleton className="h-3 w-24 rounded-sm sh0" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function TrainingFrequencyCardSkeleton() {
	return (
		<Card size="sm" className="fcard-flat overflow-hidden card-ease">
			<CardsHeaderSkeleton titleWidth="w-40" />
			<CardContent className="p-4 pt-1 fcol3">
				<div className="grid grid-cols-2 gap-2">
					{Array.from({ length: 2 }).map((_, i) => (
						<div
							key={i}
							className="fcy gap-2 bg-secondary/30 border border-secondary/60 p-2 rounded-md"
						>
							<Skeleton className="size-4 rounded-sm sh0" />
							<div className="fcol leading-tight gap-1 min-w-0">
								<Skeleton className="h-2.5 w-16 rounded-sm" />
								<Skeleton className="h-3.5 w-20 rounded-sm" />
							</div>
						</div>
					))}
				</div>
				<Skeleton className="mx-auto aspect-square max-h-[200px] w-full rounded-none" />
				<div className="fcb pt-2 border-t border-border/40">
					<Skeleton className="h-3 w-24 rounded-sm" />
					<Skeleton className="h-3 w-20 rounded-sm" />
				</div>
			</CardContent>
		</Card>
	);
}

export function InlineStatSkeleton() {
	return (
		<Skeleton className="inline-block h-3 w-12 rounded-sm align-middle" />
	);
}

export function AvatarSkeleton({
	size = "default",
	className,
}: {
	size?: "sm" | "default" | "lg";
	className?: string;
}) {
	const sizeClass =
		size === "sm" ? "size-6" : size === "lg" ? "size-10" : "size-8";
	return <Skeleton className={cn("rounded-none", sizeClass, className)} />;
}
