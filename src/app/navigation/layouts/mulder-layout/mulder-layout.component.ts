import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "mulder-layout",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./mulder-layout.component.html",
    styleUrls: ["mulder-layout.component.scss"],
})
export class MulderLayoutComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
