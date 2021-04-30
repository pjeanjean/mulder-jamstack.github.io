var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPluginConfig, log, logWarn, yellow, } from '@scullyio/scully';
import { JSDOM } from 'jsdom';
import { TocPluginName } from './constants';
export const headingLevel = (tag) => {
    const match = tag.match(/(?!h)[123456]/g);
    return match && match.length ? Number(match[0]) : null;
};
export const tocPlugin = (html, routeData) => __awaiter(void 0, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9jLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9kYW5ueWtvcHBlbmhhZ2VuL2Rldi9zY3VsbHktcGx1Z2luLXRvYy9wcm9qZWN0cy9zY3VsbHktcGx1Z2luLXRvYy9zcmMvIiwic291cmNlcyI6WyJsaWIvdG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sRUFDTCxlQUFlLEVBRWYsR0FBRyxFQUNILE9BQU8sRUFDUCxNQUFNLEdBQ1AsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQzlCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFHNUMsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBVyxFQUFpQixFQUFFO0lBQ3pELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMxQyxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN6RCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsQ0FBTyxJQUFZLEVBQUUsU0FBdUIsRUFBRSxFQUFFO0lBQ3ZFLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBWSxhQUFhLENBQUMsQ0FBQztJQUU1RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQzlCLElBQUk7UUFDRixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBRXZCOztXQUVHO1FBQ0gsSUFBSSxzQkFBc0IsR0FBRyxNQUFNLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7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LENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFFSDs7V0FFRztRQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUI7O1dBRUc7UUFDSCxPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUN4QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLCtDQUErQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFFO0lBQ0QsOERBQThEO0lBQzlELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGdldFBsdWdpbkNvbmZpZyxcbiAgSGFuZGxlZFJvdXRlLFxuICBsb2csXG4gIGxvZ1dhcm4sXG4gIHllbGxvdyxcbn0gZnJvbSAnQHNjdWxseWlvL3NjdWxseSc7XG5pbXBvcnQgeyBKU0RPTSB9IGZyb20gJ2pzZG9tJztcbmltcG9ydCB7IFRvY1BsdWdpbk5hbWUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBMZXZlbCwgVG9jQ29uZmlnIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNvbnN0IGhlYWRpbmdMZXZlbCA9ICh0YWc6IHN0cmluZyk6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBtYXRjaCA9IHRhZy5tYXRjaCgvKD8haClbMTIzNDU2XS9nKTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA/IE51bWJlcihtYXRjaFswXSkgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IHRvY1BsdWdpbiA9IGFzeW5jIChodG1sOiBzdHJpbmcsIHJvdXRlRGF0YTogSGFuZGxlZFJvdXRlKSA9PiB7XG4gIGNvbnN0IHRvY0NvbmZpZyA9IGdldFBsdWdpbkNvbmZpZzxUb2NDb25maWc+KFRvY1BsdWdpbk5hbWUpO1xuXG4gIGNvbnN0IHJvdXRlID0gcm91dGVEYXRhLnJvdXRlO1xuICB0cnkge1xuICAgIGNvbnN0IGRvbSA9IG5ldyBKU0RPTShodG1sKTtcbiAgICBjb25zdCB7IHdpbmRvdyB9ID0gZG9tO1xuXG4gICAgLyoqXG4gICAgICogZGVmaW5lIGluc2VydCBwb2ludFxuICAgICAqL1xuICAgIGxldCB0b2NJbnNlcnRQb2ludFNlbGVjdG9yID0gJyN0b2MnO1xuICAgIGlmICghdG9jQ29uZmlnLmluc2VydFNlbGVjdG9yKSB7XG4gICAgICBsb2dXYXJuKGBObyBcImluc2VydFNlbGVjdG9yXCIgZm9yIFwidG9jXCIgcHJvdmlkZWQsIHVzaW5nIGRlZmF1bHQ6IFwiI2lkXCIuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvY0luc2VydFBvaW50U2VsZWN0b3IgPSB0b2NDb25maWcuaW5zZXJ0U2VsZWN0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2VhcmNoIGZvciBpbnNlcnQgcG9pbnRcbiAgICAgKi9cbiAgICBjb25zdCBpbnNlcnRQb2ludCA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRvY0luc2VydFBvaW50U2VsZWN0b3IpO1xuICAgIC8vIGluIGNhc2UgPGRpdiBpZD1cInRvY1wiPjwvZGl2PiBpcyBub3Qgb24gdGhlIHNpdGVcbiAgICBpZiAoIWluc2VydFBvaW50KSB7XG4gICAgICBsb2coXG4gICAgICAgIGBJbnNlcnQgcG9pbnQgd2l0aCBzZWxlY3RvciAke3RvY0luc2VydFBvaW50U2VsZWN0b3J9IG5vdCBmb3VuZC4gU2tpcHBpbmcgdG9jIGdlbmVyYXRpb24gZm9yIHJvdXRlICR7cm91dGV9LmAsXG4gICAgICApO1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IGhlYWRpbmdzIGZvciB0b2MgZ2VuZXJhdGlvblxuICAgICAqL1xuICAgIGxldCBsZXZlbHM6IExldmVsW10gPSBbJ2gyJywgJ2gzJ107XG4gICAgaWYgKCF0b2NDb25maWcubGV2ZWwpIHtcbiAgICAgIGxvZ1dhcm4oXG4gICAgICAgIGBPcHRpb24gXCJsZXZlbFwiIGZvciBcInRvY1wiIG5vdCBzZXQsIHVzaW5nIGRlZmF1bHQ6IFwiWydoMicsICdoMyddXCIuYCxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldmVscyA9IHRvY0NvbmZpZy5sZXZlbDtcbiAgICB9XG4gICAgY29uc3QgcG9zc2libGVWYWx1ZXMgPSBbJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J107XG4gICAgbGV0IHNlbGVjdG9yID0gJyc7XG4gICAgbGV2ZWxzLmZvckVhY2goKGxldmVsKSA9PiB7XG4gICAgICBjb25zdCBsb3dlckNhc2VkID0gbGV2ZWwudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChwb3NzaWJsZVZhbHVlcy5pbmRleE9mKGxvd2VyQ2FzZWQpID09PSAtMSkge1xuICAgICAgICBsb2dXYXJuKFxuICAgICAgICAgIGBMZXZlbCBcIiR7bGV2ZWx9XCIgaXMgbm90IHZhbGlkLiBJdCBzaG91bGQgYmUgb25lIG9mICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICBwb3NzaWJsZVZhbHVlcyxcbiAgICAgICAgICApfS5gLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZWN0b3IgKz0gdG9jQ29uZmlnLmJsb2dBcmVhU2VsZWN0b3JcbiAgICAgICAgICA/IGAke3RvY0NvbmZpZy5ibG9nQXJlYVNlbGVjdG9yfSAke2xvd2VyQ2FzZWR9LGBcbiAgICAgICAgICA6IGAke2xvd2VyQ2FzZWR9LGA7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gcmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIGNvbW1hXG4gICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8oXiwpfCgsJCkvZywgJycpO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAvKipcbiAgICAgKiBidWlsZCBuZXN0ZWQgdWwsIGxpIGxpc3RcbiAgICAgKi9cbiAgICBsZXQgcHJldmlvdXNUYWc6IG51bWJlciB8IG51bGw7XG4gICAgbGV0IHRvYyA9ICcnO1xuICAgIGhlYWRlcnMuZm9yRWFjaCgoYzogYW55KSA9PiB7XG4gICAgICBjb25zdCBsZXZlbCA9IGhlYWRpbmdMZXZlbChjLnRhZ05hbWUpO1xuICAgICAgY29uc3QgdHJhaWxpbmdTbGFzaCA9IHRvY0NvbmZpZy50cmFpbGluZ1NsYXNoID8gJy8nIDogJyc7XG4gICAgICBjb25zdCBvbkNsaWNrU2Nyb2xsSW50b1ZpZXdTdHJpbmcgPSB0b2NDb25maWcuc2Nyb2xsSW50b1ZpZXdPbkNsaWNrXG4gICAgICAgID8gYCBvbmNsaWNrPVwiZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyR7Yy5pZH0nKS5zY3JvbGxJbnRvVmlldygpO1wiYFxuICAgICAgICA6ICcnO1xuICAgICAgY29uc3QgYmFzZUxpRWwgPSBgPGxpJHtvbkNsaWNrU2Nyb2xsSW50b1ZpZXdTdHJpbmd9PjxhIGhyZWY9XCIke3JvdXRlfSR7dHJhaWxpbmdTbGFzaH0jJHtjLmlkfVwiPiR7Yy50ZXh0Q29udGVudH08L2E+PC9saT5gO1xuICAgICAgaWYgKHByZXZpb3VzVGFnICYmIGxldmVsICYmIGxldmVsID4gcHJldmlvdXNUYWcpIHtcbiAgICAgICAgdG9jICs9ICc8dWwgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAwcHhcIj4nO1xuICAgICAgfVxuICAgICAgaWYgKHByZXZpb3VzVGFnICYmIGxldmVsICYmIGxldmVsIDwgcHJldmlvdXNUYWcpIHtcbiAgICAgICAgdG9jICs9ICc8L3VsPic7XG4gICAgICB9XG4gICAgICB0b2MgKz0gYmFzZUxpRWw7XG4gICAgICBwcmV2aW91c1RhZyA9IGxldmVsO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogYXBwZW5kIHRvYyBhcyBjaGlsZFxuICAgICAqL1xuICAgIGNvbnN0IGxpc3QgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBsaXN0LmlubmVySFRNTCA9IHRvYztcbiAgICBpbnNlcnRQb2ludC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgIC8qKlxuICAgICAqIHJldHVybiBuZXcgc2VyaWFsaXplZCBIVE1MXG4gICAgICovXG4gICAgcmV0dXJuIGRvbS5zZXJpYWxpemUoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ1dhcm4oYGVycm9yIGluIHRvY1BsdWdpbiwgZGlkbid0IHBhcnNlIGZvciByb3V0ZSAnJHt5ZWxsb3cocm91dGUpfSdgKTtcbiAgfVxuICAvLyBpbiBjYXNlIG9mIGZhaWx1cmUgcmV0dXJuIHVuY2hhbmdlZCBIVE1MIHRvIGtlZXAgZmxvdyBnb2luZ1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGh0bWwpO1xufTtcbiJdfQ==