"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { GoogleBtn } from "@/auth";
import { ctaData } from "@/constants";

export const CTA = () => {
	return (
		<section className="w-full py-20 px-6 border-t border-border/40">
			<div className="container max-w-4xl mx-auto text-center space-y-6">
				{/* Title */}
				<h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider">
					{ctaData.title}
				</h2>

				{/* Description */}
				<p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
					{ctaData.description}
				</p>

				{/* Action Button */}
				<div className="pt-4">
					<GoogleBtn
						text={ctaData.buttonText}
						icon={<ArrowRightIcon />}
					/>
				</div>
			</div>
		</section>
	);
};
