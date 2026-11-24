import {
	type Disclaimer,
	type Mix,
	type Mixes,
	type MonthlyTopArtists,
	type StreamedArtist,
	sumMonthlyTopArtists,
} from "@marekvonrogall/favlib";

export interface Period {
	label: string;
	current: boolean;
	title: string | null;
	subtitle: string | null;
	artists: StreamedArtist[];
	totalStreams: number | null;
	daysLeft: number | null;
	image: string | null;
	blur: boolean;
	mixId: string | null;
	disclaimers: Disclaimer[];
}

const hasPlaceholderBanner = (month: MonthlyTopArtists) => {
	return !month.summary.artists.some(({ id }) => {
		return month.artists.find(({ artist }) => artist.id === id)?.artist
			.pictureId;
	});
};

export const monthlyPeriods = (
	months: MonthlyTopArtists[],
	mixes: Mixes,
): Period[] => {
	return months.map((month) => {
		const banner = month.banners.landscape ?? month.banners.default;
		const placeholder = !banner || hasPlaceholderBanner(month);
		const mix = mixes.monthly.find(
			(entry) => entry.year === month.year && entry.month === month.month,
		);
		return {
			label: month.title ?? "",
			current: month.summary.daysLeft !== null,
			title: month.summary.title,
			subtitle: month.summary.subtitle,
			artists: month.artists,
			totalStreams: month.totalStreams,
			daysLeft: month.summary.daysLeft,
			image: placeholder
				? (month.artists[0]?.artist.pictureUrl ?? null)
				: banner,
			blur: placeholder,
			mixId: mix?.id ?? null,
			disclaimers: month.disclaimers,
		};
	});
};

const totalStreamsOf = (months: MonthlyTopArtists[]) => {
	return months.reduce((total, month) => {
		return (
			total +
			(month.totalStreams ??
				month.artists.reduce((sum, { streams }) => sum + streams, 0))
		);
	}, 0);
};

const summed = (
	label: string,
	current: boolean,
	months: MonthlyTopArtists[],
	mix: Mix | null,
	disclaimers: Disclaimer[],
): Period => {
	const artists = sumMonthlyTopArtists(months);
	return {
		label,
		current,
		title: null,
		subtitle: null,
		artists,
		totalStreams: totalStreamsOf(months),
		daysLeft: null,
		image: mix?.images.large?.url ?? artists[0]?.artist.pictureUrl ?? null,
		blur: true,
		mixId: mix?.id ?? null,
		disclaimers,
	};
};

export const allTimePeriods = (
	months: MonthlyTopArtists[],
	mixes: Mixes,
): Period[] => {
	const disclaimers = months[0]?.disclaimers ?? [];
	const years = [...new Set(months.map((month) => month.year))];
	return [
		summed("All Time", true, months, mixes.allTime, disclaimers),
		...years.map((year) => {
			return summed(
				String(year),
				year === new Date().getFullYear(),
				months.filter((month) => month.year === year),
				mixes.yearly.find((mix) => mix.year === year) ?? null,
				disclaimers,
			);
		}),
	];
};
