---
published: true
title: Understanding dynamic md
slug: dynamicmd
backgroundImage: 'url(assets/img/bay2-2-optimized.jpg)'
---

# Dynamic MD Requirement

The first idea behind Mulder is to allow the developer to choose late whether a markup should be rendered at CI time (compilation) or when the page is loaded (interpretation), and to update this choice smoothly. The goal is for the *DynamicMarkdown* component to be the counterpart of the scully Blog module by allowing a markdown document to be uploaded as a WEB resource on the fly.

# Dynamic MD implementation

The implementation of this component is simple. It is an angular component which consumes the metadata allowing to recover the url of the markdown resource, the title, the description, the header image but also metadata to generate the table of contents if needed. This component uses the *[marked](https://github.com/markedjs/marked)* library for the translation of the markdown into html dom and *[highlightjs](https://highlightjs.org/) for the syntax highlighting of the code excerpt.
By configuration, this component is instantiated for any*'/d/*'* route, the metadata is defined in the *dynamicRoutes.json* file. The metadata keys are as follows.

```json
{
 "path": "/d/teaching/secuweb", // instantiate if match this path
 "menupath": "Flexibility/Dynamic MD demo", // visible in the menu ?
 "title": "Demo Hackmd", // title
 "subTitle": "Demo Hackmd", //subTitle
 "meta": ["demo", "dynamic", "md"], // tags
 "mdsource": "https://hackmd.diverse-team.fr/D9nr78AzSX2V9i5EOJ6hzA", // URL of the MD
 "tocrootselector": "#cours", // selector to decide the toc beginning
 "tocselector": ["h1","h2","h3","h4"], // selector for the toc
 "toctitle": "Plan" //toc title
}
```

Below is the code of the business class and the html template of this component.

```html
<mulder-layout *ngIf="post">
    <mulder-main-header [backgroundImage]="post?.backgroundImage || defaultBackground" [heading]="post?.title" [subHeading]="post?.subTitle" [meta]="post?.meta?.join(', ')" [siteHeading]="true"></mulder-main-header>
    <article>
        <div class="container">
            <div class="row">
                <div #content class="col-lg-12 col-md-12 mx-auto">
                    <div *ngIf="mdContent" [innerHtml]="mdContent"></div>
                </div>
            </div>
        </div>
    </article>
</mulder-layout>
```

```ts
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicRoute } from "@app/navigation/models";
import marked from "marked";
import prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markup";

import * as _posts from "../../../../dynamicRoutes.json";
// import 'prismjs/components/prism-visualbasic';

// loadLanguages(['javascript', 'java', 'visualbasic', 'jsx', 'css', 'markup', 'bash', 'json']);

marked.setOptions({
    highlight(code, lang) {
        if (prism.languages[lang]) {
            return prism.highlight(code, prism.languages[lang], lang);
        } else {
            return code;
        }
    },
    pedantic: false,
    gfm: true,
    headerIds: true,
    breaks: false,
    mangle: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: true,
});

@Component({
    selector: "mulder-dynamic-md",
    templateUrl: "./dynamic-md.component.html",
    styleUrls: ["./dynamic-md.component.scss"],
})
export class DynamicMdComponent
    implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    @ViewChild("content")
    content!: ElementRef;
    posts!: DynamicRoute[];

    post!: any;
    defaultBackground = 'url("assets/img/home-bg.jpg")';
    mdContent: any;
    private httpOptions = {
        headers: new HttpHeaders({
            Accept: "text/html, application/xhtml+xml, */*",
        }),
        responseType: "text" as "json",
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private sanitized: DomSanitizer,
        private renderer: Renderer2
    ) {}

    public removeEventListener: (() => void) | undefined;
    public anchors!: any[];
    ngOnInit(): void {
        this.posts = (_posts as any).default as DynamicRoute[];

        this.activatedRoute.url.subscribe((f) => {
            const selectedPost = this.posts.filter(
                (p) => p.path === "/" + f.join("/")
            );
            if (selectedPost.length > 0) {
                this.post = selectedPost[0];
            }
            if (this?.post?.mdsource != null) {
                this.http
                    .get(this.post.mdsource + "/download", this.httpOptions)
                    .subscribe((res) => {
                        // console.log(marked(res as string));
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(
                            marked(res as string),
                            "text/html"
                        );
                        const tocInsertPointSelector = "#toc";
                        const insertPoint = doc.querySelector(
                            tocInsertPointSelector
                        );
                        // in case <div id="toc"></div> is not on the site
                        if (insertPoint) {
                            /**
                             * get headings for toc generation
                             */
                            const levels =
                                this.post && this.post.tocselector
                                    ? this.post.tocselector
                                    : ["h2", "h3"];

                            const selector = levels.join(", ");

                            let headers = Array.from(
                                doc.querySelectorAll(selector)
                            );
                            const queryroot =
                                this.post && this.post.tocrootselector
                                    ? doc.querySelector(
                                          this.post.tocrootselector
                                      )
                                    : null;
                            let indexheadertostart = -1;
                            for (const [index, h] of headers.entries()) {
                                if (h === queryroot) {
                                    indexheadertostart = index;
                                    break;
                                }
                            }
                            if (indexheadertostart > 0) {
                                headers = headers.splice(indexheadertostart);
                            }

                            /**
                             * build nested ul, li list
                             */
                            let previousTag: number | null;
                            let toc = "";
                            headers.forEach((c: any) => {
                                const level = this.headingLevel(c.tagName);
                                const route = window.location.origin;
                                const trailingSlash = "/";

                                const baseLiEl = `<li><a href="${route}${trailingSlash}#${c.id}">${c.textContent}</a></li>`;
                                if (
                                    previousTag &&
                                    level &&
                                    level > previousTag
                                ) {
                                    toc += '<ul style="margin-bottom: 0px">';
                                }
                                if (
                                    previousTag &&
                                    level &&
                                    level < previousTag
                                ) {
                                    for (
                                        let j = 0;
                                        j < previousTag - level;
                                        j++
                                    ) {
                                        toc += "</ul>";
                                    }
                                }
                                toc += baseLiEl;
                                previousTag = level;
                            });

                            /**
                             * append toc as child
                             */
                            const plantitle = doc.createElement("h2");
                            plantitle.textContent =
                                this.post && this.post.toctitle
                                    ? this.post.toctitle
                                    : "Plan";
                            const list = doc.createElement("ul");
                            list.innerHTML = toc;
                            insertPoint?.appendChild(plantitle);
                            insertPoint?.appendChild(list);
                        }
                        this.mdContent = this.sanitized.bypassSecurityTrustHtml(
                            doc.body.innerHTML
                        );
                    });
            }
        });
    }

    public ngAfterViewInit() {}

    public ngOnDestroy() {
        // Cleanup by removing the event listeners on destroy
        this.anchors.forEach((anchor: HTMLAnchorElement) => {
            anchor.removeEventListener("click", this.handleAnchorClick);
        });
    }

    public handleAnchorClick = (event: Event) => {
        // Prevent opening anchors the default way
        event.preventDefault();
        const anchor = event.target as HTMLAnchorElement;
        const el = this.content.nativeElement.querySelector(
            decodeURI(anchor.href)
                .replace(window.location.origin + "/", "")
                .toLowerCase()
        );
        el?.scrollIntoView();
        // alert(`You are trying to navigate to ${anchor.href}`);
    };
    ngAfterViewChecked(): void {
        // Solution for catching click events on anchors using querySelectorAll:
        this.anchors = this.content.nativeElement.querySelectorAll("a");
        this.anchors.forEach((anchor: HTMLAnchorElement) => {
            if (anchor.href.startsWith(window.location.origin + "/#"))
                anchor.addEventListener("click", this.handleAnchorClick);
        });
    }
    headingLevel(tag: string): number | null {
        const match = tag.match(/(?!h)[123456]/g);
        return match && match.length ? Number(match[0]) : null;
    }
}
```

As a result, if you want to add a new page, you just have to add a new entry in the *dynamicRoutes.json* file.

# A scully plugin to add this route

To manage these news routes,

I have developed a router plugin to tell Scully the routes defined in the *dynamicRoutes.json* file. The code of this plugin is simple, it follows the great scully documentation available [here](https://scully.io/docs/Reference/plugins/types/router/).

The code of the plugin is as [here](https://github.com/mulder-jamstack/mulder-jamstack.github.io/blob/91be3b920666cad8f61197d5f1d18c6c96d577d4/scully.mulder.config.ts#L17) .

Thus, by simply editing the *dynamicRoutes.json* file, the developer can decide whether the markdown file is rendered statically (during the CI) or dynamically (when the page is loaded).