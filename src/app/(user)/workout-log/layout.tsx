import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Workout Log",
};

export default function Layout({ children }: { children: ReactNode }) {
	return <section>{children}</section>;
}
