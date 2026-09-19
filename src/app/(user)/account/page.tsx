import { getUserPreferences, getUserProfile } from "@/actions/account";
import { AccountClientPage } from "./client-page";

export default async function AccountPage() {
	const [profile, preferences] = await Promise.all([
		getUserProfile(),
		getUserPreferences(),
	]);

	return (
		<AccountClientPage
			initialProfile={profile}
			initialPreferences={preferences}
		/>
	);
}
