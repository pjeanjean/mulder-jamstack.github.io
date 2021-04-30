---
published: true
title: Mulder motivations
slug: motivations
backgroundImage: 'url(assets/img/574152.png)'
---
<div style=" border:1px dotted black;" id="toc"></div>

# Embrace Jamstack

> Documentation highly inspired from [here](https://jamstack.org/)

The [Jamstack architecture](https://jamstack.org/) has many benefits, whether you’re building a large e-commerce site, SaaS application, conference website or personal blog/site.

- **Better Performance**
Why wait for pages to build on the fly when you can generate them at deploy time? When it comes to minimizing the time to first byte, nothing beats pre-built files served over a CDN. Stop the use of WP please 😀

- **Higher Security**
With server-side processes abstracted into microservice APIs, surface areas for attacks are reduced. You can also leverage the domain expertise of specialist third-party services. Stop the use of WP please 😀

- **Cheaper, Easier Scaling**
When your deployment amounts to a stack of files that can be served anywhere, scaling is a matter of serving those files in more places. CDNs are perfect for this, and often include scaling in all of their plans.

- **Better Developer Experience**
Loose coupling and separation of controls allow for more targeted development and debugging, and the expanding selection of CMS options for site generators remove the need to maintain a separate stack for content and marketing.

- **Great portability**, welcome github/gitlab page
[Jamstack](https://jamstack.org/) sites are pre-generated. That means that you can host them from a wide variety of hosting services and have greater ability to move them to your preferred host. Any simple static hosting solution should be able to serve a [Jamstack](https://jamstack.org/) site.

[Excellent book on Jamstack](https://www.netlify.com/pdf/oreilly-modern-web-development-on-the-jamstack.pdf)

## The future is highly distributed

[Jamstack](https://jamstack.org/) is the new standard architecture for the web. Using Git workflows and modern build tools, pre-rendered content is served to a CDN and made dynamic through APIs and serverless functions. It is for example easy to use github actions to build and deploy the front. Technologies in the stack include JavaScript frameworks, Static Site Generators, Headless CMSs, CI/CD and CDNs.

<p align="center" style="background-color:black;">
<img src="https://d33wubrfki0l68.cloudfront.net/b7d16f7f3654fb8572360301e60d76df254a323e/385ec/img/svg/architecture.svg" width="70%" />
</p>

The work was done during the build, so now the generated site is stable and can be hosted without servers which might require patching, updating and maintain.

# Comparing static code generator approach

## A first step: Static Site Generator (SSG) like Jekyll,, Hugo

**Jekyll** is a simple, blog-aware, static site generator perfect for personal, project, or organization sites. Think of it like a file-based CMS, without all the complexity. Jekyll takes your content, renders Markdown and Liquid templates, and spits out a complete, static website ready to be served by Apache, Nginx or another web server. Jekyll is the engine behind GitHub Pages, which you can use to host sites right from your GitHub repositories.

**Hugo** is one of the most popular open-source static site generators. With its amazing speed and flexibility, Hugo makes building websites fun again. We use it for the DiverSE site and Gemoc Site.

### Pros

- Open source
- Huge community
- Plenty of themes, plugins
- ...

### Cons

- Developing a new plugin that consume micro-services is a bit paintful
- Do not fully embrace the notion of [WebComponents](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

## A second step: Gatsby, VuePress, Scully,

[Angular](https://angular.io/), [VueJS](https://vuejs.org/) and [React](https://reactjs.org/) as well as now svelte are excellent frameworks that are very well documented to promote the development of the front end based on the notion of Web component. This notion of Web component is based on the literature around the notion of software component and aims, among other things, to promote reuse, composition and maintainability of the various elements of an application. It was therefore attractive to rely on these frameworks for the development of the front end while allowing server side rendering for the generation of the static pages necessary to respect the [JamStack](https://jamstack.org/) approach.
This is exactly the idea behind Gasby (ICPE website), [scully](scully.io) or vuepress based on [React](https://reactjs.org/), [Angular](https://angular.io/) and [VueJS](https://vuejs.org/) respectively.

The huge interest of these frameworks is to have the best of both worlds between a static site *à la* Hugo or Jekyll and the use of Web components which ease the reuse off-the-shelf components from the [Angular](https://angular.io/), [VueJS](https://vuejs.org/), [React](https://reactjs.org/) communities or to develop easily your own Web components by benefiting from all the support of modern IDEs like VSCode for the use of these frameworks. It is the case of [Gatsby]( https://www.gatsbyjs.com/) based on [React](https://reactjs.org/), [VuePress](https://vuepress.vuejs.org/) based on [VueJS](https://vuejs.org/) and [Scully](https://scully.io/) based on angular.

The developer can then decide whether the content should be static and therefore pre-rendered when passing through the CI or dynamically calculated by consuming the data source when loading the page and benefit from [Angular](https://angular.io/), [React](https://reactjs.org/) or [VueJS](https://vuejs.org/) for rendering.

### Pros

- Excellent architecture
- Easy to develop, to maintain
- Could reuse lots of existing components
- Easy to create you own theme
- ...

### Cons

- When consuming static or dynamic data, JSON or other structured data are overused

## Mulder: an extended Scully powered by DSLs

> Good heavens, to doubt it is more than a failure of the imagination, it's a failure to recognize the limits of our own stupidity. The nascency of our science, the rudiment of our tools. We listen, we search, we look for a sign as if our eyes and ears are good enough, our brains large enough, or egos small enough. *Cigarette Smoking Man*

### Why scully ?

I'm a fan of [Angular](https://angular.io/) over [React](https://reactjs.org/) or [VueJS](https://vuejs.org/), I am not able to explain it, maybe it's because they built the framework on top of the TypeScript language features making the handling of the framework abstractions extremely simple and intuitive. As a result, I built *Mulder* on top of [Scully](https://scully.io/).

### Mulder: Empowering the JAMStack with DSLs

The idea of *Mulder* is to provide a set of web components and scully plugins to consume data structured within DSLs that are parsed directly into TypeScript either at the time of passing through the CI for static data or at the time of loading the data at the time of loading the page for dynamic data. The scenario for the enduser is the following, any *txt* file hosted on github, gitlab, hackmd that can be updated on the fly by the user. This txt file is parsed on the fly by a combinatorial parser within the application in order to be consumed in the component it uses.

Mulder therefore offers sample components for Markdown, a survey markup language, an online conference agenda and provides documentation on developing your own DSLs.

As a result, github, gitlab or hackmd could become your [headless CMS](https://jamstack.org/headless-cms/). They manage for you authentification, role-based management, Web IDE for txt file editions, txt file history, ... and Scully and Mulder can help you to design your front.

# Getting started

If you want to try Mulder, it is important to understand the following concepts

- Step 1: Understanding the notion of Web Components
  - Step 1.1: Web component and angular component
  - Step 1.2: Component and page layout in *Mulder*
  - Step 1.3: A simple example of a Web component
  - Step 1.4: A more complex example of a Web component
  - Step 1.5: Angular and routing

- Step 2: Scully and Jamstack
  - Step 2.1: Understanding Scully and the structure of a project using scully
  - Step 2.2: Scully: markdown as a markup syntax
  - Step 2.3: A component to consume markdown dynamically

- Step 3: Dynamic vs static rendering

- Step 4: DSLs as a markup language for editing web-app content
  - Step 4.1: Why DSLs as markup languages? why now?
  - Step 4.2: A markup language for surveyjs
  - Step 4.3: A markup language for defining a conference agenda
  - Step 4.4: Defining your own DSL
