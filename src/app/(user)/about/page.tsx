"use client";

import {
	BarbellIcon,
	CheckCircleIcon,
	FolderSimpleIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { aboutData } from "@/constants";

// Icon mapping per bullet point ID
const bulletIconMap = {
	1: BarbellIcon,
	2: FolderSimpleIcon,
	3: TrendUpIcon,
};

export default function About() {
	return (
		<section id="about" className="w-full py-20 px-6 bg-background">
			<div className="container max-w-5xl mx-auto space-y-10">
				{/* Badge & Heading */}
				<div className="space-y-4">
					<div>
						<Badge
							variant="outline"
							className="px-3 py-1 text-xs uppercase tracking-wider border-foreground/30 text-primary"
						>
							{aboutData.badge}
						</Badge>
					</div>

					<h2 className="text-3xl lg:text-4xl sm:text-5xl font-extrabold uppercase tracking-wider">
						{aboutData.title}
					</h2>
				</div>

				{/* Paragraph */}
				<p className="text-muted-foreground text-base lg:text-lg sm:text-xl leading-relaxed max-w-3xl">
					{aboutData.description}
				</p>

				{/* Bullet Points */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
					{aboutData.bullets.map((item) => {
						const BulletIcon =
							bulletIconMap[
								item.id as keyof typeof bulletIconMap
							] || CheckCircleIcon;

						return (
							<div
								key={item.id}
								className="flex items-start gap-4 p-6 border border-border/80 bg-card/50 hover:-translate-y-2 hover:border-primary/50 base-ease"
							>
								<div className="size-10 shrink-0 flex items-center justify-center border border-primary/30 bg-primary/10 text-primary ">
									<BulletIcon
										className="size-5"
										weight="bold"
									/>
								</div>
								<span className="text-sm lg:text-base font-medium leading-snug pt-1">
									{item.text}
								</span>
							</div>
						);
					})}
				</div>

				{/* Creator Line */}
				<div className="pt-6 border-t border-border/40 text-xs lg:text-sm text-muted-foreground font-mono">
					{aboutData.creator}
				</div>
			</div>
		</section>
	);
}
