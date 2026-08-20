import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/actions/auth";
import { CTA, FAQ, Features, Hero, HowItWorks, Social } from "@/landing";

// Loading component
function LandingLoading() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
				<p className="mt-4 text-gray-600">Loading...</p>
			</div>
		</div>
	);
}

// Main landing page component
async function LandingContent() {
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

export default function Landing() {
	return (
		<Suspense fallback={<LandingLoading />}>
			<LandingContent />
		</Suspense>
	);
}
