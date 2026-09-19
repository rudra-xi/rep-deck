"use client";

import {
	CalendarBlankIcon,
	CheckIcon,
	EnvelopeSimpleIcon,
	PencilSimpleIcon,
	UserIcon,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { UserAvatar } from "@/auth";
import { CardsHeader } from "@/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useProfileForm } from "@/hooks";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface ProfileSectionProps {
	profile: UserProfile;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
	const { name, setName, isSaving, hasNameChanged, handleSaveName } =
		useProfileForm(profile);

	const memberSince = profile.createdAt
		? format(new Date(profile.createdAt), "MMM yyyy")
		: "N/A";

	return (
		<Card
			size="sm"
			className="fcard-flat card-ease hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]"
		>
			<CardsHeader icon={UserIcon} title="Profile" />

			<CardContent className="p-5 pt-1 fcol5">
				<div className="fcy gap-4 p-3 border border-border/40 bg-background/50 rounded-none mb-4">
					<div className="relative sh0">
						<UserAvatar
							size="lg"
							className="size-14 border-2 border-primary/30"
						/>
					</div>
					<div className="min-w-0 fgrow">
						<h3 className="text-sm font-bold text-foreground ">
							{profile.name || "Lifter"}
						</h3>
						<div className="fcy gap-1.5 mt-1">
							<CalendarBlankIcon
								className="size-3 text-muted-foreground"
								weight="bold"
							/>
							<p className="text-[11px] text-muted-foreground">
								Member since {memberSince}
							</p>
						</div>
					</div>
				</div>

				<form onSubmit={handleSaveName} className="fcol4">
					<div className="space-y-1.5">
						<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider fcy gap-1.5">
							<PencilSimpleIcon
								className="size-3 text-primary"
								weight="bold"
							/>
							Display Name
						</Label>
						<div className="flex gap-2">
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								className={cn(
									"h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 base-ease",
									hasNameChanged &&
										"border-primary/50 bg-primary/5",
								)}
							/>
							<Button
								type="submit"
								size="sm"
								disabled={isSaving || !hasNameChanged}
								className={cn(
									"h-9 px-4 text-xs font-semibold rounded-none sh0 base-ease",
									!hasNameChanged &&
										"opacity-50 cursor-not-allowed",
								)}
							>
								{isSaving ? (
									<>
										<Spinner className="size-3.5 mr-1.5" />
										Saving...
									</>
								) : (
									<>
										<CheckIcon
											className="size-3.5 mr-1.5"
											weight="bold"
										/>
										Save
									</>
								)}
							</Button>
						</div>
						{hasNameChanged && (
							<p className="text-[10px] text-primary font-medium pt-0.5">
								● Unsaved changes
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<div className="fcb">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider fcy gap-1.5">
								<EnvelopeSimpleIcon
									className="size-3 text-primary"
									weight="bold"
								/>
								Email Address
							</Label>
							<Badge
								variant="outline"
								className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border-border/50 rounded-none"
							>
								Read only
							</Badge>
						</div>
						<Input
							value={profile.email}
							disabled
							className="h-9 text-xs rounded-none border-border/40 bg-muted/30 text-muted-foreground cursor-not-allowed"
						/>
						<p className="text-[10px] text-muted-foreground">
							Email cannot be changed. Contact support if needed.
						</p>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
