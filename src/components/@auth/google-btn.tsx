"use client";

import { CircleNotchIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GoogleLoginButtonProps {
	text?: string;
	icon?: ReactNode;
	redirectTo?: string;
	className?: string;
}

export function GoogleBtn({
	text = "Continue with Google",
	icon = <GoogleLogoIcon className="h-5 w-5" />,
	redirectTo,
	className = "",
}: GoogleLoginButtonProps) {
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);

		const toastId = toast.loading("Signing in...", {
			description: "Redirecting to Google...",
		});

		try {
			const result = await signInWithGoogle(redirectTo);

			// Dismiss loading toast
			toast.dismiss(toastId);

			if (result?.error) {
				toast.error("Sign in failed", {
					description: result.error,
				});
				setLoading(false);
			}
		} catch (error) {
			// ✅ Check if it's a NEXT_REDIRECT error (this is expected, not an error)
			if (error instanceof Error && error.message === "NEXT_REDIRECT") {
				// This is expected - the user is being redirected
				// Don't show any error toast
				toast.dismiss(toastId);
				// Don't setLoading(false) because we're redirecting
				return;
			}

			// Only show error for actual errors
			console.error("Google sign in error:", error);
			toast.dismiss(toastId);
			toast.error("Sign in error", {
				description:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			});
			setLoading(false);
		}
	};
	return (
		<Button
			onClick={handleLogin}
			disabled={loading}
			variant="default"
			size="lg"
			className={`w-full sm:w-auto font-medium gap-2 shadow-sm transition-all ${className}`}
		>
			{loading ? (
				<>
					<span>Signing in...</span>
					<CircleNotchIcon className="h-5 w-5 animate-spin text-muted-foreground" />
				</>
			) : (
				<>
					<span>{text}</span>
					{icon}
				</>
			)}
		</Button>
	);
}
