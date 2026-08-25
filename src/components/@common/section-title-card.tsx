"use client";

interface SectionTitleCardProps {
	title: string;
}
export const SectionTitleCard = ({ title }: SectionTitleCardProps) => {
	return (
		<div className="mb-4 ml-4">
			<div className="fcy gap-2">
				<div className="w-0.5 h-5 bg-primary"></div>
				<h2 className="text-2xl font-bold tracking-wide capitalize">
					{title}.
				</h2>
			</div>
		</div>
	);
};
