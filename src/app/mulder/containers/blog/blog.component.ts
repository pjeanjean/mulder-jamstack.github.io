import { Component, OnInit } from "@angular/core";
import { ScullyRoutesService } from "@scullyio/ng-lib";
@Component({
    selector: "mulder-blog",
    templateUrl: "./blog.component.html",
    styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
    post!: any;
    defaultBackground = 'url("assets/img/home-bg.jpg")';

    constructor(private scully: ScullyRoutesService) {}

    ngOnInit(): void {
        this.scully.getCurrent().subscribe((e) => {
            this.post = e;
            if (e?.route?.startsWith("/blog")) {
                this.defaultBackground = 'url("assets/img/blog-bg.jpg")';
            }
        });
        /*this.$blogPostMetadata = combineLatest([
            this.activatedRoute.params.pipe(pluck('slug')),
            this.scully.available$,
        ]).pipe(
            map(([slug, routes]) =>
                routes.find((route) => route.route === this.router.url + `/${slug}`)
            )
        );*/
    }
}
