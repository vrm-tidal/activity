import {
	getAllMonthlyTopArtists,
	getMixes,
	type Mixes,
	type MonthlyTopArtists,
} from "@marekvonrogall/favlib";
import { useEffect, useState } from "react";
import { allTimePeriods, monthlyPeriods } from "../periods";
import { ArtistList } from "./ArtistList";
import { Banner } from "./Banner";
import { Disclaimers } from "./Disclaimers";
import { Timeline } from "./Timeline";

export const ActivityPage = () => {
	const [months, setMonths] = useState<MonthlyTopArtists[] | null>(null);
	const [mixes, setMixes] = useState<Mixes>({
		allTime: null,
		yearly: [],
		monthly: [],
	});
	const [allTime, setAllTime] = useState(false);
	const [selected, setSelected] = useState(0);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const [{ months }, mixes] = await Promise.all([
					getAllMonthlyTopArtists(),
					getMixes(),
				]);
				setMonths(months.sort((a, b) => b.year - a.year || b.month - a.month));
				setMixes(mixes);
			} catch (err) {
				setError((err as Error).message);
			}
		};
		load();
	}, []);

	const toggleAllTime = () => {
		setAllTime(!allTime);
		setSelected(0);
	};

	const periods = months
		? allTime
			? allTimePeriods(months, mixes)
			: monthlyPeriods(months, mixes)
		: null;
	const period = periods?.[selected] ?? null;

	return (
		<div className="my-activity">
			<div className="my-activity-header">
				<h1
					className="my-activity-title wave-text-headline-bold"
					data-wave-color="textDefault"
				>
					My Activity
				</h1>
				{months && (
					<button
						type="button"
						className="my-activity-mode"
						onClick={toggleAllTime}
					>
						{allTime ? "Monthly" : "All Time"}
					</button>
				)}
			</div>
			{periods && (
				<Timeline
					labels={periods.map(({ label }) => label)}
					selected={selected}
					onSelect={setSelected}
				/>
			)}
			{error && (
				<p className="my-activity-message">
					Couldn't load your activity: {error}
				</p>
			)}
			{!months && !error && <p className="my-activity-message">Loading…</p>}
			{period && (
				<>
					<Banner period={period} />
					<ArtistList artists={period.artists} />
					<Disclaimers disclaimers={period.disclaimers} />
				</>
			)}
		</div>
	);
};
