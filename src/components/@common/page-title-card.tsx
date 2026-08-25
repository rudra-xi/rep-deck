"use client";

interface PageTitleCardProps {
	title: string;
	subTitle: string;
}

export const PageTitleCard = ({ title, subTitle }: PageTitleCardProps) => {
	return (
		<div className="mb-10">
			<h1 className="text-4xl lg:text-5xl uppercase font-black tracking-wider">
				{title}.
			</h1>

			<p className="text-sm tracking-wide text-muted-foreground">
				{subTitle}.
			</p>
		</div>
	);
};
