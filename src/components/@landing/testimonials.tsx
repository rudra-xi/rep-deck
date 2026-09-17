"use client";

import { QuotesIcon, StarIcon } from "@phosphor-icons/react";

const TESTIMONIALS = [
	{
		quote: "Finally stopped guessing what I lifted last week. The inline previous-session numbers changed how I train.",
		author: "Arjun M.",
		role: "Powerlifter",
		initials: "AM",
	},
	{
		quote: "Switched from v3 to v4 mid-block and all my history came with me. No other app does this cleanly.",
		author: "Priya K.",
		role: "Hypertrophy Enthusiast",
		initials: "PK",
	},
	{
		quote: "The Big 4 trend chart is the only reason I stopped keeping a paper log. It just works.",
		author: "Rohan S.",
		role: "Intermediate Lifter",
		initials: "RS",
	},
];

export const Testimonials = () => {
	return (
		<section className="w-full py-20 px-6 bg-background">
			<div className="container max-w-6xl mx-auto space-y-12">
				{/* Header */}
				<div className="text-center space-y-4 max-w-2xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
						Built for lifters.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Real feedback from the people using Rep Deck daily.
					</p>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{TESTIMONIALS.map((t) => (
						<div
							key={t.author}
							className="relative border border-border/60 bg-card/50 p-6 space-y-4 hover:border-primary/50 transition-colors"
						>
							<QuotesIcon
								className="size-6 text-primary/40"
								weight="fill"
							/>

							{/* Stars */}
							<div className="flex gap-0.5">
								{Array.from({ length: 5 }).map((_, i) => (
									<StarIcon
										key={i}
										className="size-3.5 text-primary"
										weight="fill"
									/>
								))}
							</div>

							<p className="text-sm text-foreground leading-relaxed italic">
								"{t.quote}"
							</p>

							<div className="flex items-center gap-3 pt-2 border-t border-border/40">
								<div className="fc size-9 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs shrink-0">
									{t.initials}
								</div>
								<div className="min-w-0">
									<p className="text-xs font-bold text-foreground truncate">
										{t.author}
									</p>
									<p className="ftext-2xs text-muted-foreground uppercase tracking-wider truncate">
										{t.role}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
