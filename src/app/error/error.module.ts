/* tslint:disable: ordered-imports*/
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

/* Modules */
import { NavigationModule } from "@app/navigation/navigation.module";

/* Components */
import * as errorComponents from "./components";

/* Containers */
import * as errorContainers from "./containers";
import { IconsModule } from "../icons/icons.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        IconsModule,
        NavigationModule,
    ],
    providers: [],
    declarations: [
        ...errorContainers.containers,
        ...errorComponents.components,
    ],
    exports: [...errorContainers.containers, ...errorComponents.components],
})
export class ErrorModule {}
