"use client";

import { GoogleLogoIcon, PlayIcon, SparkleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { Dashboard } from "@/assets/image";
import { GoogleBtn } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Hero = () => {
	const scrollToFeatures = () => {
		document
			.getElementById("features")
			?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="relative w-full overflow-hidden px-6 lg:px-0 pt-24 pb-16 sm:pt-28 lg:pt-0 lg:pb-0">
			{/* ── Ambient background layers ───────────────────────── */}
			<div className="absolute -top-40 -left-40 size-72 sm:size-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute bottom-10 -right-40 size-64 sm:size-86 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-100 sm:size-150 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

			{/* Grid pattern overlay */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					maskImage:
						"radial-gradient(ellipse at center, black 40%, transparent 80%)",
				}}
			/>

			{/* Outer wrapper */}
			<div className="container max-w-7xl mx-auto z-10 fcol lg:flex-row items-center justify-center gap-12 lg:gap-16 lg:min-h-screen">
				{/* ── Left content ───────────────────────────────────── */}
				<div className="w-full lg:fgrow text-center lg:text-left lg:max-w-xl">
					{/* Eyebrow badge */}
					<Badge
						variant="outline"
						className="px-3.5 pt-2.5 pb-2 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-primary border-primary/30 bg-primary/5 gap-1.5"
					>
						<SparkleIcon className="size-3" weight="fill" />
						Built for lifters who demand progress
					</Badge>

					{/* Headline — uppercase */}
					<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-[-0.02em] leading-[0.95] mt-5 sm:mt-6">
						<span className="block text-foreground">
							Stop guessing.
						</span>
						<span className="block bg-linear-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
							Start overloading.
						</span>
					</h1>

					{/* Subhead */}
					<p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-md sm:max-w-xl mx-auto lg:mx-0 leading-relaxed mt-5 sm:mt-7">
						Log every set in seconds. Track real strength gains,
						analyze body composition trends, and optimize
						progressive overload — all in one place, zero
						spreadsheets required.
					</p>

					{/* CTA row */}
					<div className="fcol sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-7 sm:pt-9">
						<GoogleBtn
							text="Start Tracking Free"
							icon={<GoogleLogoIcon />}
						/>

						<Button
							size="lg"
							variant="outline"
							onClick={scrollToFeatures}
							className="w-full sm:w-auto font-semibold gap-2 border-border/60 hover:border-primary/50 hover:bg-primary/5"
						>
							<PlayIcon weight="fill" className="size-4" />
							See How It Works
						</Button>
					</div>

					{/* Inline micro-features */}
					<div className="fwc lg:justify-start gap-x-5 sm:gap-x-6 gap-y-2 pt-6 sm:pt-8 text-[11px] sm:text-xs text-muted-foreground">
						<div className="fcy gap-1.5">
							<span className="size-1.5 rounded-full bg-primary" />
							No credit card required
						</div>
						<div className="fcy gap-1.5">
							<span className="size-1.5 rounded-full bg-primary" />
							1-Click Google Sign-in
						</div>
						<div className="fcy gap-1.5">
							<span className="size-1.5 rounded-full bg-primary" />
							Free forever plan
						</div>
					</div>
				</div>

				{/* ── Right image ────────────────────────────────────── */}
				<div className="w-full lg:fgrow max-w-lg sm:max-w-xl lg:max-w-2xl relative mt-4 sm:mt-6 lg:mt-0">
					{/* Frame glow */}
					<div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full pointer-events-none" />

					<div className="relative w-full aspect-video overflow-hidden bg-background shadow-2xl border border-border/60">
						<Image
							src={Dashboard}
							alt="Rep Deck dashboard preview"
							fill
							priority
							placeholder="blur"
							quality={95}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 700px"
							className="object-cover object-left-top"
						/>

						{/* Top-down gradient for depth */}
						<div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent pointer-events-none" />

						{/* Corner accent */}
						<div className="absolute -top-10 -left-10 size-44 bg-linear-to-br from-primary/20 to-transparent pointer-events-none rounded-full blur-xl" />
					</div>
				</div>
			</div>

			{/* ── Scroll hint (desktop only) ───────────────────────── */}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:fcol items-center gap-2 text-muted-foreground/50">
				<span className="text-[10px] uppercase tracking-widest">
					Scroll
				</span>
				<div className="w-px h-8 bg-linear-to-b from-muted-foreground/50 to-transparent" />
			</div>
		</section>
	);
};
