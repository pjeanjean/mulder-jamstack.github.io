---
published: true
title: Why using DSL for designing your own markup languages?
slug: whydsl
backgroundImage: 'url(assets/img/backgrounddsl.png)'
---

> A domain-specific language (DSL) is a computer language specialized to a particular application domain. This is in contrast to a general-purpose language (GPL), which is broadly applicable across domains. There are a wide variety of DSLs, ranging from widely used languages for common domains, such as HTML for web pages, down to languages used by only one or a few pieces of software, such as MUSH soft code. DSLs can be further subdivided by the kind of language, and include **domain-specific markup languages**, **domain-specific modeling languages (more generally, specification languages)**, and **domain-specific programming languages**. Special-purpose computer languages have always existed in the computer age, but the term "domain-specific language" has become more popular due to the rise of domain-specific modeling. The line between general-purpose languages and domain-specific languages is not always sharp, as a language may have specialized features for a particular domain but be applicable more broadly, or conversely may in principle be capable of broad application but in practice used primarily for a specific domain. *from [Wikipedia](https://en.wikipedia.org/wiki/Domain-specific_language)*

The second motivation behind **mulder** is to show that it can be easy to create your own domain-specific markup languages but above all that there are now excellent *language workbench* in order to obtain both a parser for this language but also the skeletons of the LSP server implementation allowing to obtain an excellent user experience in editors like monaco (code completion, linter, typechecking, ...).

Below a small video to explain LSP, it contains some demo to show the use of LSP within monaco.

<div align="center" class="mx-auto d-block">
<iframe width="560" height="315" src="https://www.youtube.com/embed/2GqpdfIAhz8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Here a last video on what you can also envision for the use of domain-specific modeling languages to edit some contents within you website.

<div align="center" class="mx-auto d-block">
<iframe width="560" height="315" src="https://www.youtube.com/embed/IydM4l7WFKk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Do not hesitate to browse typefox website to envision how you could let user edit the content of a domain-specific markup languages.

- [Create you own ide](https://www.typefox.io/blog/domain-specific-languages-in-theia-and-vs-code)
