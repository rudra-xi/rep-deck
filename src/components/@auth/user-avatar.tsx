"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface UserAvatarProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export function UserAvatar({ className = "", size = "md" }: UserAvatarProps) {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-12 h-12",
	};

	useEffect(() => {
		const fetchUser = async () => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
			setLoading(false);
		};

		fetchUser();
	}, []);

	if (loading) {
		return (
			<div
				className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse ${className}`}
			/>
		);
	}

	if (!user) {
		return null;
	}

	const avatarUrl = user.user_metadata?.avatar_url;
	const name = user.user_metadata?.full_name || user.email;

	return (
		<div
			className={`${sizeClasses[size]} rounded-full overflow-hidden bg-blue-100 flex items-center justify-center ${className}`}
		>
			{avatarUrl ? (
				<Image
					src={avatarUrl}
					alt={name || "User avatar"}
					width={40}
					height={40}
					className="w-full h-full object-cover"
				/>
			) : (
				<span className="text-blue-600 font-semibold text-sm">
					{name?.charAt(0).toUpperCase() || "U"}
				</span>
			)}
		</div>
	);
}
