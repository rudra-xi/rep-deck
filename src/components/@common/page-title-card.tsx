interface PageTitleCardProps {
	title: string;
	subTitle: string;
	noPeriod?: boolean;
}

const withDot = (s: string, skip: boolean) =>
	skip || /[.!?]$/.test(s) ? s : `${s}.`;

export const PageTitleCard = ({
	title,
	subTitle,
	noPeriod = false,
}: PageTitleCardProps) => {
	return (
		<div className="fpage-head">
			<h1 className="text-4xl lg:text-5xl fupper font-black">
				{withDot(title, noPeriod)}
			</h1>
			<p className="text-sm tracking-wide fmuted">
				{withDot(subTitle, noPeriod)}
			</p>
		</div>
	);
};
