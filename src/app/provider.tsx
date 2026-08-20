"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer, Navigation } from "@/common";

export default function LayoutProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const hideOnRoutes = ["/", "/login", "/signup"];
	const show = !hideOnRoutes.includes(pathname);
	return (
		<>
			{show && <Navigation />}
			{children}
			{show && <Footer />}
		</>
	);
}
