"use client";

import { EnvelopeSimpleIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	BackButton,
	CardsHeader,
	PageTitleCard,
	SectionTitleCard,
} from "@/common";

const SECTIONS = [
	{ id: "cover", num: "01", title: "What this policy covers" },
	{ id: "collect", num: "02", title: "Information we collect" },
	{ id: "use", num: "03", title: "How we use your information" },
	{ id: "storage", num: "04", title: "Data storage and security" },
	{ id: "sharing", num: "05", title: "Data sharing" },
	{ id: "rights", num: "06", title: "Your rights" },
	{ id: "retention", num: "07", title: "Data retention" },
	{ id: "children", num: "08", title: "Children's privacy" },
	{ id: "changes", num: "09", title: "Changes to this policy" },
	{ id: "contact", num: "10", title: "Contact" },
];

const LAST_UPDATED = "06 August 2026";
const SUPPORT_EMAIL = "xi.rudra.code@gmail.com";

function BulletList({ items }: { items: React.ReactNode[] }) {
	return (
		<ul className="fcol2_5">
			{items.map((item, i) => (
				<li key={i} className="ft gap-3">
					<span className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />
					<span className="text-sm text-muted-foreground leading-relaxed">
						{item}
					</span>
				</li>
			))}
		</ul>
	);
}

