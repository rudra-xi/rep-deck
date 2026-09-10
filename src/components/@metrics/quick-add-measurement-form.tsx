"use client";

import { format } from "date-fns";
import { PlusIcon, CheckIcon, CalendarDotsIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuickAddMeasurement } from "@/hooks";
import { Spinner } from "@/components/ui/spinner";

export function QuickAddMeasurementForm() {
	const {
		loading,
		success,
		selectedDate,
		setSelectedDate,
		formData,
		handleChange,
		handleSubmit,
	} = useQuickAddMeasurement();

	return (
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none transition-all duration-300 hover:border-primary/50">
			<CardContent className="p-5">
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Date Picker */}
					<div className="flex flex-col space-y-1.5">
						<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
							Date
						</Label>
						<Popover>
							<PopoverTrigger
								render={
									<Button
										variant="outline"
										className={cn(
											"h-9 text-xs rounded-none justify-start text-left font-normal px-3 border-border/50 hover:border-primary/50 transition-all duration-200",
											!selectedDate &&
												"text-muted-foreground",
										)}
									>
										<CalendarDotsIcon
											className="mr-2 size-4 text-primary shrink-0"
											weight="bold"
										/>
										{selectedDate ? (
											format(selectedDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								}
							/>
							<PopoverContent
								className="w-auto p-0 rounded-none border-secondary/50"
								align="start"
							>
								<Calendar
									mode="single"
									selected={selectedDate}
									onSelect={setSelectedDate}
									className="rounded-none"
								/>
							</PopoverContent>
						</Popover>
					</div>

					{/* Weight & Body Fat */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Weight (kg)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="weightKg"
								placeholder="e.g. 74.2"
								value={formData.weightKg}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Body Fat (%)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="bodyFatPercent"
								placeholder="e.g. 15.0"
								value={formData.bodyFatPercent}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
					</div>

					{/* Arms, Forearms, Thighs */}
					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Arms (in)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="armsIn"
								placeholder="e.g. 14.5"
								value={formData.armsIn}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Forearms (in)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="forearmsIn"
								placeholder="e.g. 12.5"
								value={formData.forearmsIn}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Thighs (in)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="thighsIn"
								placeholder="e.g. 22.5"
								value={formData.thighsIn}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
					</div>

					{/* Chest, Waist, Hips */}
					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Chest (in)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="chestIn"
								placeholder="e.g. 40.0"
								value={formData.chestIn}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Waist (in)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="waistIn"
								placeholder="e.g. 32.0"
								value={formData.waistIn}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
								Hips (in)
							</Label>
							<Input
								type="number"
								step="0.1"
								name="hipsIn"
								placeholder="e.g. 37.0"
								value={formData.hipsIn}
								onChange={handleChange}
								className="h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
							/>
						</div>
					</div>

					{/* Notes */}
					<div className="space-y-1">
						<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
							Notes
						</Label>
						<Textarea
							name="notes"
							placeholder="e.g. Fasted state, measured after morning cardio..."
							value={formData.notes || ""}
							onChange={handleChange}
							className="min-h-[60px] text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none"
						/>
					</div>

					<Button
						type="submit"
						disabled={loading || !selectedDate}
						size="sm"
						className={cn(
							"w-full h-9 gap-2 text-xs font-semibold base-ease",
							success && "bg-primary hover:bg-primary/80",
						)}
					>
						{loading ? (
							<>
								<Spinner/>
								Saving...
							</>
						) : success ? (
							<>
								<CheckIcon
									className="size-4 text-popover-foreground"
									weight="bold"
								/>
								Saved Successfully
							</>
						) : (
							<>
								<PlusIcon className="size-4" weight="bold" />
								Save Measurement
							</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
