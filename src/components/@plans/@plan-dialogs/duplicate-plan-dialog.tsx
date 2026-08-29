"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyIcon } from "@phosphor-icons/react";
import { duplicatePlan } from "@/actions/plans";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks";
import { toast } from "sonner";
import type { PlanWithStructure } from "@/types/plans";

interface DuplicatePlanDialogProps {
	plan: PlanWithStructure;
	onSuccess?: (newPlanId: string) => void;
}

export function DuplicatePlanDialog({
	plan,
	onSuccess,
}: DuplicatePlanDialogProps) {
	const router = useRouter();
	const { open, setOpen, loading, setLoading } = useDialog();

	const [name, setName] = useState<string>(
		plan?.name ? `${plan.name} (Copy)` : "",
	);
	const [version, setVersion] = useState<number | string>(
		typeof plan?.version === "number" ? plan.version + 1 : 1,
	);

	useEffect(() => {
		if (open && plan?.name) {
			setName(`${plan.name} (Copy)`);
			setVersion(typeof plan.version === "number" ? plan.version + 1 : 1);
		}
	}, [open, plan?.name, plan?.version]);

	const handleDuplicate = async (e: React.FormEvent) => {
		e.preventDefault();

		// Debugging log: Check browser console (F12) to ensure ID exists
		console.log("Submitting Duplicate Form:", {
			planId: plan?.id,
			name,
			version,
		});

		if (!plan?.id) {
			toast.error("Error: Missing plan ID");
			return;
		}

		if (!name.trim()) {
			toast.error("Please enter a valid plan name");
			return;
		}

		setLoading(true);
		try {
			const res = await duplicatePlan(plan.id, {
				name: name.trim(),
				version: Number(version) || 1,
			});

			console.log("Duplicate Action Response:", res);

			if (res?.success) {
				toast.success("Plan duplicated", {
					description: `"${name.trim()}" has been created successfully.`,
				});
				setOpen(false);
				router.refresh();
				if (res.plan?.id && onSuccess) {
					onSuccess(res.plan.id);
				}
			} else {
				toast.error("Duplicate failed", {
					description:
						res?.error ||
						"There was an error duplicating the plan.",
				});
			}
		} catch (error) {
			console.error("Duplicate Execution Error:", error);
			toast.error("Duplicate failed", {
				description: "An unexpected error occurred while duplicating.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						size="sm"
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							setOpen(true);
						}}
						className="rounded-none h-7 text-[11px] gap-1 border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/10"
					>
						<CopyIcon className="size-3" weight="bold" />
					</Button>
				}
			/>

			<DialogContent className="sm:max-w-md rounded-none border-secondary/50 bg-card">
				<DialogHeader>
					<DialogTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-primary">
						<CopyIcon className="size-4" weight="bold" />
						Duplicate
						<span className="text-foreground">{plan?.name}</span>
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						All days and exercises will be duplicated into the new
						plan.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleDuplicate} className="space-y-4 pt-2">
					{/* New Name Input */}
					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
							New Plan Name
						</span>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={`${plan?.name || "Plan"} (Copy)`}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							required
							autoFocus
						/>
					</div>

					{/* New Version Input */}
					<div className="space-y-1">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
							Version Number
						</span>
						<Input
							type="number"
							value={version}
							onChange={(e) => {
								const val = e.target.value;
								setVersion(val === "" ? "" : Number(val));
							}}
							className="rounded-none h-8 text-xs border-border/50 bg-background/50 focus:border-primary/50"
							min={1}
							required
						/>
					</div>

					<DialogFooter className="pt-2 gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setOpen(false)}
							className="rounded-none h-8 text-xs"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={loading || !name.trim()}
							className="rounded-none h-8 text-xs gap-1.5 font-semibold"
						>
							<CopyIcon className="size-3.5" weight="bold" />
							{loading ? "Duplicating..." : "Duplicate"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
