"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client.
 * Useful for avoiding hydration mismatches with SSR-unknown values
 * (e.g. next-themes' `theme`).
 */
export function useMounted() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted;
}