// biome-ignore-all lint/suspicious/noArrayIndexKey: static legal content, never reordered
"use client";

import {
	AtIcon,
	EnvelopeSimpleIcon,
	ShieldCheckIcon,
	UserIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
	BackButton,
	CardsHeader,
	PageTitleCard,
	SectionTitleCard,
} from "@/common";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	buildMailtoUrl,
	buildPrivacyMailtoUrl,
	SUPPORT_EMAIL,
} from "@/lib/contact";

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
const FALLBACK_PRIVACY_MAILTO = buildMailtoUrl({
	subject: "Rep Deck — Privacy Inquiry",
});

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

export default function Privacy() {
	const [privacyMailto, setPrivacyMailto] = useState(FALLBACK_PRIVACY_MAILTO);
	useEffect(() => {
		setPrivacyMailto(buildPrivacyMailtoUrl());
	}, []);

	return (
		<main className="w-full">
			<div className="container max-w-4xl mx-auto fcol6">
				<BackButton text="Back" />

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

				<Card className="fcard-flat">
					<CardsHeader
						icon={ShieldCheckIcon}
						title="Overview"
						trailing={
							<span className="ftext-2xs fmuted">
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
										<span className="text-primary/60">
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

				<PolicySection id="cover" title="What this policy covers">
					<p className="text-sm text-muted-foreground leading-relaxed">
						This Privacy Policy explains how Rep Deck (the
						&ldquo;app&rdquo;) collects, uses, stores, and protects
						your personal information when you use the app and
						website.
					</p>
				</PolicySection>

				<PolicySection id="collect" title="Information we collect">
					<p className="text-sm text-muted-foreground">
						Rep Deck may collect the following types of information:
					</p>
					<BulletList
						items={[
							<>
								<strong className="text-foreground">
									Account information:
								</strong>{" "}
								Name, email address, and profile details when
								you sign in with Google or another supported
								provider.
							</>,
							<>
								<strong className="text-foreground">
									Workout data:
								</strong>{" "}
								Exercises, sets, reps, weight, RPE, notes,
								program versions (v1–v4), and session dates that
								you log in the app.
							</>,
							<>
								<strong className="text-foreground">
									Body metrics (optional):
								</strong>{" "}
								Body weight, body fat percentage, and body
								measurements (arms, thighs, etc.) if you choose
								to enter them.
							</>,
							<>
								<strong className="text-foreground">
									Usage information:
								</strong>{" "}
								Pages you visit, features you use, and
								interactions with the app to help improve
								performance and fix issues.
							</>,
							<>
								<strong className="text-foreground">
									Device information:
								</strong>{" "}
								Browser type, device type, operating system, and
								IP address for security and analytics.
							</>,
						]}
					/>
				</PolicySection>

				<PolicySection id="use" title="How we use your information">
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
				</PolicySection>

				<PolicySection id="storage" title="Data storage and security">
					<BulletList
						items={[
							"Your data is stored in a secure database (Supabase/Postgres) with access controls.",
							"We use industry-standard practices to protect data in transit and at rest.",
							"As a personal project, Rep Deck is hosted on platforms like Vercel and Supabase, which have their own security measures.",
						]}
					/>
				</PolicySection>

				<PolicySection id="sharing" title="Data sharing">
					<p className="text-sm text-muted-foreground">
						Rep Deck does not sell your personal data. We may share
						data only with:
					</p>
					<BulletList
						items={[
							"Service providers that host or operate the app (for example, database and hosting providers).",
							"Legal authorities if required by law or to protect our rights and safety.",
						]}
					/>
				</PolicySection>

				<PolicySection id="rights" title="Your rights">
					<p className="text-sm text-muted-foreground">
						Depending on your location, you may have the right to:
					</p>
					<BulletList
						items={[
							"Access the personal data we hold about you.",
							"Request correction or deletion of your data.",
							"Stop certain types of processing (for example, analytics).",
						]}
					/>
					<p className="text-sm text-muted-foreground">
						To exercise these rights, contact us at the email
						provided below.
					</p>
				</PolicySection>

				<PolicySection id="retention" title="Data retention">
					<p className="text-sm text-muted-foreground leading-relaxed">
						We keep your data as long as your account is active and
						you use the app. If you delete your account or request
						deletion, we will remove your personal data within a
						reasonable time, except where we must retain it for
						legal or security reasons.
					</p>
				</PolicySection>

				<PolicySection id="children" title="Children's privacy">
					<p className="text-sm text-muted-foreground leading-relaxed">
						Rep Deck is not intended for children under 13. We do
						not knowingly collect personal data from children under
						13. If you believe we have, please contact us so we can
						remove it.
					</p>
				</PolicySection>

				<PolicySection id="changes" title="Changes to this policy">
					<p className="text-sm text-muted-foreground leading-relaxed">
						We may update this Privacy Policy from time to time. The
						updated version will be posted in the app with a new
						&ldquo;Last updated&rdquo; date.
					</p>
				</PolicySection>

				<section id="contact" className="fcol3 scroll-mt-24">
					<SectionTitleCard title="Contact" />
					<Card className="fcard-flat">
						<CardsHeader icon={AtIcon} title="Get in touch" />
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
										<p className="ftext-2xs fmuted fupper font-bold">
											Email
										</p>
										<a
											href={privacyMailto}
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
