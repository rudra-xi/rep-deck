"use client";

import { format } from "date-fns";
import {
	CheckIcon,
	UserIcon,
	EnvelopeSimpleIcon,
	CalendarBlankIcon,
	PencilSimpleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { UserAvatar } from "@/auth";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";
import { useProfileForm } from "@/hooks";

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
		<Card className="border border-secondary/50 bg-card/50 rounded-none shadow-none transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_rgba(var(--primary),0.1)]">
			<CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
					<div className="flex items-center justify-center border border-primary/30 bg-primary/10 p-1.5 text-primary rounded-md shrink-0">
						<UserIcon className="size-4" weight="bold" />
					</div>
					Profile
				</CardTitle>
			</CardHeader>

			<CardContent className="p-5 pt-0 space-y-5">
				<div className="flex items-center gap-4 p-3 border border-border/40 bg-background/50 rounded-none">
					<div className="relative shrink-0">
						<UserAvatar
							size="lg"
							className="size-14 border-2 border-primary/30"
						/>
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="text-sm font-bold text-foreground truncate">
							{profile.name || "Lifter"}
						</h3>
						<div className="flex items-center gap-1.5 mt-1">
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

				<form onSubmit={handleSaveName} className="space-y-4">
					<div className="space-y-1.5">
						<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
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
									"h-9 text-xs rounded-none border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200",
									hasNameChanged &&
										"border-primary/50 bg-primary/5",
								)}
							/>
							<Button
								type="submit"
								size="sm"
								disabled={isSaving || !hasNameChanged}
								className={cn(
									"h-9 px-4 text-xs font-semibold rounded-none shrink-0 transition-all duration-200",
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
						<div className="flex items-center justify-between">
							<Label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider flex items-center gap-1.5">
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