export default function Privacy() {
	return (
		<main className="w-full">
			<div className="container max-w-4xl mx-auto fcol6">
				{/* Back nav */}
				<BackButton text="Back" />

				{/* Page header */}
				<div className="fcol3">
					<Badge
						variant="outline"
						className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary border-primary/30 bg-primary/5 w-fit rounded-none"
					>
						Legal Notice
					</Badge>

					<PageTitleCard
						title="Privacy Policy"
						subTitle="How Rep Deck collects, uses, and protects your data"
						noPeriod
					/>
				</div>

				{/* Meta + TOC card */}
				<Card className="fcard-flat">
					<CardsHeader
						icon={ShieldCheckIcon}
						title="Overview"
						trailing={
							<span className="ftext-2xs fmuted font-mono">
								Updated {LAST_UPDATED}
							</span>
						}
					/>
					<CardContent className="p-4 pt-1 fcol4">
						<p className="text-sm text-muted-foreground leading-relaxed">
							Your workout data belongs to you. This page explains
							what we collect, why we collect it, and how you can
							control it.
						</p>

						{/* TOC — hidden on mobile, useful on desktop */}
						<div className="hidden sm:block">
							<p className="ftext-2xs fmuted fupper font-bold tracking-widest mb-2">
								On this page
							</p>
							<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
								{SECTIONS.map((s) => (
									<a
										key={s.id}
										href={`#${s.id}`}
										className="ftext-xs2 fmuted hover:text-primary transition-colors fcy gap-2"
									>
										<span className="font-mono text-primary/60">
											{s.num}.
										</span>
										<span className="truncate">
											{s.title}
										</span>
									</a>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				<Separator />

				{/* ── Sections (unchanged) ─────────────────────────── */}
				<section id="cover" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="What this policy covers" />
					<Card className="fcard-flat">
						<CardContent className="p-5">
							<p className="text-sm text-muted-foreground leading-relaxed">
								This Privacy Policy explains how Rep Deck (the
								&ldquo;app&rdquo;) collects, uses, stores, and
								protects your personal information when you use
								the app and website.
							</p>
						</CardContent>
					</Card>
				</section>

				<section id="collect" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Information we collect" />
					<Card className="fcard-flat">
						<CardContent className="p-5 fcol4">
							<p className="text-sm text-muted-foreground">
								Rep Deck may collect the following types of
								information:
							</p>
							<BulletList
								items={[
									<>
										<strong className="text-foreground">
											Account information:
										</strong>{" "}
										Name, email address, and profile details
										when you sign in with Google or another
										supported provider.
									</>,
									<>
										<strong className="text-foreground">
											Workout data:
										</strong>{" "}
										Exercises, sets, reps, weight, RPE,
										notes, program versions (v1–v4), and
										session dates that you log in the app.
									</>,
									<>
										<strong className="text-foreground">
											Body metrics (optional):
										</strong>{" "}
										Body weight, body fat percentage, and
										body measurements (arms, thighs, etc.)
										if you choose to enter them.
									</>,
									<>
										<strong className="text-foreground">
											Usage information:
										</strong>{" "}
										Pages you visit, features you use, and
										interactions with the app to help
										improve performance and fix issues.
									</>,
									<>
										<strong className="text-foreground">
											Device information:
										</strong>{" "}
										Browser type, device type, operating
										system, and IP address for security and
										analytics.
									</>,
								]}
							/>
						</CardContent>
					</Card>
				</section>

				<section id="use" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="How we use your information" />
					<Card className="fcard-flat">
						<CardContent className="p-5 fcol4">
							<p className="text-sm text-muted-foreground">
								We use your information to:
							</p>
							<BulletList
								items={[
									"Provide and maintain the Rep Deck service.",
									"Store and display your workout history and progress.",
									"Allow you to switch between program versions without losing data.",
									"Improve the app, fix bugs, and understand how features are used.",
									"Protect the app from abuse, fraud, and security issues.",
								]}
							/>
						</CardContent>
					</Card>
				</section>

				<section id="storage" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Data storage and security" />
					<Card className="fcard-flat">
						<CardContent className="p-5">
							<BulletList
								items={[
									"Your data is stored in a secure database (Supabase/Postgres) with access controls.",
									"We use industry-standard practices to protect data in transit and at rest.",
									"As a personal project, Rep Deck is hosted on platforms like Vercel and Supabase, which have their own security measures.",
								]}
							/>
						</CardContent>
					</Card>
				</section>

				<section id="sharing" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Data sharing" />
					<Card className="fcard-flat">
						<CardContent className="p-5 fcol4">
							<p className="text-sm text-muted-foreground">
								Rep Deck does not sell your personal data. We
								may share data only with:
							</p>
							<BulletList
								items={[
									"Service providers that host or operate the app (for example, database and hosting providers).",
									"Legal authorities if required by law or to protect our rights and safety.",
								]}
							/>
						</CardContent>
					</Card>
				</section>

				<section id="rights" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Your rights" />
					<Card className="fcard-flat">
						<CardContent className="p-5 fcol4">
							<p className="text-sm text-muted-foreground">
								Depending on your location, you may have the
								right to:
							</p>
							<BulletList
								items={[
									"Access the personal data we hold about you.",
									"Request correction or deletion of your data.",
									"Stop certain types of processing (for example, analytics).",
								]}
							/>
							<p className="text-sm text-muted-foreground">
								To exercise these rights, contact us at the
								email provided below.
							</p>
						</CardContent>
					</Card>
				</section>

				<section id="retention" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Data retention" />
					<Card className="fcard-flat">
						<CardContent className="p-5">
							<p className="text-sm text-muted-foreground leading-relaxed">
								We keep your data as long as your account is
								active and you use the app. If you delete your
								account or request deletion, we will remove your
								personal data within a reasonable time, except
								where we must retain it for legal or security
								reasons.
							</p>
						</CardContent>
					</Card>
				</section>

				<section id="children" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Children's privacy" />
					<Card className="fcard-flat">
						<CardContent className="p-5">
							<p className="text-sm text-muted-foreground leading-relaxed">
								Rep Deck is not intended for children under 13.
								We do not knowingly collect personal data from
								children under 13. If you believe we have,
								please contact us so we can remove it.
							</p>
						</CardContent>
					</Card>
				</section>

				<section id="changes" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Changes to this policy" />
					<Card className="fcard-flat">
						<CardContent className="p-5">
							<p className="text-sm text-muted-foreground leading-relaxed">
								We may update this Privacy Policy from time to
								time. The updated version will be posted in the
								app with a new &ldquo;Last updated&rdquo; date.
							</p>
						</CardContent>
					</Card>
				</section>

				<section id="contact" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Contact" />
					<Card className="fcard-flat">
						<CardsHeader
							icon={EnvelopeSimpleIcon}
							title="Get in touch"
						/>
						<CardContent className="p-5 pt-1 fcol4">
							<p className="text-sm text-muted-foreground">
								If you have questions about this Privacy Policy
								or your data:
							</p>

							<div className="fcol2_5">
								<div className="fcy gap-3 p-3 border border-border/40 bg-background/50">
									<div className="ficon-box-sm">
										<EnvelopeSimpleIcon
											className="size-4"
											weight="bold"
										/>
									</div>
									<div className="min-w-0 fgrow">
										<p className="ftext-2xs fmuted fupper font-bold tracking-widest">
											Email
										</p>
										<a
											href={`mailto:${SUPPORT_EMAIL}`}
											className="text-sm text-foreground hover:text-primary transition-colors font-mono truncate block"
										>
											{SUPPORT_EMAIL}
										</a>
									</div>
								</div>

								<div className="fcy gap-3 p-3 border border-border/40 bg-background/50">
									<div className="ficon-box-sm">
										<ShieldCheckIcon
											className="size-4"
											weight="bold"
										/>
									</div>
									<div className="min-w-0 fgrow">
										<p className="ftext-2xs fmuted fupper font-bold tracking-widest">
											Maintainer
										</p>
										<p className="text-sm text-foreground font-mono">
											rudra-xi
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>
			</div>
		</main>
	);
}
