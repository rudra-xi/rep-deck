import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return <div className="main-padding">{children}</div>;
}
