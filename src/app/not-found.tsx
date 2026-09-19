"use client";

import { ArrowLeftIcon, HouseIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Logo } from "@/common";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
	return (
		<main className="min-h-screen fc p-6 bg-background">
			<div className="w-full max-w-md">
				<div className="fcard-flat p-8 sm:p-10 text-center">
					<div className="fc mb-8">
						<div className="fc size-12">
							<Logo className="size-full text-primary" />
						</div>
					</div>

					<p className="text-[64px] sm:text-[80px] font-extrabold leading-none tracking-tighter text-primary">
						404
					</p>

					<h1 className="mt-4 text-sm font-bold uppercase tracking-wider text-foreground">
						Page not found
					</h1>

					<p className="mt-2 text-[11px] text-muted-foreground max-w-xs mx-auto">
						The page you&apos;re looking for doesn&apos;t exist or
						has been moved.
					</p>

					<Separator className={"my-6"} />

					<div className="fcol sm:flex-row items-stretch sm:items-center gap-2">
						<Button
							nativeButton={false}
							variant="ghost"
							className="fgrow rounded-none border border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-[11px] font-semibold text-muted-foreground h-auto py-2.5 base-ease"
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
							className="fgrow rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-semibold h-auto py-2.5"
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

				<p className="mt-4 text-center text-[10px] text-muted-foreground/60 uppercase tracking-wider">
					Rep Deck
				</p>
			</div>
		</main>
	);
}
