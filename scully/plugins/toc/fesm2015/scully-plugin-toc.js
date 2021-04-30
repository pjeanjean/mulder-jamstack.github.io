import { getPluginConfig, logWarn, log, yellow, registerPlugin } from '@scullyio/scully';
import { JSDOM } from 'jsdom';

const TocPluginName = 'toc';

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const headingLevel = (tag) => {
    const match = tag.match(/(?!h)[123456]/g);
    return match && match.length ? Number(match[0]) : null;
};
const tocPlugin = (html, routeData) => __awaiter(void 0, void 0, void 0, function* () {
    const tocConfig = getPluginConfig(TocPluginName);
    const route = routeData.route;
    try {
        const dom = new JSDOM(html);
        const { window } = dom;
        /**
         * define insert point
         */
        let tocInsertPointSelector = '#toc';
        if (!tocConfig.insertSelector) {
            logWarn(`No "insertSelector" for "toc" provided, using default: "#id".`);
        }
        else {
            tocInsertPointSelector = tocConfig.insertSelector;
        }
        /**
         * search for insert point
         */
        const insertPoint = window.document.querySelector(tocInsertPointSelector);
        // in case <div id="toc"></div> is not on the site
        if (!insertPoint) {
            log(`Insert point with selector ${tocInsertPointSelector} not found. Skipping toc generation for route ${route}.`);
            return html;
        }
        /**
         * get headings for toc generation
         */
        let levels = ['h2', 'h3'];
        if (!tocConfig.level) {
            logWarn(`Option "level" for "toc" not set, using default: "['h2', 'h3']".`);
        }
        else {
            levels = tocConfig.level;
        }
        const possibleValues = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        let selector = '';
        levels.forEach((level) => {
            const lowerCased = level.toLowerCase();
            if (possibleValues.indexOf(lowerCased) === -1) {
                logWarn(`Level "${level}" is not valid. It should be one of ${JSON.stringify(possibleValues)}.`);
            }
            else {
                selector += tocConfig.blogAreaSelector
                    ? `${tocConfig.blogAreaSelector} ${lowerCased},`
                    : `${lowerCased},`;
            }
        });
        // remove leading and trailing comma
        selector = selector.replace(/(^,)|(,$)/g, '');
        const headers = window.document.querySelectorAll(selector);
        /**
         * build nested ul, li list
         */
        let previousTag;
        let toc = '';
        headers.forEach((c) => {
            const level = headingLevel(c.tagName);
            const trailingSlash = tocConfig.trailingSlash ? '/' : '';
            const onClickScrollIntoViewString = tocConfig.scrollIntoViewOnClick
                ? ` onclick="document.getElementById('${c.id}').scrollIntoView();"`
                : '';
            const baseLiEl = `<li${onClickScrollIntoViewString}><a href="${route}${trailingSlash}#${c.id}">${c.textContent}</a></li>`;
            if (previousTag && level && level > previousTag) {
                toc += '<ul style="margin-bottom: 0px">';
            }
            if (previousTag && level && level < previousTag) {
                toc += '</ul>';
            }
            toc += baseLiEl;
            previousTag = level;
        });
        /**
         * append toc as child
         */
        const list = window.document.createElement('ul');
        list.innerHTML = toc;
        insertPoint.appendChild(list);
        /**
         * return new serialized HTML
         */
        return dom.serialize();
    }
    catch (e) {
        logWarn(`error in tocPlugin, didn't parse for route '${yellow(route)}'`);
    }
    // in case of failure return unchanged HTML to keep flow going
    return Promise.resolve(html);
});

var __awaiter$1 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const validator = ( /* conf */) => __awaiter$1(void 0, void 0, void 0, function* () {
    const tocConfig = getPluginConfig(TocPluginName);
    const errors = [];
    if (!tocConfig.insertSelector.length) {
        errors.push('Option "insertSelector" for "toc" must be a valid string (e.g. "#toc").');
    }
    if (!tocConfig.blogAreaSelector.length) {
        errors.push('Option "blogAreaSelector" for "toc" must be a valid string (e.g. ".blog-content").');
    }
    if (tocConfig.level && !tocConfig.level.length) {
        errors.push(`Option "level" for "toc" must be an array containing headings to list (e.g.: "['h2', 'h3']".`);
    }
    return errors;
});

/**
 * register the plugin
 */
registerPlugin('render', TocPluginName, tocPlugin, validator);
const getTocPlugin = () => TocPluginName;

/*
 * Public API Surface of scully-plugin-toc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { TocPluginName, getTocPlugin };
//# sourceMappingURL=scully-plugin-toc.js.map
