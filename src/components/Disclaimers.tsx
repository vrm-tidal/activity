import { redux } from "@luna/lib";
import type { Disclaimer } from "@marekvonrogall/favlib";

const openUrl = (url: string) => {
	redux.actions["router/OPEN_EXTERNAL_URL"]({ openInNewWindow: true, url });
};

export const Disclaimers = ({ disclaimers }: { disclaimers: Disclaimer[] }) => {
	return (
		<div className="my-activity-disclaimers">
			{disclaimers.map(({ text, url }) => (
				<p key={text}>
					{text}
					<button type="button" onClick={() => openUrl(url)}>
						Learn more
					</button>
				</p>
			))}
		</div>
	);
};
