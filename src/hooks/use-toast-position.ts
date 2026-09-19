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
	query?: string;
	mobilePosition?: ToastPosition;
	desktopPosition?: ToastPosition;
}

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
