import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ScullyRoutesService } from "@scullyio/ng-lib";
import { combineLatest } from "rxjs";
import { map, pluck } from "rxjs/operators";
@Component({
    selector: "mulder-static",
    templateUrl: "./static.component.html",
    styleUrls: ["./static.component.scss"],
})
export class StaticComponent implements OnInit {
    post!: any;

    constructor(
        //        private activatedRoute: ActivatedRoute,
        private scully: ScullyRoutesService
    ) {}

    ngOnInit(): void {
        this.scully.getCurrent().subscribe((e) => {
            this.post = e;
        });
        /*
        this.$blogPostMetadata = combineLatest([
            this.activatedRoute.params.pipe(pluck("slug")),
            this.scully.available$,
        ]).pipe(
            map(([slug, routes]) =>
                routes.find((route) => route.route === `/s/${slug}`)
            )
        );*/
    }
}
