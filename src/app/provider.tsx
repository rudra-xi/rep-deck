"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer, Navigation } from "@/common";
import { Toaster } from "@/components/ui/sonner";

export default function LayoutProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const hideOnRoutes = "/";
	const show = !hideOnRoutes.includes(pathname);
	return (
		<>
			{show && <Navigation />}
			{children}
			<Toaster position="top-right" />
			{show && <Footer />}
		</>
	);
}
