"use client";

import { CircleNotchIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";

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
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await signInWithGoogle(redirectTo);
		} catch (error) {
			console.error("Google sign in error:", error);
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleLogin}
			disabled={isLoading}
			variant="default"
			size="lg"
			className={`w-full sm:w-auto font-medium gap-2 shadow-sm transition-all ${className}`}
		>
			{isLoading ? (
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
