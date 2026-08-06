"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	return (
		<form className={cn("flex flex-col gap-6", className)} {...props}>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Create your account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Fill in the form below to create your account
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="name">Full Name</FieldLabel>
					<Input
						id="name"
						type="text"
						placeholder="John Doe"
						required
						className="bg-background"
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						required
						className="bg-background"
					/>
					<FieldDescription>
						We&apos;ll use this to contact you. We will not share
						your email with anyone else.
					</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						type="password"
						required
						className="bg-background"
					/>
					<FieldDescription>
						Must be at least 8 characters long.
					</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="confirm-password">
						Confirm Password
					</FieldLabel>
					<Input
						id="confirm-password"
						type="password"
						required
						className="bg-background"
					/>
					<FieldDescription>
						Please confirm your password.
					</FieldDescription>
				</Field>
				<Field>
					<Button type="submit">Create Account</Button>
				</Field>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<Button variant="outline" type="button">
						<GoogleLogoIcon />
						Login with Google
					</Button>
					<FieldDescription className="px-6 text-center">
						Already have an account?{" "}
						<Link href="/login">Sign in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
