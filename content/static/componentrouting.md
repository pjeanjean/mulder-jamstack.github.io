---
published: true
title: Understanding routing
slug: componentrouting
backgroundImage: 'url(assets/img/bay2-2-optimized.jpg)'
---

<div style=" border:1px dotted black;" id="toc"></div>


> Documentation highly inspired from [here](https://www.smashingmagazine.com/2018/11/a-complete-guide-to-routing-in-angular/)

## Introducing Angular Router

[Angular Router](https://angular.io/guide/router) is a powerful JavaScript router built and maintained by the Angular core team that can be installed from the *@angular/router* package. It provides a complete routing library with the possibility to have multiple router outlets, different path matching strategies, easy access to route parameters and route guards to protect components from unauthorized access.

The Angular router is a core part of the Angular platform. It enables developers to build Single Page Applications with multiple views and allow navigation between these views.

Let’s now see the essential Router concepts in more details.

## The router-outlet

The *[Router-Outlet](https://angular.io/api/router/RouterOutlet)* is a directive that’s available from the router library where the Router inserts the component that gets matched based on the current browser’s URL. You can add multiple outlets in your Angular application which enables you to implement advanced routing scenarios.

```html
<router-outlet></router-outlet>
```

Any component that gets matched by the *Router* will render it as a sibling of the *Router outlet*.

## Routes and path

Routes are definitions (objects) comprised from at least a path and a component (or a *[redirectTo](https://angular.io/api/router/Route#redirectTo)* path) attributes. The path refers to the part of the URL that determines a unique view that should be displayed, and component refers to the Angular component that needs to be associated with a path. Based on a route definition that we provide (via a static *RouterModule.forRoot(routes)* method), the Router is able to navigate the user to a specific view.

Each Route maps a URL path to a component.

The path can be empty which denotes the default path of an application and it’s usually the start of the application.

The path can take a **wildcard string** *(\*\*)*. The router will select this route if the requested URL doesn’t match any paths for the defined routes. This can be used for displaying a “Not Found” view or redirecting to a specific view if no match is found.

This is an example of a route:

```ts
{ path:  'publications', component:  PublicationsComponent}
```

If this route definition is provided to the Router configuration, the router will render *PublicationsComponent* when the browser URL for the web application becomes */publications*.


## Route matching strategies

The Angular Router provides different route matching strategies. The default strategy is simply checking if the current browser’s URL is prefixed with the path.

For example our previous route:

```ts
{ path:  'publications', component:  PublicationsComponent}
```

Could be also written as:

```ts
{ path:  'publications',pathMatch: 'prefix', component:  PublicationsComponent}
```


The *patchMath* attribute specifies the matching strategy. In this case, it’s **prefix** which is the default.

The second  matching strategy is *full*. When it’s specified for a route, the router will check if the the path is exactly **equal** to the path of the current browser’s URL:

```ts
{ path:  'publications',pathMatch: 'full', component:  PublicationsComponent}
```

## Route params

Creating routes with parameters is a common feature in web apps. Angular Router allows you to access parameters in different ways:

Using the [ActivatedRoute](https://angular.io/api/router/ActivatedRoute) service,
Using the [ParamMap](https://angular.io/api/router/ParamMap) observable available starting with angular v4.

You can create a route parameter using the colon syntax. This is an example route with an id parameter:

```ts
{ path:  'publications/:id', component:  PublicationDetailComponent}
```

## Route guards

A route guard is a feature of the Angular Router that allows developers to run some logic when a route is requested, and based on that logic, it allows or denies the user access to the route. It’s commonly used to check if a user is logged in and has the authorization before he can access a page.

You can add a route guard by implementing the CanActivate interface available from the *@angular/router* package and extends the *canActivate()* method which holds the logic to allow or deny access to the route. For example, the following guard will always allow access to a route:

```ts
class MyGuard implements CanActivate {
  canActivate() {
    return true;
  }
}
```

You can then protect a route with the guard using the *canActivate* attribute:

```ts
{ path:  'publications/:id', canActivate:[MyGuard], component:  PublicationDetailComponent}
```

## Navigation directive

The Angular Router provides the *routerLink* directive to create navigation links. This directive takes the path associated with the component to navigate to. For example:

```ts
<a [routerLink]="'/publications'">Publications</a>
```

## Multiple outlets and auxiliary routes

Angular Router supports multiple outlets in the same application.

A component has one associated primary route and can have auxiliary routes. Auxiliary routes enable developers to navigate multiple routes at the same time.

To create an auxiliary route, you’ll need a named router outlet where the component associated with the auxiliary route will be displayed.

```ts
<router-outlet></router-outlet>  
<router-outlet name="outlet1"></router-outlet> 
```

The outlet with no name is the **primary outlet**.
All outlets should have a name except for the primary outlet.
You can then specify the outlet where you want to render your component using the outlet attribute:

```ts
{ path: "contacts", component: ContactListComponent, outlet: "outlet1" }
```


## Routing to an error page

In the navigation module, we provide default routes when accessing an undefined route. The code below shows the use of this module. A demo is available through the [following link](/foo).

```ts
/* tslint:disable: ordered-imports*/
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MulderRouteData } from "@app/navigation/models";

/* Module */
import { ErrorModule } from "./error.module";

/* Containers */
import * as errorContainers from "./containers";

/* Routes */
export const ROUTES: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "404",
    },
    {
        path: "401",
        canActivate: [],
        component: errorContainers.Error401Component,
        data: {
            title: "Error 401 - SB Clean Blog Angular",
        } as MulderRouteData,
    },
    {
        path: "404",
        canActivate: [],
        component: errorContainers.Error404Component,
        data: {
            title: "Error 404 - SB Clean Blog Angular",
        } as MulderRouteData,
    },
    {
        path: "500",
        canActivate: [],
        component: errorContainers.Error500Component,
        data: {
            title: "Error 500 - SB Clean Blog Angular",
        } as MulderRouteData,
    },
    {
        path: "**",
        pathMatch: "full",
        component: errorContainers.Error404Component,
    },
];

@NgModule({
    imports: [ErrorModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ErrorRoutingModule {}
```