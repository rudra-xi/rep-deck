"use client";

import { ArrowLeftIcon, FileTextIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Terms() {
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
							Legal Agreement
						</Badge>
					</div>

					<h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-wider flex items-center gap-3">
						<FileTextIcon
							className="size-8 sm:size-10 text-primary shrink-0"
							weight="bold"
						/>
						<span>Terms of Service</span>
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
							1. Acceptance of terms
						</h2>
						<p>
							By accessing or using Rep Deck (the “app” or
							“service”), you agree to these Terms of Service. If
							you do not agree, please do not use the app.
						</p>
					</section>

					{/* Section 2 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							2. Description of service
						</h2>
						<p>
							Rep Deck is a workout tracking and progress
							visualization tool. It allows users to:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Log workouts, sets, reps, and weight.</li>
							<li>Manage training program versions (v1–v4).</li>
							<li>
								Track body metrics and view progress charts.
							</li>
						</ul>
					</section>

					{/* Section 3 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							3. User accounts
						</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								You must create an account (for example, via
								Google login) to use core features.
							</li>
							<li>
								You are responsible for maintaining the security
								of your account.
							</li>
							<li>
								You agree to provide accurate and complete
								information when registering.
							</li>
						</ul>
					</section>

					{/* Section 4 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							4. User content
						</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								You own the workout data and notes you add to
								Rep Deck.
							</li>
							<li>
								You grant Rep Deck a license to store, display,
								and process that content to provide the service.
							</li>
							<li>
								You agree not to upload harmful, illegal, or
								infringing content.
							</li>
						</ul>
					</section>

					{/* Section 5 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							5. Acceptable use
						</h2>
						<p>You agree not to:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Use Rep Deck for any illegal purpose.</li>
							<li>
								Attempt to bypass security, access other users’
								data, or disrupt the service.
							</li>
							<li>
								Use automated tools to scrape or abuse the app.
							</li>
						</ul>
					</section>

					{/* Section 6 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							6. Disclaimers
						</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								Rep Deck is provided “as is” and “as available”
								without warranties of any kind, express or
								implied.
							</li>
							<li>
								We do not guarantee that the app will be
								error-free, uninterrupted, or completely secure.
							</li>
							<li>
								<strong className="text-foreground">
									Medical Disclaimer:
								</strong>{" "}
								Rep Deck is not medical advice. Consult a
								qualified professional before starting any new
								training program.
							</li>
						</ul>
					</section>

					{/* Section 7 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							7. Limitation of liability
						</h2>
						<p>
							To the maximum extent permitted by law, Rep Deck and
							its creator are not liable for any indirect,
							incidental, special, or consequential damages
							arising from your use of the app, including injury,
							data loss, or training-related issues.
						</p>
					</section>

					{/* Section 8 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							8. Changes to the service and terms
						</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								We may modify or discontinue Rep Deck at any
								time.
							</li>
							<li>
								We may update these Terms; continued use after
								changes means you accept the updated terms.
							</li>
						</ul>
					</section>

					{/* Section 9 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							9. Termination
						</h2>
						<p>
							We may suspend or terminate your access to Rep Deck
							at our discretion, especially if you violate these
							Terms.
						</p>
					</section>

					{/* Section 10 */}
					<section className="space-y-3">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							10. Governing law
						</h2>
						<p>
							These Terms are governed by the laws of the
							jurisdiction where the app creator is based, unless
							local law requires otherwise.
						</p>
					</section>

					{/* Section 11 */}
					<section className="space-y-3 border-t border-border/60 pt-8">
						<h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
							11. Contact
						</h2>
						<p>For questions about these Terms, contact:</p>
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
