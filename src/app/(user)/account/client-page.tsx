"use client";

import {
	AboutSection,
	FeedbackSection,
	PreferencesSection,
	ProfileSection,
	ThemeSection,
} from "@/account";
import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import type { UserPreferences, UserProfile } from "@/types";

interface AccountClientPageProps {
	initialProfile: UserProfile;
	initialPreferences: UserPreferences;
}

export function AccountClientPage({
	initialProfile,
	initialPreferences,
}: AccountClientPageProps) {
	return (
		<section className="lg:space-y-6 space-y-8">
			{/* Page Header */}
			<PageTitleCard
				title="Account"
				subTitle="Profile, units, theme, and support"
			/>

			{/* Section 1: Profile */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Profile" />
				<ProfileSection profile={initialProfile} />
			</div>

			<Separator />

			{/* Section 2: Preferences (Units + Theme) */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Preferences" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
					<PreferencesSection
						initialPreferences={initialPreferences}
					/>
					<ThemeSection />
				</div>
			</div>

			<Separator />

			{/* Section 3: Support (Feedback + App Info) */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Support" />
				<div className="space-y-6 w-full">
					<FeedbackSection />
					<AboutSection />
				</div>
			</div>
		</section>
	);
}
