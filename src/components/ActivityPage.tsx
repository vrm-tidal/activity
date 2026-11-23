import {
	getMonthlyTopArtists,
	type MonthlyTopArtists,
} from "@marekvonrogall/favlib";
import { useEffect, useState } from "react";
import { ArtistList } from "./ArtistList";
import { Banner } from "./Banner";
import { Disclaimers } from "./Disclaimers";

export const ActivityPage = () => {
	const [month, setMonth] = useState<MonthlyTopArtists | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const now = new Date();
				setMonth(
					await getMonthlyTopArtists(now.getFullYear(), now.getMonth() + 1),
				);
			} catch (err) {
				setError((err as Error).message);
			}
		};
		load();
	}, []);

	return (
		<div className="my-activity">
			<h1
				className="my-activity-title wave-text-headline-bold"
				data-wave-color="textDefault"
			>
				My Activity
			</h1>
			{error && (
				<p className="my-activity-message">
					Couldn't load your activity: {error}
				</p>
			)}
			{!month && !error && <p className="my-activity-message">Loading…</p>}
			{month && (
				<>
					<Banner month={month} />
					<ArtistList artists={month.artists} />
					<Disclaimers disclaimers={month.disclaimers} />
				</>
			)}
		</div>
	);
};
