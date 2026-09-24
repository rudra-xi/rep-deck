"use client";

import { QuotesIcon, StarIcon } from "@phosphor-icons/react";
import { testimonialsData } from "@/constants";

export const Testimonials = () => {
	return (
		<section className="w-full py-20 px-6 bg-background">
			<div className="container max-w-6xl mx-auto space-y-12">
				<div className="text-center space-y-4 max-w-2xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
						Trusted by lifters.
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg">
						Real feedback from people using Rep Deck daily.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{testimonialsData.map((t) => (
						<div
							key={t.author}
							className="relative border border-border/60 bg-card/50 p-6 space-y-4 hover:border-primary/50 transition-colors"
						>
							<QuotesIcon
								className="size-6 text-primary/40"
								weight="fill"
							/>

							<div className="flex gap-0.5">
								{["s1", "s2", "s3", "s4", "s5"].map((id) => (
									<StarIcon
										key={id}
										className="size-3.5 text-primary"
										weight="fill"
									/>
								))}
							</div>

							<p className="text-sm text-foreground leading-relaxed italic">
								&ldquo;{t.quote}&rdquo;
							</p>

							<div className="fcy gap-3 pt-2 border-t border-border/40">
								<div className="fc size-9 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs sh0">
									{t.initials}
								</div>
								<div className="min-w-0">
									<p className="text-xs font-bold text-foreground">
										{t.author}
									</p>
									<p className="ftext-2xs text-muted-foreground uppercase tracking-wider">
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
