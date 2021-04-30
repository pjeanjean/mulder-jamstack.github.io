import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SurveyComponent } from "./component/survey.component";

@NgModule({
    declarations: [SurveyComponent],
    imports: [CommonModule],
    exports: [SurveyComponent],
})
export class SurveypluginModule {}
