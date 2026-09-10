import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Metrics",
};

export default function Layout({ children }: { children: ReactNode }) {
	return <section>{children}</section>;
}
