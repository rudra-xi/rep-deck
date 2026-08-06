"use client";

import {
	BarbellIcon,
	ClockCounterClockwiseIcon,
	FolderSimpleIcon,
	LayoutIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { featuresData } from "@/constants";

const iconMap = {
	1: BarbellIcon,
	2: ClockCounterClockwiseIcon,
	3: FolderSimpleIcon,
	4: TrendUpIcon,
	5: LayoutIcon,
};

export const Features = () => {
	return (
		<section id="features" className="w-full py-20 px-6 bg-background/50">
			<div className="container max-w-6xl mx-auto space-y-12">
				{/* Section Header */}
				<div className="text-center space-y-4 max-w-2xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-extrabold tracking-wider uppercase">
						Built for lifters.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Everything you need to plan, log, and optimize your
						training blocks without the bloat.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{featuresData.map((item, index) => {
						const IconComponent =
							iconMap[item.id as keyof typeof iconMap] ||
							BarbellIcon;
						const isLastItem = index === featuresData.length - 1;

						return (
							<Card
								key={item.id}
								className={` border border-border/80 bg-card/60 hover:border-primary/50 hover:-translate-y-2 base-ease ${
									isLastItem
										? "md:col-span-2 lg:col-span-1"
										: ""
								}`}
							>
								<CardHeader className="space-y-4">
									<div className="size-11 flex items-center justify-center border border-primary/30 bg-primary/10 text-primary ">
										<IconComponent
											className="size-6"
											weight="bold"
										/>
									</div>
									<CardTitle className="text-xl font-bold uppercase tracking-wider">
										{item.title}.
									</CardTitle>
									<CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base pt-1">
										{item.description}
									</CardDescription>
								</CardHeader>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
};
