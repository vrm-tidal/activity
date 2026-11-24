import { redux } from "@luna/lib";
import type { Period } from "../periods";

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

const describe = (period: Period) => {
	if (period.title) return period;
	const [first, second] = period.artists;
	if (!first) return { title: null, subtitle: null };

	if (!second) {
		return {
			title: first.artist.name,
			subtitle: `🏆 ${first.artist.name} ${period.current ? "is" : "was"} your top streamed artist with ${streamsOf(first.streams)}.`,
		};
	}

	const names = `${first.artist.name} and ${second.artist.name}`;
	return {
		title: names,
		subtitle: `🏆 ${names} ${period.current ? "are" : "were"} your top streamed artists with ${streamsOf(first.streams)} and ${streamsOf(second.streams)}.`,
	};
};

export const Banner = ({ period }: { period: Period }) => {
	const { label, daysLeft, totalStreams, image, blur, mixId } = period;
	const { title, subtitle } = describe(period);
	return (
		<section
			className={
				blur
					? "my-activity-banner my-activity-banner-blur"
					: "my-activity-banner"
			}
			style={image ? { backgroundImage: `url("${image}")` } : undefined}
		>
			<div className="my-activity-banner-text">
				{label && <span className="my-activity-banner-month">{label}</span>}
				{title && <h2>{title}</h2>}
				{subtitle && <p>{subtitle}</p>}
				{daysLeft !== null && (
					<span className="my-activity-pill">
						{daysLeft} {daysLeft === 1 ? "day" : "days"} left
					</span>
				)}
				{daysLeft === null && totalStreams !== null && (
					<span className="my-activity-pill">
						{totalStreams.toLocaleString()} total streams
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
