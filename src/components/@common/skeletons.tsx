// components/@common/skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ── Base building block ─────────────────────────────── */
export function TextSkeleton({
	lines = 1,
	className,
	widths,
}: {
	lines?: number;
	className?: string;
	/** e.g. ["100%", "80%", "60%"] — falls back to full width */
	widths?: string[];
}) {
	return (
		<div className={cn("space-y-1.5", className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					className="h-3 rounded-sm"
					style={{
						width:
							widths?.[i] ?? (i === lines - 1 ? "60%" : "100%"),
					}}
				/>
			))}
		</div>
	);
}

/* ── KPI card skeleton (matches your KpiCards layout) ── */
export function KpiCardSkeleton() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50"
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-3 w-20 rounded-sm" />
				<Skeleton className="h-8 w-8 rounded-md" />
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline justify-between gap-2 min-h-8">
					<Skeleton className="h-7 w-24 rounded-sm" />
				</div>
				<div className="flex items-center mt-1.5 gap-1.5 h-4">
					<Skeleton className="h-3 w-32 rounded-sm" />
				</div>
			</CardContent>
		</Card>
	);
}

export function KpiCardsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: count }).map((_, i) => (
				<KpiCardSkeleton key={i} />
			))}
		</div>
	);
}

/* ── Chart skeleton (matches all your chart cards) ──── */
export function ChartCardSkeleton({
	height = "h-[220px]",
	/** Optional toggle row to match chart card headers */
	hasToggleRow = false,
	toggleCount = 4,
	titleWidth = "w-32",
}: {
	height?: string;
	hasToggleRow?: boolean;
	toggleCount?: number;
	titleWidth?: string;
}) {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-md" />
					<Skeleton className={cn("h-3 rounded-sm", titleWidth)} />
				</div>
				{hasToggleRow ? (
					<div className="flex gap-1">
						{Array.from({ length: toggleCount }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-5 w-9 rounded-none"
							/>
						))}
					</div>
				) : (
					<Skeleton className="h-8 w-8 rounded-md" />
				)}
			</CardHeader>
			<CardContent className="pt-0 space-y-3">
				{hasToggleRow && (
					<div className="grid grid-cols-3 gap-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-12 w-full rounded-none"
							/>
						))}
					</div>
				)}
				<Skeleton className={cn("w-full rounded-none", height)} />
			</CardContent>
		</Card>
	);
}

/* ── Table skeleton (matches LastWorkoutCard) ───────── */
export function WorkoutTableSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card
			size="sm"
			className="w-full border-secondary/50 bg-card/50 rounded-none"
		>
			<CardHeader className="p-4 sm:p-6 pb-3 space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded-sm" />
						<Skeleton className="h-3 w-24 rounded-sm" />
						<Skeleton className="h-5 w-12 rounded-sm" />
					</div>
					<Skeleton className="h-8 w-28 rounded-none" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-5 w-20 rounded-sm" />
					<Skeleton className="h-4 w-32 rounded-sm" />
				</div>
			</CardHeader>
			<CardContent className="p-0 sm:px-6 sm:pb-4">
				<div className="grid grid-cols-[50%_25%_25%] gap-2 px-4 sm:px-3 py-2 border-b border-border/60">
					<Skeleton className="h-3 w-16 rounded-sm" />
					<Skeleton className="h-3 w-12 rounded-sm ml-auto" />
					<Skeleton className="h-3 w-10 rounded-sm ml-auto" />
				</div>
				{Array.from({ length: rows }).map((_, i) => (
					<div
						key={i}
						className="grid grid-cols-[50%_25%_25%] gap-2 items-center px-4 sm:px-3 py-3 border-b border-border/60"
					>
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-6 rounded-md" />
							<Skeleton className="h-3 w-28 rounded-sm" />
						</div>
						<Skeleton className="h-3 w-14 rounded-sm ml-auto" />
						<Skeleton className="h-3 w-8 rounded-sm ml-auto" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

/* ── Chart sub-block (for dashboards where you control layout) ── */
export function ChartSkeleton({ className }: { className?: string }) {
	return (
		<Skeleton
			className={cn("w-full rounded-none", className)}
			aria-hidden="true"
		/>
	);
}

/* ── Small inline skeleton for PR/Last lines ─────────── */
export function InlineStatSkeleton() {
	return (
		<Skeleton className="inline-block h-3 w-12 rounded-sm align-middle" />
	);
}

/* ── Avatar skeleton ─────────────────────────────────── */
export function AvatarSkeleton({
	size = "default",
}: {
	size?: "sm" | "default" | "lg";
}) {
	const sizeClass =
		size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
	return <Skeleton className={cn("rounded-none", sizeClass)} />;
}

/* ── Data Quality card skeleton ──────────────────────── */
export function DataQualityCardSkeleton() {
	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none">
			<CardHeader className="p-4 pb-2">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<Skeleton className="size-4 rounded-sm" />
					</div>
					Data Quality
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-1 space-y-2.5">
				<div className="grid grid-cols-2 gap-2">
					<div className="p-2 border border-border/40 bg-background/50 rounded-none">
						<Skeleton className="h-3 w-16 rounded-sm mb-1" />
						<Skeleton className="h-4 w-20 rounded-sm" />
					</div>
					<div className="p-2 border border-border/40 bg-background/50 rounded-none">
						<Skeleton className="h-3 w-20 rounded-sm mb-1" />
						<Skeleton className="h-4 w-24 rounded-sm" />
					</div>
				</div>
				<Skeleton className="h-4 w-full rounded-sm" />
			</CardContent>
		</Card>
	);
}

/* ── Quick Stats grid skeleton (matches QuickStats layout) ── */
export function QuickStatCardSkeleton() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50"
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-3 w-20 rounded-sm" />
				<Skeleton className="h-8 w-8 rounded-md" />
			</CardHeader>
			<CardContent>
				{/* Value line — matches text-2xl font-bold line height */}
				<div className="flex items-baseline justify-between gap-2 min-h-8">
					<Skeleton className="h-7 w-24 rounded-sm" />
				</div>
				{/* Subtext line — matches h-4 trend row */}
				<div className="flex items-center mt-1.5 gap-1.5 h-4">
					<Skeleton className="h-3 w-28 rounded-sm" />
				</div>
			</CardContent>
		</Card>
	);
}

