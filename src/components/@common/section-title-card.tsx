interface SectionTitleCardProps {
	title: string;
	noPeriod?: boolean;
}

const withDot = (s: string, skip: boolean) =>
	skip || /[.!?]$/.test(s) ? s : `${s}.`;

export const SectionTitleCard = ({
	title,
	noPeriod = false,
}: SectionTitleCardProps) => {
	return (
		<div className="fcy gap-2 mb-4 ml-4">
			<div className="w-0.5 h-5 bg-primary" aria-hidden="true" />
			<h2 className="text-2xl font-bold tracking-wide capitalize">
				{withDot(title, noPeriod)}
			</h2>
		</div>
	);
};
