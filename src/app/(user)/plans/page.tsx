import { getUserPlans } from "@/actions/plans";
import PlansClientView from "./client-page";

export default async function PlansPage() {
	const plans = await getUserPlans();

	return <PlansClientView initialPlans={plans} />;
}