export function QuickStatsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
			{Array.from({ length: count }).map((_, i) => (
				<QuickStatCardSkeleton key={i} />
			))}
		</div>
	);
}

/* ── Plans: overview card skeleton ───────────────────── */
export function PlanCardSkeleton() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-2 flex fcb">
				<div className="flex items-center gap-1.5">
					<Skeleton className="h-3 w-24 rounded-sm" />
					<Skeleton className="h-4 w-8 rounded-none" />
				</div>
				<Skeleton className="h-7 w-7 rounded-md" />
			</CardHeader>
			<CardContent className="space-y-3 pt-1">
				{/* Started row */}
				<div className="flex items-center justify-between">
					<Skeleton className="h-3 w-14 rounded-sm" />
					<Skeleton className="h-3 w-24 rounded-sm" />
				</div>
				{/* Active/Archived + Set Active row */}
				<div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
					<Skeleton className="h-5 w-20 rounded-none" />
					<Skeleton className="h-6 w-20 rounded-none" />
				</div>
				{/* Duplicate + Delete row */}
				<div className="flex items-end justify-end gap-2">
					<Skeleton className="h-7 w-7 rounded-none" />
					<Skeleton className="h-7 w-7 rounded-none" />
				</div>
			</CardContent>
		</Card>
	);
}

