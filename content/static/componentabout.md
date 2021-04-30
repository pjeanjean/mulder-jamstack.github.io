---
published: true
title: Learning through example
subTitle: a simple component
slug: componentabout
backgroundImage: 'url(assets/img/bay2-2-optimized.jpg)'
---

To illustrate how Angular works, let's imagine that we want to add a page to your mulder website. You will then generate a new component. 
Let's take the case of the *about* page. 

To do this, you can use angular cli to generate a new component name. It is possible to choose in which angular module this component should be added. 
(See the angular cli [documentation](https://angular.io/cli/generate#component-command) here)

A component, as explained above, is composed of a typescript class, an html template and a selector to define the custom tag to use to instantiate the component. 

In the case of a simple component, the typescript class is empty because this component doe not have any dynamic behaviour. 


```ts
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "mulder-about",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./about.component.html",
    styleUrls: ["about.component.scss"],
})
export class AboutComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
```

The component's html template is composed of the elements of the mulder web site template (namely the *mulder-layout* and *mulder-main-header* components) and content specific to the Web page to be displayed. Below you can view an excerpt of this template. 

```html
<mulder-layout><mulder-main-header backgroundImage='url("assets/img/about-bg.jpg")' heading="Olivier Barais" subHeading="Professor @University of Rennes 1 / IRISA / INRIA / B-COM" [siteHeading]="true"></mulder-main-header>
    <!-- # Dr. Olivier Barais   -->
    <div class="container">
        <div itemscope="" itemtype="http://schema.org/Person">
            <div class="row">
                <div class="col-md-8">
                    <h3>
                        <span itemprop="email"><a href="mailto:barais@irisa.fr">barais@irisa.fr</a></span>
                    </h3>
                    <hr />
                    ....
                    ....
                    ....
                    
                </div>
            </div>
        </div>
    </div>
</mulder-layout>

```

To instantiate this component, you can do it from another page using the custom tag of this component in a specific html template or use the [angular routing mechanism](https://angular.io/guide/router). This is the case here. The main page of mulder only contains the *router-outlet* tag which indicates that the component to be displayed is dependent on the application's routing url. 

In the angular route configuration part of mulder (*mulder-routing.module.ts* file), we add the following route.


```ts
export const ROUTES: Routes = [
    // Demo simple component
    {
        path: "",
        component: mulderContainers.HomeComponent,
    },
    // Demo simple about component
    {
        path: "about",
        component: mulderContainers.AboutComponent,
    },
    {
        path: "surveydemo",
        component: mulderContainers.SurveyDemoComponent,
    },

    // Demo complex component that consumes microservices (hal)
    {
        path: "publications",
        component: mulderContainers.PublicationsComponent,
    },
    // Demo complex component dynamic md content from microservices
    {
        path: "d/:cat/:slug",
        component: mulderContainers.DynamicMdComponent,
    },
    // Demo blog static
    {
        path: "blog/:slug",
        component: BlogComponent,
    },
    // Demo blog static (list of posts)
    {
        path: "blog",
        component: BlogsComponent,
    },
    // Demo static page from md
    {
        path: "s/:slug",
        component: StaticComponent,
    },
];
```

This addition indicates that it is necessary to load the *AboutComponent* component of the Mulder module when someone arrive on the */about* route

The result is visible [here](/about)
The complete source code of this component is visible [here]()