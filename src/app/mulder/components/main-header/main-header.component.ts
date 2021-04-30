import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
    selector: "mulder-main-header",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./main-header.component.html",
    styleUrls: ["main-header.component.scss"],
})
export class MainHeaderComponent implements OnInit, OnChanges {
    @Input() backgroundImage!: string;
    @Input() heading!: string;
    @Input() subHeading!: string;
    @Input() meta!: string;
    @Input() siteHeading = false;

    safeBackgroudImage!: SafeStyle;

    constructor(private domSanitizer: DomSanitizer) {}
    ngOnChanges(changes: SimpleChanges): void {
        this.safeBackgroudImage = this.domSanitizer.bypassSecurityTrustStyle(
            this.backgroundImage
        );
    }
    ngOnInit() {
        this.safeBackgroudImage = this.domSanitizer.bypassSecurityTrustStyle(
            this.backgroundImage
        );
    }
}
