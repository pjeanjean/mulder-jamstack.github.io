import { ScullyConfig, setPluginConfig } from "@scullyio/scully";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-visual-basic.js";
import "prismjs/components/prism-yaml.js";

import { getTocPlugin, TocConfig } from "./scully/plugins/toc";

setPluginConfig("md", { enableSyntaxHighlighting: true });

const tocOptions: TocConfig = {
    blogAreaSelector: "#blog-content", // where to search for TOC headings
    insertSelector: "#toc", // where to insert the TOC
    level: ["h1", "h2", "h3", "h4"], // what heading levels to include
    trailingSlash: true, // add trailing slash before the anker ('#')
    scrollIntoViewOnClick: true, // add event to each link that scrolls into view on click:
    // onclick="document.getElementById('target-id').scrollIntoView()"
};
const TocPlugin = getTocPlugin();
setPluginConfig(TocPlugin, tocOptions);

export const config: ScullyConfig = {
    projectRoot: "./src",
    projectName: "mulder",
    outDir: "./dist/static",
    routes: {
        // tslint:disable-next-line:prettier
        '/s/:slug': {
            type: "contentFolder",
            postRenderers: ["toc"],
            slug: {
                folder: "./content/static",
            },
        },
        "/blog/:slug": {
            type: "contentFolder",
            postRenderers: ["toc"],
            slug: {
                folder: "./content/blog",
            },
        },
    },
};
