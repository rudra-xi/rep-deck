import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import {
	CTA,
	FAQ,
	Features,
	Hero,
	HowItWorks,
	Social,
	StatsBar,
	ShowcaseSection,
	TrustBadges,
} from "@/landing";

export default async function Landing() {
	try {
		const { supabaseUser } = await getCurrentUser();
		if (supabaseUser) {
			redirect("/dashboard");
		}
	} catch (error) {
		console.error("Error checking authentication:", error);
	}

	return (
		<>
			<Hero />
			<TrustBadges />
			<StatsBar />
			<HowItWorks />
			<Features />
			<ShowcaseSection />
			<FAQ />
			<CTA />
			<Social />
		</>
	);
}
