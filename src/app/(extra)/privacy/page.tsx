"use client";

import { ArrowLeftIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Privacy() {
	return (
		<main className="w-full min-h-screen py-24 px-6 bg-background text-foreground">
			<div className="container max-w-4xl mx-auto space-y-12">
				{/* Top Back Navigation */}
				<div>
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition-colors"
					>
						<ArrowLeftIcon className="size-4" weight="bold" />
						<span>Back to Home</span>
					</Link>
				</div>

				{/* Header Section */}
				<div className="space-y-4 border-b border-border/60 pb-8">
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="px-3 py-1 text-xs uppercase tracking-wider border-foreground/30 text-primary rounded-none"
						>
							Legal Notice
						</Badge>
					</div>

					<h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-wider flex items-center gap-3">
						<ShieldCheckIcon
							className="size-8 sm:size-10 text-primary shrink-0"
							weight="bold"
						/>
						<span>Privacy Policy</span>
					</h1>

					<p className="text-muted-foreground text-sm font-mono pt-1">
						Last updated: 06 August 2026
					</p>
				</div>

				{/* Document Content */}
				<article className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed text-sm sm:text-base">
					{/* Section 1 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							1. What this policy covers
						</h2>
						<p>
							This Privacy Policy explains how Rep Deck (the
							“app”) collects, uses, stores, and protects your
							personal information when you use the app and
							website.
						</p>
					</section>

					{/* Section 2 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							2. Information we collect
						</h2>
						<p>
							Rep Deck may collect the following types of
							information:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong className="text-foreground">
									Account information:
								</strong>{" "}
								Name, email address, and profile details when
								you sign in with Google or another supported
								provider.
							</li>
							<li>
								<strong className="text-foreground">
									Workout data:
								</strong>{" "}
								Exercises, sets, reps, weight, RPE, notes,
								program versions (v1–v4), and session dates that
								you log in the app.
							</li>
							<li>
								<strong className="text-foreground">
									Body metrics (optional):
								</strong>{" "}
								Body weight, body fat percentage, and body
								measurements (arms, thighs, etc.) if you choose
								to enter them.
							</li>
							<li>
								<strong className="text-foreground">
									Usage information:
								</strong>{" "}
								Pages you visit, features you use, and
								interactions with the app to help improve
								performance and fix issues.
							</li>
							<li>
								<strong className="text-foreground">
									Device information:
								</strong>{" "}
								Browser type, device type, operating system, and
								IP address for security and analytics.
							</li>
						</ul>
					</section>

					{/* Section 3 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							3. How we use your information
						</h2>
						<p>We use your information to:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Provide and maintain the Rep Deck service.</li>
							<li>
								Store and display your workout history and
								progress.
							</li>
							<li>
								Allow you to switch between program versions
								without losing data.
							</li>
							<li>
								Improve the app, fix bugs, and understand how
								features are used.
							</li>
							<li>
								Protect the app from abuse, fraud, and security
								issues.
							</li>
						</ul>
					</section>

					{/* Section 4 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							4. Data storage and security
						</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								Your data is stored in a secure database (e.g.,
								Supabase/Postgres) with access controls.
							</li>
							<li>
								We use industry-standard practices to protect
								data in transit and at rest.
							</li>
							<li>
								As a personal project, Rep Deck is hosted on
								platforms like Vercel and Supabase, which have
								their own security measures.
							</li>
						</ul>
					</section>

					{/* Section 5 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							5. Data sharing
						</h2>
						<p>
							Rep Deck does not sell your personal data. We may
							share data only with:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								Service providers that host or operate the app
								(for example, database and hosting providers).
							</li>
							<li>
								Legal authorities if required by law or to
								protect our rights and safety.
							</li>
						</ul>
					</section>

					{/* Section 6 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							6. Your rights
						</h2>
						<p>
							Depending on your location, you may have the right
							to:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Access the personal data we hold about you.</li>
							<li>
								Request correction or deletion of your data.
							</li>
							<li>
								Stop certain types of processing (for example,
								analytics).
							</li>
						</ul>
						<p>
							To exercise these rights, contact us at the email
							provided below.
						</p>
					</section>

					{/* Section 7 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							7. Data retention
						</h2>
						<p>
							We keep your data as long as your account is active
							and you use the app. If you delete your account or
							request deletion, we will remove your personal data
							within a reasonable time, except where we must
							retain it for legal or security reasons.
						</p>
					</section>

					{/* Section 8 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							8. Children’s privacy
						</h2>
						<p>
							Rep Deck is not intended for children under 13. We
							do not knowingly collect personal data from children
							under 13. If you believe we have, please contact us
							so we can remove it.
						</p>
					</section>

					{/* Section 9 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							9. Changes to this policy
						</h2>
						<p>
							We may update this Privacy Policy from time to time.
							The updated version will be posted in the app with a
							new “Last updated” date.
						</p>
					</section>

					{/* Section 10 */}
					<section className="space-y-3 border-t border-border/60 pt-8">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							10. Contact
						</h2>
						<p>
							If you have questions about this Privacy Policy or
							your data, contact:
						</p>
						<div className="p-4 border border-border/80 bg-card/50 font-mono text-sm space-y-1">
							<p className="font-semibold text-foreground">
								rudra-xi
							</p>
							<p>Email: xi.rudra.code@gmail.com</p>
						</div>
					</section>
				</article>
			</div>
		</main>
	);
}
