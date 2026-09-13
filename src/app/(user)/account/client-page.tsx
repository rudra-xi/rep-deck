"use client";

import { PageTitleCard, SectionTitleCard } from "@/common";
import { Separator } from "@/components/ui/separator";
import {
	ProfileSection,
	PreferencesSection,
	ThemeSection,
	FeedbackSection,
	AboutSection,
} from "@/account";
import type { UserProfile, UserPreferences } from "@/types";

interface AccountClientPageProps {
	initialProfile: UserProfile;
	initialPreferences: UserPreferences;
}

export function AccountClientPage({
	initialProfile,
	initialPreferences,
}: AccountClientPageProps) {
	return (
		<section className="space-y-6 sm:space-y-8">
			{/* Page Header */}
			<PageTitleCard
				title="Account"
				subTitle="Manage your profile, login, and app preferences."
			/>

			{/* Section 1: Profile */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Profile" />
				<ProfileSection profile={initialProfile} />
			</div>

			<Separator />

			{/* Section 2: Preferences & Theme Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
				<div className="space-y-3 w-full">
					<SectionTitleCard title="Preferences" />
					<PreferencesSection
						initialPreferences={initialPreferences}
					/>
				</div>

				<div className="space-y-3 w-full">
					<SectionTitleCard title="Theme" />
					<ThemeSection />
				</div>
			</div>

			<Separator />

			{/* Section 3: Feedback & Support */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="Feedback" />
				<FeedbackSection />
			</div>

			<Separator />

			{/* Section 4: App Info */}
			<div className="space-y-3 w-full">
				<SectionTitleCard title="App" />
				<AboutSection />
			</div>
		</section>
	);
}
