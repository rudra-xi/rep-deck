"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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

			toast.dismiss(toastId);

			if (result?.error) {
				toast.error("Sign in failed", {
					description: result.error,
				});
				setLoading(false);
			}
		} catch (error) {
			if (error instanceof Error && error.message === "NEXT_REDIRECT") {
				toast.dismiss(toastId);
				return;
			}

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
			className={`w-full sm:w-auto font-medium gap-2 shadow-sm base-ease ${className}`}
		>
			{loading ? (
				<>
					<span>Signing in...</span>
					<Spinner />
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
