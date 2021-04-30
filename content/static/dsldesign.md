---
published: true
title: Design your own DSL and embed it in Mulder/Scully
slug: dsldesign
backgroundImage: 'url(assets/img/bay2-2-optimized.jpg)'
---

# What is Web Component ?

> Web Components is a suite of different technologies allowing you to create reusable custom elements — with their functionality encapsulated away from the rest of your code — and utilize them in your web apps. (Source: MDN)

## What make a web component ?

- **Custom Elements**: The Custom Elements specification lays the foundation for designing and using new types of DOM elements.
- **Shadow DOM**: The shadow DOM specification defines how to use encapsulated style and markup in web components.
- **ES Modules**: The ES Modules specification defines the inclusion and reuse of JS documents in a standards based, modular, performant way.
- **HTML Template**: The HTML template element specification defines how to declare fragments of markup that go unused at page load, but can be instantiated later on at runtime.

## Why web component ?

> As developers, we all know that reusing code as much as possible is a good idea. This has traditionally not been so easy for custom markup structures — think of the complex HTML (and associated style and script) you’ve sometimes had to write to render custom UI controls, and how using them multiple times can turn your page into a mess if you are not careful. ( MDN )

- Reusability
- Maintainability
- Productivity
- Composability
- Following web standards



## Angular

Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations.


The main building blocks are modules, components, templates, metadata, data binding, directives, services, and dependency injection (see figure below). 

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Architecture_of_an_Angular_2_application.png/660px-Architecture_of_an_Angular_2_application.png)

### Angular component 

Components are the main building block for Angular applications. Each component consists of:

- An HTML template that declares what renders on the page
- A Typescript class that defines behavior
- A CSS selector that defines how the component is used in a template
- Optionally, CSS styles applied to the template

Please read the documentation [here](https://angular.io/guide/architecture-components).

We build Web application in composing components. Each component could be instatiated using a custom tag (See figure below). 
![](https://olivier.barais.fr/webinria/resources/angular2/img13.png)

Among the [cool feature of Angular](https://medium.com/@maaouikimo/why-angular-is-your-best-choice-for-you-next-projects-9d754fb18f91), it manages



