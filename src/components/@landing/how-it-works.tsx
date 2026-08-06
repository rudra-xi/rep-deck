"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { onboardingSteps } from "@/constants";

export const HowItWorks = () => {
	return (
		<section className="w-full py-20 px-6 bg-background">
			<div className="container max-w-6xl mx-auto space-y-12">
				{/* Section Header */}
				<div className="text-center space-y-4 max-w-2xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
						How Rep Deck Works.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Three simple steps to streamline your workouts and
						maximize your gains.
					</p>
				</div>

				{/* Steps Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{onboardingSteps.map((item) => (
						<Card
							key={item.step}
							className=" border border-border/80 bg-card/50 shadow-sm  hover:border-primary/50 hover:-translate-y-2 base-ease"
						>
							<CardHeader className="space-y-4">
								{/* Step Indicator */}
								<div className="size-10 flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg ">
									0{item.step}
								</div>
								<CardTitle className="text-xl font-bold uppercase tracking-wider">
									{item.title}.
								</CardTitle>
								<CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base pt-1">
									{item.description}
								</CardDescription>
							</CardHeader>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};
