import { redux } from "@luna/lib";
import type { MonthlyTopArtists } from "@marekvonrogall/favlib";

const openMix = (id: string) => {
	redux.actions["router/PUSH"]({
		pathname: `/mix/${id}`,
		search: "",
		replace: false,
	});
};

const streamsOf = (streams: number) => {
	return `${streams.toLocaleString()} ${streams === 1 ? "stream" : "streams"}`;
};

const describe = (month: MonthlyTopArtists) => {
	if (month.summary.title) return month.summary;
	const [first, second] = month.artists;
	if (!first) return { title: null, subtitle: null };

	if (!second) {
		return {
			title: first.artist.name,
			subtitle: `🏆 ${first.artist.name} was your top streamed artist with ${streamsOf(first.streams)}.`,
		};
	}

	const names = `${first.artist.name} and ${second.artist.name}`;
	return {
		title: names,
		subtitle: `🏆 ${names} were your top streamed artists with ${streamsOf(first.streams)} and ${streamsOf(second.streams)}.`,
	};
};

export const Banner = ({
	month,
	mixId,
}: {
	month: MonthlyTopArtists;
	mixId: string | null;
}) => {
	const { daysLeft } = month.summary;
	const { title, subtitle } = describe(month);
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
				{title && <h2>{title}</h2>}
				{subtitle && <p>{subtitle}</p>}
				{daysLeft !== null && (
					<span className="my-activity-pill">
						{daysLeft} {daysLeft === 1 ? "day" : "days"} left
					</span>
				)}
				{daysLeft === null && month.totalStreams !== null && (
					<span className="my-activity-pill">
						{month.totalStreams.toLocaleString()} total streams
					</span>
				)}
			</div>
			{mixId && (
				<button
					type="button"
					className="my-activity-banner-mix"
					onClick={() => openMix(mixId)}
				>
					Open Mix
				</button>
			)}
		</section>
	);
};
