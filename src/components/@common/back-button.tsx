"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
	const router = useRouter();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => router.back()}
			className=" square size-10 border-foreground/20 hover:bg-muted"
			aria-label="Go back"
		>
			<ArrowLeftIcon className="size-5" />
		</Button>
	);
};