export function PlansOverviewSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="space-y-3">
			{/* Mobile: single card with nav */}
			<div className="block md:hidden space-y-2">
				<div className="fcb px-1">
					<span />
					<div className="fcx gap-1">
						<Skeleton className="h-7 w-7 rounded-md" />
						<Skeleton className="h-3 w-16 rounded-sm mt-1.5" />
						<Skeleton className="h-7 w-7 rounded-md" />
					</div>
				</div>
				<PlanCardSkeleton />
			</div>

			{/* Desktop: grid */}
			<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* CreatePlanDialog placeholder — matches its card shape */}
				<Card
					size="sm"
					className="relative border border-dashed border-primary/40 bg-card/30 rounded-none shadow-none h-full flex flex-col justify-between"
				>
					<CardHeader className="space-y-0 pb-2 flex fcb">
						<div className="flex items-center gap-1.5">
							<Skeleton className="h-3 w-16 rounded-sm" />
							<Skeleton className="h-4 w-14 rounded-none" />
						</div>
						<Skeleton className="h-7 w-7 rounded-md" />
					</CardHeader>
					<CardContent className="space-y-3 pt-1 flex-1 flex flex-col justify-between">
						<div className="flex flex-col items-center justify-center py-4 text-center border-t border-border/40 gap-2">
							<Skeleton className="size-8 rounded-full" />
							<Skeleton className="h-3 w-28 rounded-sm" />
							<Skeleton className="h-3 w-32 rounded-sm" />
						</div>
					</CardContent>
				</Card>

				{Array.from({ length: count }).map((_, i) => (
					<PlanCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}

/* ── Plans: details card skeleton (day list) ─────────── */
export function PlanDetailsCardSkeleton({
	dayCount = 3,
}: {
	dayCount?: number;
}) {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-sm" />
					<Skeleton className="h-3 w-40 rounded-sm" />
				</div>
				<Skeleton className="h-7 w-20 rounded-none" />
			</CardHeader>
			<CardContent className="space-y-2">
				<Skeleton className="h-3 w-28 rounded-sm" />
				<div className="space-y-1.5">
					{Array.from({ length: dayCount }).map((_, i) => (
						<div
							key={i}
							className="w-full fcb p-2.5 border border-border/40 bg-background/50"
						>
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-12 rounded-none" />
								<Skeleton className="h-3 w-24 rounded-sm" />
							</div>
							<div className="flex items-center gap-1">
								<Skeleton className="h-6 w-6 rounded-sm" />
								<Skeleton className="h-3.5 w-3.5 rounded-sm" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

/* ── Plans: settings card skeleton (form) ────────────── */
export function PlanSettingsCardSkeleton() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-sm" />
					<Skeleton className="h-3 w-48 rounded-sm" />
				</div>
				<Skeleton className="h-7 w-7 rounded-md" />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="space-y-1">
							<Skeleton className="h-3 w-20 rounded-sm" />
							<Skeleton className="h-8 w-full rounded-none" />
						</div>
					))}
				</div>
				<div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
					<Skeleton className="h-8 w-32 rounded-none" />
				</div>
			</CardContent>
		</Card>
	);
}

/* ── Plans: day exercises list skeleton (table) ──────── */
export function DayExercisesListSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-sm" />
					<Skeleton className="h-3 w-36 rounded-sm" />
				</div>
				<Skeleton className="h-7 w-28 rounded-none" />
			</CardHeader>
			<CardContent className="space-y-3">
				<table className="w-full text-left text-xs border-collapse">
					<thead>
						<tr className="border-b border-border/50">
							<th className="py-2 px-2">
								<Skeleton className="h-3 w-16 rounded-sm" />
							</th>
							<th className="py-2 px-2">
								<Skeleton className="h-3 w-10 rounded-sm" />
							</th>
							<th className="py-2 px-2">
								<Skeleton className="h-3 w-8 rounded-sm mx-auto" />
							</th>
							<th className="py-2 px-2">
								<Skeleton className="h-3 w-16 rounded-sm mx-auto" />
							</th>
							<th className="py-2 px-2">
								<Skeleton className="h-3 w-12 rounded-sm ml-auto" />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{Array.from({ length: rows }).map((_, i) => (
							<tr key={i}>
								<td className="py-2.5 px-2">
									<Skeleton className="h-3 w-24 rounded-sm" />
								</td>
								<td className="py-2.5 px-2">
									<Skeleton className="h-4 w-12 rounded-none" />
								</td>
								<td className="py-2.5 px-2">
									<Skeleton className="h-3 w-6 rounded-sm mx-auto" />
								</td>
								<td className="py-2.5 px-2">
									<Skeleton className="h-3 w-12 rounded-sm mx-auto" />
								</td>
								<td className="py-2.5 px-2">
									<div className="flex items-center justify-end gap-1">
										<Skeleton className="h-7 w-7 rounded-sm" />
										<Skeleton className="h-7 w-7 rounded-sm" />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}

/* ── Progress: session history skeleton (hoisted) ────── */
export function SessionHistoryListSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none shadow-none"
		>
			<CardHeader className="space-y-0 pb-3 flex fcb">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-sm" />
					<Skeleton className="h-3 w-40 rounded-sm" />
				</div>
				<Skeleton className="h-8 w-8 rounded-md" />
			</CardHeader>
			<CardContent className="space-y-4 pt-0">
				<Skeleton className="h-[140px] w-full rounded-none" />
				<div className="divide-y divide-border/30">
					{Array.from({ length: rows }).map((_, i) => (
						<div
							key={i}
							className="py-2.5 flex items-center justify-between px-1"
						>
							<div className="space-y-1.5">
								<div className="flex items-center gap-2">
									<Skeleton className="h-3 w-16 rounded-sm" />
									<Skeleton className="h-4 w-32 rounded-sm" />
								</div>
								<Skeleton className="h-3 w-40 rounded-sm" />
							</div>
							<Skeleton className="h-4 w-4 rounded-sm" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

/* ── Progress: training frequency skeleton (hoisted) ─── */
export function TrainingFrequencyCardSkeleton() {
	return (
		<Card
			size="sm"
			className="relative border border-secondary/50 bg-card/50 rounded-none overflow-hidden"
		>
			<CardHeader className="p-4 pb-2 flex fcb">
				<Skeleton className="h-4 w-40 rounded-sm" />
				<Skeleton className="h-7 w-7 rounded-md" />
			</CardHeader>
			<CardContent className="p-4 pt-0 space-y-3">
				<div className="grid grid-cols-2 gap-2">
					<Skeleton className="h-10 rounded-md" />
					<Skeleton className="h-10 rounded-md" />
				</div>
				<Skeleton className="mx-auto aspect-square max-h-[200px] w-full rounded-none" />
				<div className="flex items-center justify-between pt-2 border-t border-border/40">
					<Skeleton className="h-3 w-24 rounded-sm" />
					<Skeleton className="h-3 w-20 rounded-sm" />
				</div>
			</CardContent>
		</Card>
	);
}
