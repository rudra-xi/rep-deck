"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
	{ value: 99, suffix: "%", label: "Uptime" },
	{ value: 4, suffix: " Big Lifts", label: "Auto-Tracked" },
	{ value: 8, suffix: "", label: "Measurement Points" },
	{ value: 8, suffix: " Dark", label: "Custom Themes" },
];

function useCountUp(target: number, duration = 1500) {
	const [value, setValue] = useState(0);
	const [started, setStarted] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started) {
					setStarted(true);
				}
			},
			{ threshold: 0.3 },
		);

		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [started]);

	useEffect(() => {
		if (!started) return;

		let frame: number;
		const start = performance.now();

		const tick = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - progress) ** 3;
			setValue(Math.floor(eased * target));

			if (progress < 1) frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [started, target, duration]);

	return { value, ref };
}

function StatItem({
	value,
	suffix,
	label,
}: {
	value: number;
	suffix: string;
	label: string;
}) {
	const { value: animated, ref } = useCountUp(value);

	return (
		<div ref={ref} className="text-center">
			<p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground tabular-nums">
				{animated.toLocaleString()}
				<span className="text-primary">{suffix}</span>
			</p>
			<p className="ftext-xs2 uppercase tracking-widest text-muted-foreground mt-1 font-medium">
				{label}
			</p>
		</div>
	);
}

export const StatsBar = () => {
	return (
		<section className="w-full py-16 px-6 bg-background">
			<div className="container max-w-5xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{STATS.map((stat) => (
						<StatItem key={stat.label} {...stat} />
					))}
				</div>
			</div>
		</section>
	);
};
