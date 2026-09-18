// components/@common/skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ══════════════════════════════════════════════════════════════════ */

/** Mirrors <CardsHeader icon={..} title={..} trailing={..} />.
 *  - CardHeader: p-4 pb-2 flex fcb  (used by all CardsHeader-driven cards)
 *  - Left: ficon-box (size-7 rounded-md) + uppercase text-xs title
 *  - Right: ONLY rendered when `trailing` is explicitly passed.
 *    - `trailing={true}`           → default icon-button placeholder
 *    - `trailing={<Node />}`       → custom trailing content
 *    - omitted                     → nothing (matches CardsHeader with no trailing) */
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

/** KPI mini-box: matches the `p-2 border border-border/40 bg-background/50`
 *  pattern used in DataQualityCard, IndividualLiftDetailsCard, etc. */
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

/** Compact stat strip: `p-2 border border-border/40 bg-background/50`.
 *  Matches the 3-up KPI row in IndividualLiftDetailsCard. */
function StatStripSkeleton() {
	return (
		<div className="grid grid-cols-3 gap-2">
			{Array.from({ length: 3 }).map((_, i) => (
				<KpiMiniBoxSkeleton key={i} lines={2} />
			))}
		</div>
	);
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════════════════════════ */

/** Matches `KpiCards` — 4-up grid.
 *  Real card:
 *   - CardHeader: flex row, justify-between, pb-2
 *   - Title: fcard-label (uppercase xs)
 *   - Icon:  ficon-box (size-8 rounded-md)
 *   - Value: text-2xl font-bold  → h-7
 *   - Footer: h-4 row (trend + subtext) */
export function KpiCardsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: count }).map((_, i) => (
				<Card
					key={i}
					size="sm"
					className="relative fcard-flat hover:border-primary/50"
				>
					<CardHeader className="fr items-center justify-between space-y-0 pb-2">
						<Skeleton className="h-3 w-20 rounded-sm" />
						<Skeleton className="size-8 rounded-md" />
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline justify-between gap-2 min-h-8">
							<Skeleton className="h-7 w-24 rounded-sm" />
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

/** Matches `LastWorkoutCard` (non-empty branch):
 *  - CardsHeader(ClockCounterClockwise, "Last Workout", trailing=badges+Open)
 *  - Content: p-4 pt-1 fcol4
 *  - Meta row: fwrap gap-3 fcb p-3 border
 *  - <Table>: header row h-8, 50/25/25 split, body rows py-2.5 */
export function WorkoutTableSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card size="sm" className="fcard-flat w-full">
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
				{/* Meta row */}
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

				{/* Table — matches shadcn <Table> structure */}
				<div className="border border-border/40 overflow-hidden">
					{/* TableHeader */}
					<div className="border-b border-border/60">
						<div className="grid grid-cols-[50%_25%_25%] gap-2 h-8 items-center px-3">
							<Skeleton className="h-3 w-16 rounded-sm" />
							<Skeleton className="h-3 w-12 rounded-sm ml-auto" />
							<Skeleton className="h-3 w-10 rounded-sm ml-auto" />
						</div>
					</div>
					{/* TableBody */}
					{Array.from({ length: rows }).map((_, i) => (
						<div
							key={i}
							className="grid grid-cols-[50%_25%_25%] gap-2 items-center px-3 py-2.5 border-b border-border/40 last:border-b-0"
						>
							<div className="fcy gap-2 min-w-0">
								<Skeleton className="size-3.5 rounded-sm sh0" />
								<Skeleton className="h-3.5 w-28 rounded-sm" />
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

/* ══════════════════════════════════════════════════════════════════
   METRICS
   ══════════════════════════════════════════════════════════════════ */

/** Matches `DataQualityCard`:
 *  - CardsHeader(ShieldCheck/Warning, "Data Quality") — NO trailing
 *  - Content: p-4 pt-1 fcol2_5
 *  - 2-up grid: p-2 border bg-background/50, with ftext-2xs label + text-xs value
 *  - Status line */
export function DataQualityCardSkeleton() {
	return (
		<Card className="fcard-flat">
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

/** Matches `QuickStats` — 2/4-up grid; body identical to KpiCard. */
export function QuickStatsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
			{Array.from({ length: count }).map((_, i) => (
				<Card
					key={i}
					size="sm"
					className="relative fcard-flat hover:border-primary/50"
				>
					<CardHeader className="fr items-center justify-between space-y-0 pb-2">
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

/* ══════════════════════════════════════════════════════════════════
   PLANS
   ══════════════════════════════════════════════════════════════════ */

/** Matches `PlansOverviewCards`.
 *  Mobile: nav row + one card.
 *  Desktop: CreatePlanDialog card + N plan cards. */
export function PlansOverviewSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="space-y-3">
			{/* Mobile: single card with nav */}
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

			{/* Desktop: grid */}
			<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* CreatePlanDialog placeholder */}
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

/** Matches `PlanCardItem`:
 *  - CardHeader: name + Badge(v{version}) | icon box (rounded-md size-7)
 *  - Body: Started row → Active/Archived + "Set Active" → Dup/Delete row */
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

/** Matches `PlanDetailsCard`:
 *  - CardsHeader(Blueprint, "{name} v{n}", trailing=CreateDayDialog)
 *  - Content: p-4 pt-1 fcol2
 *  - Day rows: fcb p-2.5 border */
export function PlanDetailsCardSkeleton({
	dayCount = 3,
}: {
	dayCount?: number;
}) {
	return (
		<Card size="sm" className="fcard-flat">
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

/** Matches `PlanSettingsCard`:
 *  - CardsHeader(Gear, "Configuration: {name} (v{n})") — NO trailing
 *  - Content: p-4 pt-1 fcol4
 *  - 3-up grid of form fields (label + h-8 input)
 *  - Footer: right-aligned Save button */
export function PlanSettingsCardSkeleton() {
	return (
		<Card size="sm" className="fcard-flat">
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

/** Matches `DayExercisesList`:
 *  - CardsHeader(SunDim, "Day {n} – {label}", trailing=CreateExerciseDialog)
 *  - Content: p-4 pt-1
 *  - 5-column <table> (Exercise | Type | Sets | Reps | Actions) */
export function DayExercisesListSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card size="sm" className="fcard-flat">
			<CardsHeaderSkeleton
				titleWidth="w-36"
				trailing={<Skeleton className="h-7 w-28 rounded-none" />}
			/>
			<CardContent className="p-4 pt-1">
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
									<div className="fcy justify-end gap-1">
										<Skeleton className="size-7 rounded-sm" />
										<Skeleton className="size-7 rounded-sm" />
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

/* ══════════════════════════════════════════════════════════════════
   PROGRESS / CHARTS
   ══════════════════════════════════════════════════════════════════ */

/** Matches every chart card in the app:
 *  - CardsHeader (icon, title) with optional toggle row in trailing
 *  - Content: p-4 pt-1 fcol3
 *  - Optional 3-up KPI strip (IndividualLiftDetailsCard only)
 *  - Chart body
 *
 *  Used by: StrengthChart, MuscleSizeTrend, WeightBodyFatTrend,
 *           IndividualLiftDetailsCard, StrengthOverviewCard,
 *           UpperBodyTrend / TorsoTrend (all-measurements-trend)
 *
 *  NOTE: `hasToggleRow=false` → no trailing placeholder (matches cards
 *  like WeightBodyFatTrend / MuscleSizeTrend that have no right-side
 *  content in their header). Pass `hasToggleRow` when the real card
 *  renders the lift/range toggle buttons. */
export function ChartCardSkeleton({
	height = "h-[220px]",
	hasToggleRow = false,
	hasKpiRow = false,
	toggleCount = 4,
	titleWidth = "w-32",
}: {
	height?: string;
	hasToggleRow?: boolean;
	/** 3-up KPI strip — only IndividualLiftDetailsCard renders this */
	hasKpiRow?: boolean;
	toggleCount?: number;
	titleWidth?: string;
}) {
	return (
		<Card size="sm" className="relative fcard-flat">
			<CardsHeaderSkeleton
				titleWidth={titleWidth}
				trailing={
					hasToggleRow ? (
						<div className="flex gap-1">
							{Array.from({ length: toggleCount }).map((_, i) => (
								<Skeleton
									key={i}
									className="h-5 w-9 rounded-none"
								/>
							))}
						</div>
					) : undefined
				}
			/>
			<CardContent className="p-4 pt-1 fcol3">
				{hasKpiRow && <StatStripSkeleton />}
				<Skeleton className={cn("w-full rounded-none", height)} />
			</CardContent>
		</Card>
	);
}

/** Matches `SessionHistoryList`:
 *  - CardsHeader(ClockCounterClockwise, "Recent Session Volume") — NO trailing
 *  - Content: p-4 pt-1 fcol4
 *  - Horizontal bar chart (h-[140px]) with bottom border
 *  - Divide-y list of sessions */
export function SessionHistoryListSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card size="sm" className="fcard-flat">
			<CardsHeaderSkeleton titleWidth="w-40" />
			<CardContent className="p-4 pt-1 fcol4">
				<Skeleton className="h-[140px] w-full rounded-none border-b border-border/30" />
				<div className="divide-y divide-border/30">
					{Array.from({ length: rows }).map((_, i) => (
						<div
							key={i}
							className="py-2.5 fcb px-1"
						>
							<div className="space-y-1.5 min-w-0">
								<div className="fcy gap-2">
									<Skeleton className="h-3 w-16 rounded-sm" />
									<Skeleton className="h-4 w-32 rounded-sm" />
								</div>
								<Skeleton className="h-3 w-40 rounded-sm" />
							</div>
							<Skeleton className="size-4 rounded-sm sh0" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

/** Matches `TrainingFrequencyCard`:
 *  - CardsHeader(Activity, "Training Distribution") — NO trailing
 *  - Content: p-4 pt-1 fcol3
 *  - 2-up KPI boxes (bg-secondary/30, icon + 2-line text)
 *  - Radar chart (aspect-square, max-h-[200px])
 *  - Legend row (border-t) */
export function TrainingFrequencyCardSkeleton() {
	return (
		<Card size="sm" className="fcard-flat overflow-hidden">
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

/* ══════════════════════════════════════════════════════════════════
   MICRO / INLINE
   ══════════════════════════════════════════════════════════════════ */

/** Used in `PlannedExercises` for the "PR: ..." / "Last: ..." lines. */
export function InlineStatSkeleton() {
	return (
		<Skeleton className="inline-block h-3 w-12 rounded-sm align-middle" />
	);
}

/** Matches `UserAvatar` — square avatar, `rounded-none`.
 *  Sizes mirror shadcn's Avatar:
 *   - sm      → size-6
 *   - default → size-8
 *   - lg      → size-10
 *
 *  Accepts an optional `className` so callers that pass overrides
 *  (e.g. nav's `size-8 ring-2 ring-primary/20`) merge cleanly via cn(). */
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
