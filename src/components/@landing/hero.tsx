"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { Sample } from "@/assets/image";
import { GoogleBtn } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Hero = () => {
	const scrollToFeatures = () => {
		const featuresSection = document.getElementById("features");
		if (featuresSection) {
			featuresSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden py-16 px-6">
			{/* Subtle Background Glow */}
			<div className="absolute -top-40 -left-40 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute bottom-10 -right-40 size-86 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 z-10">
				{/* Left Content */}
				<div className="flex-1 space-y-6 text-center lg:text-left">
					<Badge
						variant="outline"
						className="px-4 pt-3 pb-2.5 text-sm tracking-widest uppercase text-primary"
					>
						Track the lift. Own the progress.
					</Badge>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-16 capitalize">
						Your training, <br />
						<span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							clearly logged.
						</span>
					</h1>

					<p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
						A clean workout tracker built for lifters who want to
						log sessions, monitor progress, and stay consistent
						across every training block.
					</p>

					{/* Call To Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
						{/* Redirects to Signup Page */}
						<GoogleBtn
							text="Start Tracking Free"
							icon={<GoogleLogoIcon />}
						/>

						{/* Smooth Scroll to Features */}
						<Button
							size="lg"
							variant="outline"
							onClick={scrollToFeatures}
							className="w-full sm:w-auto font-semibold"
						>
							Explore Features
						</Button>
					</div>
				</div>

				{/* Right Image Display (Rectangular Dashboard Preview) */}
				<div className="flex-1 w-full max-w-xl lg:max-w-2xl shrink-0">
					<div className="relative w-full aspect-16/10 sm:aspect-v overflow-hidden bg-background shadow-2xl border border-border/80">
						{/*TODO: A Dashboard Preview will be added here*/}
						<Image
							src={Sample}
							alt="App dashboard preview"
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 600px"
							className="object-cover object-top"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
