import type { ReactNode } from "react";
import { getUserPreferences, getUserProfile } from "@/actions/account";
import { Navigation, UnitProvider } from "@/common";

export default async function UserLayout({
	children,
}: {
	children: ReactNode;
}) {
	const [preferences, profile] = await Promise.all([
		getUserPreferences(),
		getUserProfile(),
	]);

	return (
		<UnitProvider preferences={preferences}>
			<Navigation userName={profile.name} />
			<main className="main-padding">{children}</main>
		</UnitProvider>
	);
}
