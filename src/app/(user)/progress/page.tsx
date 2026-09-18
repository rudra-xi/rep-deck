import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import ProgressClientPage from "./client-page";

export default async function Progress() {
	const { supabaseUser } = await getCurrentUser();
	if (!supabaseUser) redirect("/");

	return <ProgressClientPage />;
}
