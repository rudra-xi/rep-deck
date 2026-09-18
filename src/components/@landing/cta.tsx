"use client";

import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { GoogleBtn } from "@/auth";
import { ctaData } from "@/constants";

const BULLETS = [
	"No credit card required",
	"Free forever tier",
	"Import from any tracker",
];

export const CTA = () => {
	return (
		<section className="w-full py-24 px-6 border-t border-border/40 relative overflow-hidden">
			{/* Background glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="container max-w-4xl mx-auto text-center space-y-6 relative">
				<h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider">
					{ctaData.title}
				</h2>

				<p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
					{ctaData.description}
				</p>

				<div className="pt-4">
					<GoogleBtn
						text={ctaData.buttonText}
						icon={<ArrowRightIcon />}
					/>
				</div>

				{/* Trust bullets */}
				<div className="fwc gap-x-6 gap-y-2 pt-4">
					{BULLETS.map((b) => (
						<div
							key={b}
							className="fcy gap-1.5 text-xs text-muted-foreground"
						>
							<CheckCircleIcon
								className="size-3.5 text-primary"
								weight="bold"
							/>
							{b}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
