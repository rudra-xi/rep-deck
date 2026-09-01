"use client";

import { CircleNotchIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface SignOutButtonProps {
	className?: string;
	variant?: "default" | "icon";
	position?:
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
}

export function SignOutButton({
	className = "",
	variant = "default",
	position = "top-right", // Default position
}: SignOutButtonProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleSignOut = async () => {
		setLoading(true);

		const toastId = toast.loading("Signing Out...", {
			description: "Please wait while we sign you out.",
			position, // ✅ Use the position prop
		});

		try {
			const result = await signOut();

			toast.dismiss(toastId);

			if (result?.success) {
				toast.success("Signed Out", {
					description: "You have been signed out successfully.",
					position, // ✅ Use the position prop
				});

				// Redirect after a short delay to show the toast
				setTimeout(() => {
					router.push("/");
				}, 1000);
			} else {
				toast.error("Sign Out Failed", {
					description:
						result?.message ||
						"An error occurred while signing out.",
					position, // ✅ Use the position prop
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
				position, // ✅ Use the position prop
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
				className={`text-muted-foreground hover:text-destructive hover:bg-destructive/20 transition-colors ${className}`}
				title="Sign out"
			>
				{loading ? (
					<Spinner />
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
					<Spinner />
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
