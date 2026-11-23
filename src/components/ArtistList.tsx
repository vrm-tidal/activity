import { redux } from "@luna/lib";
import type { StreamedArtist } from "@marekvonrogall/favlib";

const openArtist = (id: string) => {
	redux.actions["router/PUSH"]({
		pathname: `/artist/${id}`,
		search: "",
		replace: false,
	});
};

export const ArtistList = ({ artists }: { artists: StreamedArtist[] }) => {
	if (artists.length === 0) {
		return <p className="my-activity-message">No streams this month yet.</p>;
	}
	return (
		<ol className="my-activity-artists">
			{artists.map(({ artist, streams }, index) => (
				<li key={artist.id}>
					<button
						type="button"
						className="my-activity-artist"
						onClick={() => openArtist(artist.id)}
					>
						<span className="my-activity-rank">{index + 1}</span>
						<span className="my-activity-picture">
							{artist.pictureUrl && <img src={artist.pictureUrl} alt="" />}
						</span>
						<span className="my-activity-name">{artist.name}</span>
						<span className="my-activity-streams">
							{streams.toLocaleString()} {streams === 1 ? "stream" : "streams"}
						</span>
					</button>
				</li>
			))}
		</ol>
	);
};
