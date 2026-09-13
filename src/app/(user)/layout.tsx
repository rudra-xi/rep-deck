// app/(user)/layout.tsx
import type { ReactNode } from "react";
import { getUserPreferences } from "@/actions/account";
import { UnitProvider, Navigation } from "@/common";

export default async function UserLayout({
	children,
}: {
	children: ReactNode;
}) {
	const preferences = await getUserPreferences();

	return (
		<UnitProvider preferences={preferences}>
			<Navigation />
			<main className="main-padding">{children}</main>
		</UnitProvider>
	);
}
