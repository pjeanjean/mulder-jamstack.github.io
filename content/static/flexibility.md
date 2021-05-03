---
published: true
title: Configure Static Rendering VS Dynamic Rendering
slug: flexibility
backgroundImage: 'url(assets/img/bay2-2-optimized.jpg)'
---

> "Markup" is for markup language such as Markdown, but maybe also all other language, ascidoc, etc. . With jamstack we have the constraint, and advantage, that it is static rendered, as opposite to other CMS like wordpress.

In the jamstack classical vision, content defined through markup is statically rendered during the CI/CD phase and dynamic contents are consumed through connections to APIs provided by a set of microservices available on the WEB.

<p align="center" style="background-color:black;">
<img src="https://d33wubrfki0l68.cloudfront.net/b7d16f7f3654fb8572360301e60d76df254a323e/385ec/img/svg/architecture.svg" width="70%" />
</p>

This boundary is often quite blurred in practice. Let's take a very concrete example. The Markdown language is often seen as a markup language compiled in a JamStack approach during the the CI/CD process. For my part, I use [HackMD](https://hackmd.io) to share my lab exercises.
During a lab, there may be additional information to bring to students, typos to fix, and factual errors to correct.
Waiting until the CI/CD passes is sometimes too long. I would like to be able to modify the Markdown source so that it is consumed by the web application when the page is loaded (So student could just refresh the page).

As Mulder proposes to define its own abstractions through dedicated languages, this approach further reduces the boundary between markup languages and external data sources.
As a result, the choice of interpreting this language during the CI/CD process or when the page is loaded has to be simple and this choice must be able to evolve over time.
This is what we call flexibility within Mulder.
To illustrate this, Mulder introduces a first component named *[dynamicMD](/s/dynamicmd)* in order to allow a dynamic rendering of a Markdown file.

Each DSL created in Mulder could be rendered during the CI/CD process or dynamically when the page will be loaded. [Here](/s/dsldesign), you could find some documentation.
