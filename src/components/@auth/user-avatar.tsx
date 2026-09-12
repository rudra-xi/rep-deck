"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	getDiceBearAvatarUrl,
	DEFAULT_THEME,
	type ThemeSlug,
} from "@/utils/dicebear/dicebear";
import { AvatarSkeleton } from "@/skeletons";

interface UserAvatarProps {
	className?: string;
	size?: "sm" | "default" | "lg";
}

export function UserAvatar({ className = "", size = "lg" }: UserAvatarProps) {
	const { theme } = useTheme();
	const [user, setUser] = useState<User | null>(null);
	const [avatarSeed, setAvatarSeed] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			const { supabaseUser, dbUser } = await getCurrentUser();
			setUser(supabaseUser);
			setAvatarSeed(dbUser?.avatarSeed ?? null);
			setLoading(false);
		};

		fetchUserData();
	}, []);

	if (loading) {
		return <AvatarSkeleton size={size} />;
	}

	if (!user) return null;

	const name =
		(user.user_metadata?.full_name as string | undefined) ||
		user.email ||
		"User";

	// next-themes returns undefined during SSR — fall back to default
	const activeTheme = (theme as ThemeSlug) || DEFAULT_THEME;

	const avatarUrl = getDiceBearAvatarUrl(
		avatarSeed || user.id || "default",
		activeTheme,
	);

	return (
		<Avatar
			size={size}
			className={`after:border-0 rounded-none ${className}`}
		>
			<AvatarImage
				src={avatarUrl}
				alt={name}
				className="object-cover rounded-none"
			/>
			<AvatarFallback className="rounded-none bg-primary/10 text-primary font-semibold">
				{name.charAt(0).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
