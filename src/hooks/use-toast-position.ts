"use client";

import { useEffect, useState } from "react";

type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

interface UseToastPositionOptions {
	/** Media query that defines the "mobile" viewport. Defaults to Tailwind's `sm` breakpoint. */
	query?: string;
	/** Position to use on mobile (query matches). */
	mobilePosition?: ToastPosition;
	/** Position to use on desktop (query does not match). */
	desktopPosition?: ToastPosition;
}

/**
 * Returns a Sonner-compatible `position` value based on viewport width.
 *
 * SSR-safe: renders `desktopPosition` on the server, then corrects on mount.
 * Reactive: updates on resize and orientation change via `matchMedia`.
 */
export function useToastPosition({
	query = "(max-width: 640px)",
	mobilePosition = "bottom-center",
	desktopPosition = "top-right",
}: UseToastPositionOptions = {}): ToastPosition {
	const [position, setPosition] = useState<ToastPosition>(desktopPosition);

	useEffect(() => {
		const mq = window.matchMedia(query);
		const update = () =>
			setPosition(mq.matches ? mobilePosition : desktopPosition);

		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, [query, mobilePosition, desktopPosition]);

	return position;
}
