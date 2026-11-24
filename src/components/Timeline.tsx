import { useEffect, useRef, useState } from "react";

const scrollSideways = (event: WheelEvent) => {
	const strip = event.currentTarget as HTMLElement;
	if (event.deltaX !== 0 || strip.scrollWidth <= strip.clientWidth) return;
	event.preventDefault();
	strip.scrollLeft += event.deltaY;
};

const edgesOf = (node: HTMLElement) => {
	const max = node.scrollWidth - node.clientWidth;
	return { start: node.scrollLeft <= 1, end: node.scrollLeft >= max - 1 };
};

const Arrow = ({
	direction,
	disabled,
	onClick,
}: {
	direction: -1 | 1;
	disabled: boolean;
	onClick: () => void;
}) => {
	return (
		<button
			type="button"
			className={
				direction < 0
					? "my-activity-arrow my-activity-arrow-back"
					: "my-activity-arrow"
			}
			disabled={disabled}
			onClick={onClick}
		/>
	);
};

export const Timeline = ({
	labels,
	selected,
	onSelect,
}: {
	labels: string[];
	selected: number;
	onSelect: (index: number) => void;
}) => {
	const strip = useRef<HTMLElement>(null);
	const [edges, setEdges] = useState({ start: true, end: true });

	useEffect(() => {
		const node = strip.current;
		if (!node) return;
		const resized = new ResizeObserver(() => setEdges(edgesOf(node)));
		resized.observe(node);
		node.addEventListener("wheel", scrollSideways, { passive: false });

		return () => {
			resized.disconnect();
			node.removeEventListener("wheel", scrollSideways);
		};
	}, []);

	const scrollPage = (direction: -1 | 1) => {
		const node = strip.current;
		node?.scrollBy({
			left: direction * node.clientWidth * 0.8,
			behavior: "smooth",
		});
	};

	const overflowing = !(edges.start && edges.end);
	const stripClass = [
		"my-activity-months",
		!edges.start && "my-activity-months-fade-start",
		!edges.end && "my-activity-months-fade-end",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className="my-activity-timeline">
			{overflowing && (
				<Arrow
					direction={-1}
					disabled={edges.start}
					onClick={() => scrollPage(-1)}
				/>
			)}
			<nav
				ref={strip}
				className={stripClass}
				onScroll={(event) => setEdges(edgesOf(event.currentTarget))}
			>
				{labels.map((label, index) => (
					<button
						key={label}
						type="button"
						className={
							index === selected
								? "my-activity-month my-activity-month-selected"
								: "my-activity-month"
						}
						onClick={() => onSelect(index)}
					>
						{label}
					</button>
				))}
			</nav>
			{overflowing && (
				<Arrow
					direction={1}
					disabled={edges.end}
					onClick={() => scrollPage(1)}
				/>
			)}
		</div>
	);
};
