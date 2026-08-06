"use client";

import { Footer, Navigation } from "@/common";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
