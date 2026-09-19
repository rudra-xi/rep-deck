// biome-ignore-all lint/suspicious/noArrayIndexKey: static legal content, never reordered
"use client";

import {
	AtIcon,
	EnvelopeSimpleIcon,
	FileTextIcon,
	UserIcon,
} from "@phosphor-icons/react";
import {
	BackButton,
	CardsHeader,
	PageTitleCard,
	SectionTitleCard,
} from "@/common";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buildTermsMailtoUrl, SUPPORT_EMAIL } from "@/lib/contact";

const SECTIONS = [
	{ id: "acceptance", num: "01", title: "Acceptance of terms" },
	{ id: "description", num: "02", title: "Description of service" },
	{ id: "accounts", num: "03", title: "User accounts" },
	{ id: "content", num: "04", title: "User content" },
	{ id: "use", num: "05", title: "Acceptable use" },
	{ id: "disclaimers", num: "06", title: "Disclaimers" },
	{ id: "liability", num: "07", title: "Limitation of liability" },
	{ id: "changes", num: "08", title: "Changes to the service" },
	{ id: "termination", num: "09", title: "Termination" },
	{ id: "law", num: "10", title: "Governing law" },
	{ id: "contact", num: "11", title: "Contact" },
];

const LAST_UPDATED = "06 August 2026";

function BulletList({ items }: { items: React.ReactNode[] }) {
	return (
		<ul className="fcol2_5">
			{items.map((item, i) => (
				<li key={i} className="ft gap-3">
					<span className="size-1.5 rounded-full bg-primary sh0 mt-2" />
					<span className="text-sm text-muted-foreground leading-relaxed">
						{item}
					</span>
				</li>
			))}
		</ul>
	);
}

function PolicySection({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section id={id} className="fcol3 scroll-mt-24">
			<SectionTitleCard title={title} />
			<Card className="fcard-flat">
				<CardContent className="p-5 fcol4">{children}</CardContent>
			</Card>
		</section>
	);
}

export default function Terms() {
	return (
		<main className="w-full">
			<div className="container max-w-4xl mx-auto fcol6">
				<BackButton text="Back" />

				<div className="fcol3">
					<Badge
						variant="outline"
						className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary border-primary/30 bg-primary/5 w-fit rounded-none"
					>
						Legal Agreement
					</Badge>

					<PageTitleCard
						title="Terms of Service"
						subTitle="The ground rules for using Rep Deck"
						noPeriod
					/>
				</div>

				<Card className="fcard-flat">
					<CardsHeader
						icon={FileTextIcon}
						title="Overview"
						trailing={
							<span className="ftext-2xs fmuted">
								Updated {LAST_UPDATED}
							</span>
						}
					/>
					<CardContent className="p-4 pt-1 fcol4">
						<p className="text-sm text-muted-foreground leading-relaxed">
							By using Rep Deck, you agree to these terms. Please
							read them carefully — they cover your account, your
							data, and your responsibilities.
						</p>

						<div className="hidden sm:block">
							<p className="ftext-2xs fmuted fupper font-bold mb-2">
								On this page
							</p>
							<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
								{SECTIONS.map((s) => (
									<a
										key={s.id}
										href={`#${s.id}`}
										className="ftext-xs2 fmuted hover:text-primary base-ease fcy gap-2"
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

				<PolicySection id="acceptance" title="Acceptance of terms">
					<p className="text-sm text-muted-foreground leading-relaxed">
						By accessing or using Rep Deck (the &ldquo;app&rdquo; or
						&ldquo;service&rdquo;), you agree to these Terms of
						Service. If you do not agree, please do not use the app.
					</p>
				</PolicySection>

				<PolicySection id="description" title="Description of service">
					<p className="text-sm text-muted-foreground">
						Rep Deck is a workout tracking and progress
						visualization tool. It allows users to:
					</p>
					<BulletList
						items={[
							"Log workouts, sets, reps, and weight.",
							"Manage training program versions (v1–v4).",
							"Track body metrics and view progress charts.",
						]}
					/>
				</PolicySection>

				<PolicySection id="accounts" title="User accounts">
					<BulletList
						items={[
							"You must create an account (for example, via Google login) to use core features.",
							"You are responsible for maintaining the security of your account.",
							"You agree to provide accurate and complete information when registering.",
						]}
					/>
				</PolicySection>

				<PolicySection id="content" title="User content">
					<BulletList
						items={[
							"You own the workout data and notes you add to Rep Deck.",
							"You grant Rep Deck a license to store, display, and process that content to provide the service.",
							"You agree not to upload harmful, illegal, or infringing content.",
						]}
					/>
				</PolicySection>

				<PolicySection id="use" title="Acceptable use">
					<p className="text-sm text-muted-foreground">
						You agree not to:
					</p>
					<BulletList
						items={[
							"Use Rep Deck for any illegal purpose.",
							"Attempt to bypass security, access other users' data, or disrupt the service.",
							"Use automated tools to scrape or abuse the app.",
						]}
					/>
				</PolicySection>

				<PolicySection id="disclaimers" title="Disclaimers">
					<BulletList
						items={[
							'Rep Deck is provided "as is" and "as available" without warranties of any kind, express or implied.',
							"We do not guarantee that the app will be error-free, uninterrupted, or completely secure.",
							<>
								<strong className="text-foreground">
									Medical Disclaimer:
								</strong>{" "}
								Rep Deck is not medical advice. Consult a
								qualified professional before starting any new
								training program.
							</>,
						]}
					/>
				</PolicySection>

				<PolicySection id="liability" title="Limitation of liability">
					<p className="text-sm text-muted-foreground leading-relaxed">
						To the maximum extent permitted by law, Rep Deck and its
						creator are not liable for any indirect, incidental,
						special, or consequential damages arising from your use
						of the app, including injury, data loss, or
						training-related issues.
					</p>
				</PolicySection>

				<PolicySection
					id="changes"
					title="Changes to the service and terms"
				>
					<BulletList
						items={[
							"We may modify or discontinue Rep Deck at any time.",
							"We may update these Terms; continued use after changes means you accept the updated terms.",
						]}
					/>
				</PolicySection>

				<PolicySection id="termination" title="Termination">
					<p className="text-sm text-muted-foreground leading-relaxed">
						We may suspend or terminate your access to Rep Deck at
						our discretion, especially if you violate these Terms.
					</p>
				</PolicySection>

				<PolicySection id="law" title="Governing law">
					<p className="text-sm text-muted-foreground leading-relaxed">
						These Terms are governed by the laws of the jurisdiction
						where the app creator is based, unless local law
						requires otherwise.
					</p>
				</PolicySection>

				<section id="contact" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Contact" />
					<Card className="fcard-flat">
						<CardsHeader icon={AtIcon} title="Get in touch" />
						<CardContent className="p-5 pt-1 fcol4">
							<p className="text-sm text-muted-foreground">
								For questions about these Terms:
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
										<p className="ftext-2xs fmuted fupper font-bold">
											Email
										</p>
										<a
											href={buildTermsMailtoUrl()}
											className="text-sm text-foreground hover:text-primary base-ease block"
										>
											{SUPPORT_EMAIL}
										</a>
									</div>
								</div>

								<div className="fcy gap-3 p-3 border border-border/40 bg-background/50">
									<div className="ficon-box-sm">
										<UserIcon
											className="size-4"
											weight="bold"
										/>
									</div>
									<div className="min-w-0 fgrow">
										<p className="ftext-2xs fmuted fupper font-bold">
											Maintainer
										</p>
										<p className="text-sm text-foreground">
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
