import { AccountClientPage } from "./client-page";
import { getUserProfile, getUserPreferences } from "@/actions/account";

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
