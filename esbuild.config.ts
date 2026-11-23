import { mkdir, readFile, writeFile } from "node:fs/promises";

import { listen, pluginBuildOptions } from "luna/build";

const config = await pluginBuildOptions(".", { tsconfig: "./tsconfig.json" });
listen([config]);

const { name, description, author, homepage } = JSON.parse(
	await readFile("./package.json", "utf8"),
);
const plugin = config.outfile?.replace("./dist/", "");
await mkdir("./dist", { recursive: true });
await writeFile(
	"./dist/store.json",
	JSON.stringify({ name, description, author, homepage, plugins: [plugin] }),
);
