"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { BackButton } from "@common";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	return (
		<form className={cn("flex flex-col gap-6", className)} {...props}>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">
						Login to your account
					</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter your email below to login to your account
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						required
					/>
				</Field>
				<Field>
					<div className="flex items-center">
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Link
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
					<Input id="password" type="password" required />
				</Field>
				<Field>
					<Button type="submit">Login</Button>
				</Field>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<Button variant="outline" type="button">
						<GoogleLogoIcon />
						Login with Google
					</Button>
					<FieldDescription className="text-center">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="underline underline-offset-4"
						>
							Sign up
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
