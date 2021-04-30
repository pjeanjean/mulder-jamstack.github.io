/* tslint:disable: ordered-imports*/
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

/* Containers */
import * as navigationContainers from "./containers";

/* Layouts */
import * as appCommonLayouts from "./layouts";

/* Guards */
import * as navigationGuards from "./guards";

/* Services */
import * as navigationServices from "./services";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IconsModule } from "../icons/icons.module";

@NgModule({
    imports: [CommonModule, RouterModule, NgbModule, IconsModule],
    declarations: [
        ...navigationContainers.containers,
        ...appCommonLayouts.layouts,
    ],
    exports: [...navigationContainers.containers, ...appCommonLayouts.layouts],
})
export class NavigationModule {
    constructor(private navServices: navigationServices.NavigationService) {}

    static forRoot(): ModuleWithProviders<NavigationModule> {
        return {
            ngModule: NavigationModule,
            providers: [
                ...navigationServices.services,
                ...navigationGuards.guards,
            ],
        };
    }
}
