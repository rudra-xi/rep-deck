"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface SignOutButtonProps {
	className?: string;
	variant?: "default" | "icon";
}

export function SignOutButton({
	className = "",
	variant = "default",
}: SignOutButtonProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleSignOut = async () => {
		setLoading(true);

		const toastId = toast.loading("Signing Out...", {
			description: "Please wait while we sign you out.",
		});

		try {
			const result = await signOut();

			toast.dismiss(toastId);

			if (result?.success) {
				toast.success("Signed Out", {
					description: "You have been signed out successfully.",
				});

				setTimeout(() => {
					router.push("/");
				}, 1000);
			} else {
				toast.error("Sign Out Failed", {
					description:
						result?.message ||
						"An error occurred while signing out.",
				});
				setLoading(false);
			}
		} catch (error) {
			console.error("Sign out error:", error);
			toast.dismiss(toastId);
			toast.error("Sign Out Error", {
				description:
					error instanceof Error
						? error.message
						: "An unexpected error occurred.",
			});
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
				aria-label="Sign out"
				className={`fc shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ${className}`}
				title="Sign out"
			>
				{loading ? (
					<Spinner className="size-4" />
				) : (
					<SignOutIcon weight="bold" className="size-4 shrink-0" />
				)}
			</Button>
		);
	}

	return (
		<Button
			variant="destructive"
			onClick={handleSignOut}
			disabled={loading}
			className={`fcy justify-center font-medium gap-2 ${className}`}
		>
			{loading ? (
				<>
					<Spinner className="size-3.5" />
					<span>Signing out...</span>
				</>
			) : (
				<>
					<SignOutIcon className="size-3.5 shrink-0" weight="bold" />
					<span>Sign Out</span>
				</>
			)}
		</Button>
	);
}
