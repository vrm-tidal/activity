import icon from "file://resources/icon.svg";
import type { LunaUnloads } from "@luna/core";
import { observe } from "@luna/lib";

const LABEL = "My Activity";
const DATA_TEST = "sidebar-my-activity";
// TIDAL's entries
const TIDAL_LINKS = `#sidebar-content > a[data-test]:not([data-test="${DATA_TEST}"]):not([data-luna-sidebar])`;

const selectedClassOf = (node: Element) => {
	return (
		[...node.classList].find((name) => name.startsWith("_selected_")) ?? null
	);
};

const build = (source: HTMLAnchorElement, href: string, onOpen: () => void) => {
	const link = source.cloneNode(true) as HTMLAnchorElement;
	link.setAttribute("data-test", DATA_TEST);
	link.href = href;
	link.draggable = false;
	link.title = LABEL;
	link.querySelector(":scope > span")?.replaceChildren(LABEL);

	const template = document.createElement("template");
	template.innerHTML = icon;
	const svg = link.querySelector(":scope > svg");
	const ours = template.content.firstElementChild as SVGSVGElement;
	ours.setAttribute("class", svg?.getAttribute("class") ?? "");
	svg?.replaceWith(ours);

	link.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		onOpen();
	});
	return link;
};

export const setupSidebarLink = (
	unloads: LunaUnloads,
	href: string,
	onOpen: () => void,
) => {
	let link: HTMLAnchorElement | null = null;
	let selectedClass: string | null = null;
	let active = false;

	const update = () => {
		const links = [
			...document.querySelectorAll<HTMLAnchorElement>(TIDAL_LINKS),
		];
		const last = links.at(-1);
		if (!last) return;
		selectedClass ??=
			links.map(selectedClassOf).find((name) => name !== null) ?? null;

		const fresh = build(
			links.find((node) => !selectedClassOf(node)) ?? last,
			href,
			onOpen,
		);
		if (selectedClass) fresh.classList.toggle(selectedClass, active);

		if (link?.isEqualNode(fresh) && link.previousElementSibling === last)
			return;

		link?.remove();
		link = fresh;
		last.after(link);
	};

	const observer = new MutationObserver(update);
	observe(unloads, "#sidebar-content", (sidebar) => {
		observer.disconnect();
		observer.observe(sidebar, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["class"],
		});
		update();
	});

	unloads.add(() => {
		observer.disconnect();
		link?.remove();
	});

	return (value: boolean) => {
		active = value;
		update();
	};
};
