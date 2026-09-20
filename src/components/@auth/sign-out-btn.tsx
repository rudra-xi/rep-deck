"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { useTransition } from "react";
import { toast } from "sonner";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
	className?: string;
	variant?: "default" | "icon";
}

export function SignOutButton({
	className = "",
	variant = "default",
}: SignOutButtonProps) {
	const [pending, startTransition] = useTransition();

	const handleSignOut = () => {
		const toastId = toast.loading("Signing out…");

		startTransition(async () => {
			try {
				await signOut();
				toast.dismiss(toastId);
				toast.error("Sign out failed", {
					description: "No redirect received.",
				});
			} catch (error) {
				toast.dismiss(toastId);
				toast.success("Signed out");
				console.log(error);
			}
		});
	};

	if (variant === "icon") {
		return (
			<Button
				variant="ghost"
				size="icon"
				onClick={handleSignOut}
				disabled={pending}
				aria-label="Sign out"
				title="Sign out"
				className={cn(
					"fc sh0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
					className,
				)}
			>
				{pending ? (
					<Spinner className="size-4" />
				) : (
					<SignOutIcon weight="bold" className="size-4 sh0" />
				)}
			</Button>
		);
	}

	return (
		<Button
			variant="outline"
			onClick={handleSignOut}
			disabled={pending}
			className={cn(
				"w-full h-10 justify-start gap-3 px-3",
				"text-sm font-medium text-muted-foreground",
				"hover:bg-destructive/10 hover:text-destructive",
				"transition-colors",
				className,
			)}
		>
			{pending ? (
				<>
					<Spinner className="size-3.5 sh0" />
					<span>Signing out…</span>
				</>
			) : (
				<>
					<SignOutIcon className="size-3.5 sh0" weight="bold" />
					<span>Sign out</span>
				</>
			)}
		</Button>
	);
}
