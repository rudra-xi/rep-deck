import { BackButton } from "@/common";
import { SignupForm } from "@/components/signup-form";

export default function Page() {
	return (
		<main className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			{/* Top-Left Back Button Placement */}
			<div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
				<BackButton />
			</div>
			<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
				<div className="w-full max-w-sm">
					<SignupForm />
				</div>
			</div>
		</main>
	);
}
