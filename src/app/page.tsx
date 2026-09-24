import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import {
	CTA,
	FAQ,
	Features,
	Hero,
	HowItWorks,
	ShowcaseSection,
	Social,
	StatsBar,
	// Testimonials,
	TrustBadges,
} from "@/landing";

export default async function Landing() {
	try {
		const { supabaseUser } = await getCurrentUser();
		if (supabaseUser) redirect("/dashboard");
	} catch (error) {
		if (isRedirectError(error)) throw error;
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
			{/*<Testimonials />*/}
			<FAQ />
			<CTA />
			<Social />
		</>
	);
}
