import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/actions/auth";
import { CTA, FAQ, Features, Hero, HowItWorks, Social } from "@/landing";

// Main landing page component
export default async function Landing() {
	try {
		const { supabaseUser } = await getCurrentUser();

		// If user is authenticated, ALWAYS redirect to dashboard
		if (supabaseUser) {
			console.log("🔒 User authenticated, redirecting to dashboard");
			redirect("/dashboard");
		}
	} catch (error) {
		console.error("Error checking authentication:", error);
		// Continue to show landing page if there's an error
	}

	// If not authenticated or error, show the landing page
	return (
		<>
			<Hero />
			<HowItWorks />
			<Features />
			<FAQ />
			<Social />
			<CTA />
		</>
	);
}
