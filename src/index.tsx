import styles from "file://styles.css?minify";
import { redux, StyleTag } from "@luna/lib";
import { Page } from "@luna/ui";
import { ActivityPage } from "./components/ActivityPage";
import { PAGE, unloads } from "./plugin";
import { setupSidebarLink } from "./sidebar";

export { unloads } from "./plugin";

new StyleTag("Activity", unloads, styles);

const page = Page.register(PAGE, unloads, <ActivityPage />);
page.pageStyles.display = "flex";
page.pageStyles.flexDirection = "column";
page.root.style.order = "-1";

const isOpen = (search: string) => {
	return search === `?${PAGE}`;
};

const setLinkActive = setupSidebarLink(unloads, `/not-found?${PAGE}`, () =>
	page.open(),
);
setLinkActive(isOpen(location.search));
redux.intercept("router/NAVIGATED", unloads, ({ search }) => {
	setLinkActive(isOpen(search));
});
