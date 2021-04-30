import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "mulder-error-404",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./error-404.component.html",
    styleUrls: ["error-404.component.scss"],
})
export class Error404Component implements OnInit {
    constructor() {}
    ngOnInit() {}
}
