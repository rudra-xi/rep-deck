"use client";
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
import type { Challenge } from "@/constants";
import { useChallenge } from "@/hooks";

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
			className={`w-full fcard-flat border ${
				isCurrent
					? "border-secondary/50 card-ease shadow-md ring-1 ring-primary/20 text-foreground"
					: "border-border/50 bg-card/30 fmuted opacity-75"
			}`}
		>
			<CardHeader className="p-3.5 sm:p-4 pb-2 fcol2">
				<div className="fcb gap-1.5">
					<div className="fg1_5">
						{isCurrent && (
							<FireIcon
								size={15}
								weight="fill"
								className="text-primary sh0"
							/>
						)}
						{isPast && (
							<CheckCircleIcon
								size={15}
								weight="bold"
								className="text-primary/70 sh0"
							/>
						)}
						{!isCurrent && !isPast && (
							<ClockIcon size={15} className="fmuted sh0" />
						)}
						<CardTitle
							className={`text-xs sm:text-sm font-bold ${
								isCurrent ? "text-foreground" : "fmuted"
							}`}
						>
							{title}
						</CardTitle>
					</div>

					<Badge
						variant={isCurrent ? "secondary" : "ghost"}
						className={`ftext-3xs sm:ftext-2xs px-1.5 py-0 font-semibold ${
							isCurrent ? "text-primary-foreground" : "fmuted"
						}`}
					>
						{challenge.category}
					</Badge>
				</div>

				{isCurrent && (
					<CardDescription className="ftext-xs2 fmuted pt-0.5">
						Between-Set Bodyweight Challenges.
					</CardDescription>
				)}
			</CardHeader>

			<CardContent className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 fcol2">
				<div
					className={`rounded-md p-2.5 border fcol1 ${
						isCurrent
							? "bg-primary/5 border-primary/20"
							: "bg-muted/10 border-border/30"
					}`}
				>
					<h4
						className={`text-xs font-semibold ${
							isCurrent
								? "text-foreground"
								: "fmuted line-through"
						}`}
					>
						{challenge.title}
					</h4>
					<p className="ftext-xs2 fmuted line-clamp-2 leading-tight">
						{challenge.description}
					</p>
				</div>

				<div className="fcb gap-2 ftext-xs2">
					<span className="fg1 fmuted">
						<TimerIcon
							size={12}
							className={`sh0 ${isCurrent ? "text-primary" : ""}`}
						/>
						Target
					</span>
					<span
						className={`font-semibold ${
							isCurrent ? "text-foreground" : "fmuted"
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
	const {
		mobileTab,
		mobileItems,
		yesterday,
		today,
		tomorrow,
		goToPrevious,
		goToNext,
	} = useChallenge();

	return (
		<div>
			<div className="block md:hidden fcol2">
				<div className="fcb px-1">
					<span />
					<div className="fg1">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={mobileTab === "past"}
							onClick={goToPrevious}
						>
							<CaretLeftIcon size={14} />
						</Button>
						<span className="ftext-xs2 font-medium text-foreground w-16 text-center">
							{mobileItems[mobileTab].title}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={mobileTab === "next"}
							onClick={goToNext}
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
