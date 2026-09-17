"use client";

import Link from "next/link";
import { HouseIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/common";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
	return (
		<main className="min-h-screen flex items-center justify-center p-6 bg-background">
			<div className="w-full max-w-md">
				<div className="fcard-flat p-8 sm:p-10 text-center">
					{/* Brand */}
					<div className="flex items-center justify-center mb-8">
						<div className="fc size-12">
							<Logo className="size-full text-primary" />
						</div>
					</div>

					{/* Code */}
					<p className="text-[64px] sm:text-[80px] font-extrabold leading-none tracking-tighter text-primary">
						404
					</p>

					{/* Title */}
					<h1 className="mt-4 text-sm font-bold uppercase tracking-wider text-foreground">
						Page not found
					</h1>

					{/* Description */}
					<p className="mt-2 text-[11px] text-muted-foreground max-w-xs mx-auto">
						The page you&apos;re looking for doesn&apos;t exist or
						has been moved.
					</p>

					{/* Divider */}
					<Separator className={"my-6"}/>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
						<Button
							nativeButton={false}
							variant="ghost"
							className="flex-1 rounded-none border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-[11px] font-semibold text-muted-foreground h-auto py-2.5 base-ease"
							render={
								<Link href="/dashboard">
									<ArrowLeftIcon
										className="size-3.5"
										weight="bold"
									/>
									Back to dashboard
								</Link>
							}
						/>

						<Button
							nativeButton={false}
							className="flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-semibold h-auto py-2.5"
							render={
								<Link href="/">
									<HouseIcon
										className="size-3.5"
										weight="bold"
									/>
									Home
								</Link>
							}
						/>
					</div>
				</div>

				{/* Footer hint */}
				<p className="mt-4 text-center text-[10px] text-muted-foreground/60 uppercase tracking-wider">
					Rep Deck
				</p>
			</div>
		</main>
	);
}
