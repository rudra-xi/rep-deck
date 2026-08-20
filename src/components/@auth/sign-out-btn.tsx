"use client";

import { CircleNotchIcon, SignOutIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
	className?: string;
	variant?: "default" | "icon";
}

export function SignOutButton({
	className = "",
	variant = "default",
}: SignOutButtonProps) {
	const [loading, setLoading] = useState(false);

	const handleSignOut = async () => {
		setLoading(true);
		try {
			await signOut();
		} catch (error) {
			console.error("Sign out error:", error);
			setLoading(false);
		}
	};

	if (variant === "icon") {
		return (
			<Button
				variant="ghost"
				size="icon"
				onClick={handleSignOut}
				disabled={loading}
				className={`text-muted-foreground hover:text-destructive hover:bg-destructive/20 transition-colors ${className}`}
				title="Sign out"
			>
				{loading ? (
					<CircleNotchIcon
						weight="bold"
						className="h-5 w-5 animate-spin"
					/>
				) : (
					<SignOutIcon weight="bold" className="h-5 w-5" />
				)}
			</Button>
		);
	}

	return (
		<Button
			variant="destructive"
			onClick={handleSignOut}
			disabled={loading}
			className={`font-medium gap-2 ${className}`}
		>
			{loading ? (
				<>
					<CircleNotchIcon className="h-4 w-4 animate-spin" />
					Signing out...
				</>
			) : (
				<>
					<SignOutIcon className="h-4 w-4" />
					Sign Out
				</>
			)}
		</Button>
	);
}
