"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
					<Button
						nativeButton={false}
						render={
							<Link href="/signup">
								{ctaData.buttonText}
								<ArrowRightIcon className="ml-2 size-5 animate-pulse" />
							</Link>
						}
						size="lg"
						className=" font-semibold px-10 py-6 text-base shadow-lg"
					/>
				</div>
			</div>
		</section>
	);
};
