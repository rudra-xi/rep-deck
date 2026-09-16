"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/actions/account";
import type { UserProfile } from "@/types";

export function useProfileForm(profile: UserProfile) {
	const [name, setName] = useState(profile.name || "");
	const [isSaving, setIsSaving] = useState(false);

	const initialName = (profile.name || "").trim();
	const trimmedName = name.trim();
	const hasNameChanged = trimmedName !== initialName;

	const handleSaveName = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!trimmedName) return;

		setIsSaving(true);
		try {
			const res = await updateProfile({ name: trimmedName });
			if (res.success) {
				toast.success("Profile updated");
			} else {
				toast.error(res.error || "Failed to update profile");
			}
		} catch {
			toast.error("An unexpected error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	return {
		name,
		setName,
		isSaving,
		hasNameChanged,
		handleSaveName,
	};
}