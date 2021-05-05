import { Component, OnInit } from "@angular/core";

// tslint:disable-next-line:prettier
// tslint:disable-next-line:no-unused-expression
import * as _posts from "../../../../dynamicRoutes.json";
import { DynamicRoute } from "../../models/navigation.model";
@Component({
    selector: "mulder-top-nav",
    templateUrl: "./top-nav.component.html",
    styleUrls: ["top-nav.component.scss"],
})
export class TopNavComponent implements OnInit {
    isMenuCollapsed = true;
    mainMenuEntries: string[] = [];
    mainMenuMap: Map<string, any[]> = new Map();
    mainMenuIcons: Map<string, string[]> = new Map();
    mainStaticMenu: any[] = [];
    posts!: DynamicRoute[];
    constructor() {}
    ngOnInit() {
        this.posts = (_posts as any).default as DynamicRoute[];
        this.mainMenuEntries = [];
        this.mainMenuMap = new Map();
        /*        this.posts
            .filter((p) => p.type === "dynamic")
            .forEach((p) => {
                if (!this.mainMenuEntries.includes(p.menupath.split("/")[0])) {
                    this.mainMenuEntries.push(p.menupath.split("/")[0]);
                    this.mainMenuMap.set(p.menupath.split("/")[0], []);
                }
                this.mainMenuMap.get(p.menupath.split("/")[0])?.push(p);
            });*/
        this.posts
            //           .filter((p) => p.type === "static")
            .forEach((p) => {
                const paths = p.menupath.split("/");
                if (paths.length === 1) {
                    this.mainStaticMenu.push(p);
                } else if (paths.length === 2){
                    if (
                        !this.mainMenuEntries.includes(p.menupath.split("/")[0])
                    ) {
                        this.mainMenuEntries.push(p.menupath.split("/")[0]);
                        this.mainMenuMap.set(p.menupath.split("/")[0], []);
                    }
                    this.mainMenuMap.get(p.menupath.split("/")[0])?.push(p);
                }

                if (
                    p.level1icon !== null &&
                    ![...this.mainMenuIcons.keys()].includes(
                        p.menupath.split("/")[0]
                    )
                ) {
                    this.mainMenuIcons.set(
                        p.menupath.split("/")[0],
                        p.level1icon as string[]
                    );
                }
            });
    }

    hasicon(m: any) {
        return this.mainMenuIcons.get(m) !== null;
    }
    icon(m: any) {
        return this.mainMenuIcons.get(m);
    }
}
