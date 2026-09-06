"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
	text?: string;
}

export const BackButton = ({ text }: BackButtonProps) => {
	const router = useRouter();

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => router.back()}
			aria-label="Go back"
		>
			<ArrowLeftIcon />
			<span className="capitalize text-xs">{text}</span>
		</Button>
	);
};
