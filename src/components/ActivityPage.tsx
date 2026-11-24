import {
	getAllMonthlyTopArtists,
	getMixes,
	type MonthlyMix,
	type MonthlyTopArtists,
} from "@marekvonrogall/favlib";
import { useEffect, useState } from "react";
import { ArtistList } from "./ArtistList";
import { Banner } from "./Banner";
import { Disclaimers } from "./Disclaimers";
import { Timeline } from "./Timeline";

export const ActivityPage = () => {
	const [months, setMonths] = useState<MonthlyTopArtists[] | null>(null);
	const [mixes, setMixes] = useState<MonthlyMix[]>([]);
	const [selected, setSelected] = useState(0);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const [{ months }, { monthly }] = await Promise.all([
					getAllMonthlyTopArtists(),
					getMixes(),
				]);
				setMonths(months.sort((a, b) => b.year - a.year || b.month - a.month));
				setMixes(monthly);
			} catch (err) {
				setError((err as Error).message);
			}
		};
		load();
	}, []);

	const month = months?.[selected] ?? null;
	const mix = mixes.find(
		(entry) => entry.year === month?.year && entry.month === month?.month,
	);

	return (
		<div className="my-activity">
			<h1
				className="my-activity-title wave-text-headline-bold"
				data-wave-color="textDefault"
			>
				My Activity
			</h1>
			{months && (
				<Timeline months={months} selected={selected} onSelect={setSelected} />
			)}
			{error && (
				<p className="my-activity-message">
					Couldn't load your activity: {error}
				</p>
			)}
			{!months && !error && <p className="my-activity-message">Loading…</p>}
			{month && (
				<>
					<Banner month={month} mixId={mix?.id ?? null} />
					<ArtistList artists={month.artists} />
					<Disclaimers disclaimers={month.disclaimers} />
				</>
			)}
		</div>
	);
};
