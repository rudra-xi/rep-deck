import { BackButton } from "@/common";
import { LoginForm } from "@/components/login-form";

export default function Login() {
	return (
		<main className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			{/* Top-Left Back Button Placement */}
			<div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
				<BackButton />
			</div>

			{/* Centered Login Form Container */}
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</main>
	);
}
