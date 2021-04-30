---
layout: blog-post
title: Xtext language au sein de jupyterlab
description: petit tuto pour regarder comment intégrer tout langage construit à l'aide d'Xtext au sein d'une application Web ou plus précisément au sein de Jupyterlab
place: Rennes, France
categories: [teaching]
published: true
---

Aujourd'hui, petit tuto pour regarder comment intégrer tout langage construit à l'aide d'Xtext au sein d'une application Web ou plus précisément au sein de Jupyterlab.

Le tuto se déroulera en 4 étapes

1. Comment faire en sorte que votre langage construit à l'aide d'Xtext fournisse l'interface LSP
2. Comment faire en sorte que cette interface soit accessible depuis des WebSockets
3. Comment intégrer ce langage dans vscode
4. Comment intégrer un éditeur Web monaco dans une interface Web comme client de cette interface LSP
5. Comment intégrer remplacer l'éditeur de JupyterLab avec monaco.

## Etape 1:  Comment faire en sorte que votre langage construit à l'aide d'Xtext fournisse l'interface LSP

Construire un langage à l'aide d'Xtext est assez simple. Je vous laisse allez voire des [tutos](http://www.eclipse.org/Xtext/documentation/201_sevenlang_introduction.html) comme celui-ci pour une introduction à XText. 

Le choix d'un support de LSP se fait au moment de l'initialisation du projet. 
