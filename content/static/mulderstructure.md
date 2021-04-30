---
published: true
title: Understand the Mulder project structure
slug: mulderstructure
backgroundImage: 'url(assets/img/bay2-2-optimized.jpg)'
---

## Understanding the site layout


The layout is composed of a set of angular components. 
So in the example provided, each page is composed of the following components, the *mulder-layout* component, which contains the *mulder-main-header* component and a specific component depending on the page.


```html
<mulder-layout>
    <mulder-main-header backgroundImage='url("assets/img/574152.png")' heading="Mulder (The Truth Is Out There)"
        subHeading="a DSL-based Jamstack-compliant modern sites generator on top of Scully (Angular)" [siteHeading]="true">
    </mulder-main-header>
....
</mulder-layout>
```


The mulder-layout component consists of the *mulder-top-nav components*, the content of the *mulder-layout component* and the *mulder-footer* component. 


```html
<mulder-top-nav></mulder-top-nav>
<ng-content></ng-content>
<mulder-footer></mulder-footer>
```

If we play with the composition by hand, each mulder page is composed of the following components. 
- a *mulder-top-nav component*, 
- a *mulder-main-header* component, 
- a page-specific component, 
- and a *mulder-footer* component. 

See an example of the derived template. 

```html
<mulder-top-nav></mulder-top-nav>

    <mulder-main-header backgroundImage='url("assets/img/574152.png")' heading="Mulder (The Truth Is Out There)"
        subHeading="a DSL-based Jamstack-compliant modern sites generator on top of Scully (Angular)" [siteHeading]="true">
    </mulder-main-header>
....
<mulder-footer></mulder-footer>


```

The template for the mulder-main-header component is as follows. 

```html
<header class="masthead" [style.background-image]="safeBackgroudImage">
    <div class="overlay"></div>
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-10 mx-auto">
                <ng-container *ngIf="siteHeading; else postHeading">                        <div class="site-heading">
                        <h1>{{heading}}</h1>
                        <span class="subheading">{{subHeading}}</span>
                        <span class="meta">{{meta}}</span>
                    </div>
                </ng-container>
            </div>
        </div>
    </div>
</header>
<ng-template #postHeading>
    <div class="post-heading">
        <h1>{{heading}}</h1>
        <h2 class="subheading">{{subHeading}}</h2>
        <span class="meta">{{meta}}</span>
    </div>
</ng-template>
```

Its component class is as follows. 


```ts
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
    selector: "mulder-main-header",
    templateUrl: "./main-header.component.html",
    styleUrls: ["main-header.component.scss"],
})
export class MainHeaderComponent implements OnInit {
    @Input() backgroundImage!: string;
    @Input() heading!: string;
    @Input() subHeading!: string;
    @Input() meta!: string;
    @Input() siteHeading = false;

    safeBackgroudImage!: SafeStyle;

    constructor(private domSanitizer: DomSanitizer) {}
    ngOnInit() {
        this.safeBackgroudImage = this.domSanitizer.bypassSecurityTrustStyle(
            this.backgroundImage
        );
    }
}
```

Still if we perform a part of the composition, we will get this kind of web page. *mulder-top-nav* and *mulder-footer* should also be replaced by their respective templates. 

```html
<mulder-top-nav></mulder-top-nav>

<header class="masthead" [style.background-image]="safeBackgroudImage">
    <div class="overlay"></div>
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-10 mx-auto">
                <ng-container>
                    <div class="site-heading">
                        <h1>{{heading}}</h1>
                        <span class="subheading">{{subHeading}}</span>
                        <span class="meta">{{meta}}</span>
                    </div>
                </ng-container>
            </div>
        </div>
    </div>
</header>
....
<mulder-footer></mulder-footer>
```

The template of any scully website could be fully revisited. 


## Understanding the modules organisation

To improve the structuring of the Mulder application, it is structured along 6 modules. 

- error
- icons
- navigation
- mulder
- surveyplugin
- agendaplugin
- app.module

<p align="center">
<img src="assets/img/components/mulderstructure.png" width="100%" />
</p>


## Understanding specific components and plugin

- **DynamicMarkdown** component: use to fetch markdown online and automatically render page when loading the page
- **Home** component: Home page of the web site (*Simple angular component*)
- **About** component: About page of the web site (*Simple angular component*)
- **Blogs** component: blog index pages (*Use Scully to create the structure of the page*)
- **Blog**  component: blog post page (*Use Scully to create the structure of the page*)
- **Static**  component: static page rendering (*Use Scully to statically consume md file and generate html page*)
- **Publications** component: Publications page of the web site (*example of complex angular component (reuse of D3 cloud component, dynamycally consume [hal](https://hal.inria.fr/) service API*)
- **SurveyMarkup** component: First example of the use of a DSL as a markup language
- **AgendaDSL** component: First example of the use of a DSL as a markup language