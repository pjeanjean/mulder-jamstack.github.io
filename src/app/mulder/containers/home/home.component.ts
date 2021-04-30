import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";

@Component({
    selector: "mulder-home",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./home.component.html",
    styleUrls: ["home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
    constructor() {}
    ngOnInit() {}

    ngOnDestroy() {}
}
