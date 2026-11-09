// hooks/@common-hook/use-hide-on-scroll.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useHideOnScroll(threshold = 80, delta = 6) {
	const [hidden, setHidden] = useState(false);
	const lastY = useRef(0);

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY;

			if (y < threshold) {
				setHidden(false);
			} else if (y > lastY.current + delta) {
				setHidden(true);
			} else if (y < lastY.current - delta) {
				setHidden(false);
			}

			lastY.current = y;
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [threshold, delta]);

	return hidden;
}
