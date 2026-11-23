import type { MonthlyTopArtists } from "@marekvonrogall/favlib";

export const Banner = ({ month }: { month: MonthlyTopArtists }) => {
	const { summary } = month;
	const image = month.banners.landscape ?? month.banners.default;
	return (
		<section
			className="my-activity-banner"
			style={image ? { backgroundImage: `url("${image}")` } : undefined}
		>
			<div className="my-activity-banner-text">
				{month.title && (
					<span className="my-activity-banner-month">{month.title}</span>
				)}
				{summary.title && <h2>{summary.title}</h2>}
				{summary.subtitle && <p>{summary.subtitle}</p>}
				{summary.daysLeft !== null && (
					<span className="my-activity-days-left">
						{summary.daysLeft} {summary.daysLeft === 1 ? "day" : "days"} left
					</span>
				)}
			</div>
		</section>
	);
};
