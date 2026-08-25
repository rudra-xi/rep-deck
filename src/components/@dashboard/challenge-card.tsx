"use client";

import React, { useMemo, useState } from "react";
import {
	CaretLeftIcon,
	CaretRightIcon,
	CheckCircleIcon,
	ClockIcon,
	FireIcon,
	TimerIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CHALLENGES, type Challenge } from "@/constants";

interface ChallengeItemProps {
	variant: "past" | "current" | "next";
	title: string;
	challenge: Challenge;
}

function ChallengeCardItem({ variant, title, challenge }: ChallengeItemProps) {
	const isCurrent = variant === "current";
	const isPast = variant === "past";

	return (
		<Card
			size="sm"
			className={`w-full transition-all ${
				isCurrent
					? "border border-secondary/50 base-ease hover:border-primary/50 bg-card/50 text-foreground shadow-md ring-1 ring-primary/20"
					: "border-border/50 bg-card/30 text-muted-foreground opacity-75"
			}`}
		>
			<CardHeader className="p-3.5 sm:p-4 pb-2 space-y-1">
				<div className="fcb gap-1.5">
					<div className="fcx gap-1.5">
						{isCurrent && (
							<FireIcon
								size={15}
								weight="fill"
								className="text-primary shrink-0"
							/>
						)}
						{isPast && (
							<CheckCircleIcon
								size={15}
								weight="bold"
								className="text-primary/70 shrink-0"
							/>
						)}
						{!isCurrent && !isPast && (
							<ClockIcon
								size={15}
								className="text-muted-foreground shrink-0"
							/>
						)}
						<CardTitle
							className={`text-xs sm:text-sm font-bold ${
								isCurrent
									? "text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{title}
						</CardTitle>
					</div>

					<Badge
						variant={isCurrent ? "secondary" : "ghost"}
						className={`text-[9px] sm:text-[10px] px-1.5 py-0 font-semibold ${
							isCurrent
								? "text-primary-foreground"
								: "text-muted-foreground"
						}`}
					>
						{challenge.category}
					</Badge>
				</div>

				{isCurrent && (
					<CardDescription className="text-[11px] text-muted-foreground pt-0.5">
						Between-Set Bodyweight Challenges.
					</CardDescription>
				)}
			</CardHeader>

			<CardContent className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 space-y-2.5">
				<div
					className={`rounded-md p-2.5 border space-y-1 ${
						isCurrent
							? "bg-primary/5 border-primary/20"
							: "bg-muted/10 border-border/30"
					}`}
				>
					<h4
						className={`text-xs font-semibold ${
							isCurrent
								? "text-foreground"
								: "text-muted-foreground line-through"
						}`}
					>
						{challenge.title}
					</h4>
					<p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
						{challenge.description}
					</p>
				</div>

				<div className="fcb gap-2 text-[11px]">
					<span className="fcx gap-1 text-muted-foreground">
						<TimerIcon
							size={12}
							className={`sh-0 ${isCurrent ? "text-primary" : ""}`}
						/>
						Target
					</span>
					<span
						className={`font-semibold ${
							isCurrent
								? "text-foreground"
								: "text-muted-foreground"
						}`}
					>
						{challenge.target}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

export function ChallengeCard() {
	const [mobileTab, setMobileTab] = useState<"past" | "current" | "next">(
		"current",
	);

	const { yesterday, today, tomorrow } = useMemo(() => {
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 0);
		const diff = now.getTime() - start.getTime();
		const oneDay = 1000 * 60 * 60 * 24;
		const dayIndex = Math.floor(diff / oneDay);

		const total = CHALLENGES.length;
		const yesterdayIdx = (dayIndex - 1 + total) % total;
		const todayIdx = dayIndex % total;
		const tomorrowIdx = (dayIndex + 1) % total;

		return {
			yesterday: CHALLENGES[yesterdayIdx],
			today: CHALLENGES[todayIdx],
			tomorrow: CHALLENGES[tomorrowIdx],
		};
	}, []);

	const mobileItems = {
		past: { title: "Yesterday", challenge: yesterday },
		current: { title: "Today", challenge: today },
		next: { title: "Tomorrow", challenge: tomorrow },
	};

	return (
		<div>
			{/* Mobile View: Single card with prev/next quick toggle */}
			<div className="block md:hidden space-y-2">
				<div className="fcb px-1">
					<span/>
					<div className="fcx gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={mobileTab === "past"}
							onClick={() =>
								setMobileTab((p) =>
									p === "next" ? "current" : "past",
								)
							}
						>
							<CaretLeftIcon size={14} />
						</Button>
						<span className="text-[11px] font-medium text-foreground w-16 text-center">
							{mobileItems[mobileTab].title}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={mobileTab === "next"}
							onClick={() =>
								setMobileTab((p) =>
									p === "past" ? "current" : "next",
								)
							}
						>
							<CaretRightIcon size={14} />
						</Button>
					</div>
				</div>

				<ChallengeCardItem
					variant={mobileTab}
					title={mobileItems[mobileTab].title}
					challenge={mobileItems[mobileTab].challenge}
				/>
			</div>

			{/* Desktop View: 3 Cards Grid */}
			<div className="hidden md:grid md:grid-cols-3 gap-3">
				<ChallengeCardItem
					variant="past"
					title="Yesterday"
					challenge={yesterday}
				/>
				<ChallengeCardItem
					variant="current"
					title="Today"
					challenge={today}
				/>
				<ChallengeCardItem
					variant="next"
					title="Tomorrow"
					challenge={tomorrow}
				/>
			</div>
		</div>
	);
}
