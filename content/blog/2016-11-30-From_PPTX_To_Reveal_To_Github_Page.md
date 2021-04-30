---
layout: blog-post
title: Some techniques to transform PPTX slides to reveal.js slides; 
description: This blog post try to explain how I transform my pptx slides to html slides using open-source projects
place: Rennes, France
categories: [slides, reveal.js, powerpoint, migration]
published: true
---

This blog post try to explain how I transform my pptx slides to html slides using open-source projects. 

<!--more-->


## Initialize your presentation 

It exists now a yeoman generator for setting up your project. 

```bash
npm install -g generator-reveal
```


Make a new directory, and cd into it:


```bash
mkdir my-new-project && cd $_
```

Run yo reveal and start building your presentation.

```bash
yo reveal
```

Answer the following questions.

```bash
? What are you going to talk about? #Reveal.js and Yeoman is Awesomeness
? What version should we put in the package.json file? #0.0.0
? Do you want to use Sass to create a custom theme? #No
? What Reveal.js theme would you like to use? #white
? Do you want to deploy your presentation to Github Pages? #This requires an empty Github repository. Yes
? What is your Github username? #barais
? What is the Github repository name? #testslide
```

next you can view your slide in doing 

```bash
grunt serve
```


Then, you can create further slides with subgenerator. See the [generator web site](https://github.com/slara/generator-reveal) for some pieces of  documentation.

## Distribute your slides. 

When you want to export your presentation to some static HTML server, you can type 

```bash
grunt dist
```

to have all your relevant files saved to the dist directory.

## Publish your slides. 

If you want to publish it on a github page, you can just do 

```bash
git init #Only the first time.
grunt deploy
```

## Import and convert a pptx

If you get some contents that exists in pptx, you can import it. 

First, use [this project](https://github.com/g21589/PPTX2HTML) to convert your slide. Use libreoffice or PowerPoint to create pptx file.

You can use the [demo page](http://g21589.github.io/PPTX2HTML/) to convert your slide from pptx to html. Do not worry, your slide will not be uploaded on a server. It justs use your browser JavaScript Engine to do the conversion. Select your pptx file in clicking on "choose a pptx file". Next on the same button, select "export to Reveal.js slides". You will obtain an html file. You can copy it on the slides forlder of your project. 

Next we have to edit a bit this file to obtain a correct integration with the structure generated through the yeoman generator. In the html file you copy in slide, remove the first script section.

```html
<script type='text/javascript'>Reveal.initialize({	controls: true,	progress: true,	history: true,	center: true,	keyboard: true,	slideNumber: true,		theme: Reveal.getQueryHash().theme,	transition: Reveal.getQueryHash().transition || 'default',		dependencies: [		{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },		{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },		{ src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },		{ src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }	]});</script>
```

Next move the first style section (between <style> ... and </style>) within the template/_index.html file just after 

```html
       ...
	<!-- For syntax highlighting -->
        <link rel="stylesheet" href="bower_components/highlightjs/styles/zenburn.css">
       ...
```.
 

```html
<style>.hidden {
	display: none;
}

pre {
	width: 100%;
	height: 360px;
	overflow: scroll;
}

section {
	width: 100%;
	/*max-width: 920px;*/
	height: 690px;
	position: relative;
	border: 1px solid #333;
	background-color: #EFEFEF;
	text-align: center;
	border-radius: 10px;
	box-shadow: 1px 1px 3px #AAA;
	overflow: hidden;
	/*transform: scale(0.85);*/
}

section div.block {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
}

section div.content {
	display: flex;
	flex-direction: column;
	/*
	justify-content: center;
	align-items: flex-end;
	*/
}

section div.v-up {
	justify-content: flex-start;
}
section div.v-mid {
	justify-content: center;
}
section div.v-down {
	justify-content: flex-end;
}

section div.h-left {
	align-items: flex-start;
	text-align: left;
}
section div.h-mid {
	align-items: center;
	text-align: center;
}
section div.h-right {
	align-items: flex-end;
	text-align: right;
}

section div.up-left {
	justify-content: flex-start;
	align-items: flex-start;
	text-align: left;
}
section div.up-center {
	justify-content: flex-start;
	align-items: center;
}
section div.up-right {
	justify-content: flex-start;
	align-items: flex-end;
}
section div.center-left {
	justify-content: center;
	align-items: flex-start;
	text-align: left;
}
section div.center-center {
	justify-content: center;
	align-items: center;
}
section div.center-right {
	justify-content: center;
	align-items: flex-end;
}
section div.down-left {
	justify-content: flex-end;
	align-items: flex-start;
	text-align: left;
}
section div.down-center {
	justify-content: flex-end;
	align-items: center;
}
section div.down-right {
	justify-content: flex-end;
	align-items: flex-end;
}

section span.text-block {
	/* display: inline-block; */
}

li.slide {
	margin: 10px 0px;
	font-size: 18px;
}

div.footer {
	text-align: center;
}

section table {
	position: absolute;
}

section table, section th, section td {
	border: 1px solid black;
}

section svg.drawing {
	position: absolute;
	overflow: visible;
}

.fileUpload {
    position: relative;
    overflow: hidden;
}
.fileUpload input.upload {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
}

#pptx-thumb {
	min-width: 240px;
	height: 180px;
}
</style>
```

To improve the quality, you can edit this style in adding this CSS

```html
        .reveal section img{
          border: none;
          box-shadow: none;
        }
```

and remove or comment in the "section" section. 

```html
<!--          		background-color: #EFEFEF;-->
          		text-align: center;
<!--          		border-radius: 10px;
          		box-shadow: 1px 1px 3px #AAA;-->
```

You should get something like that

```html
        <link rel="stylesheet" href="bower_components/highlightjs/styles/zenburn.css">
        <style>
        .reveal section img{
          border: none;
          box-shadow: none;
        }

          	.hidden {
          		display: none;
          	}

          	pre {
          		width: 100%;
          		height: 360px;
          		overflow: scroll;
          	}

          	section {
          		width: 100%;
          		/*max-width: 920px;*/
          		height: 690px;
          		position: relative;
          		border: 1px solid #333;
<!--//          		background-color: #EFEFEF;-->
          		text-align: center;
<!--//          		border-radius: 10px;
//          		box-shadow: 1px 1px 3px #AAA;-->
          		overflow: hidden;
          		/*transform: scale(0.85);*/
          	}

          	section div.block {
          		position: absolute;
          		top: 0px;
          		left: 0px;
          		width: 100%;
          	}

          	section div.content {
          		display: flex;
          		flex-direction: column;
          		/*
          	justify-content: center;
          	align-items: flex-end;
          	*/
          	}

          	section div.v-up {
          		justify-content: flex-start;
          	}

          	section div.v-mid {
          		justify-content: center;
          	}

          	section div.v-down {
          		justify-content: flex-end;
          	}

          	section div.h-left {
          		align-items: flex-start;
          		text-align: left;
          	}

          	section div.h-mid {
          		align-items: center;
          		text-align: center;
          	}

          	section div.h-right {
          		align-items: flex-end;
          		text-align: right;
          	}

          	section div.up-left {
          		justify-content: flex-start;
          		align-items: flex-start;
          		text-align: left;
          	}

          	section div.up-center {
          		justify-content: flex-start;
          		align-items: center;
          	}

          	section div.up-right {
          		justify-content: flex-start;
          		align-items: flex-end;
          	}

          	section div.center-left {
          		justify-content: center;
          		align-items: flex-start;
          		text-align: left;
          	}

          	section div.center-center {
          		justify-content: center;
          		align-items: center;
          	}

          	section div.center-right {
          		justify-content: center;
          		align-items: flex-end;
          	}

          	section div.down-left {
          		justify-content: flex-end;
          		align-items: flex-start;
          		text-align: left;
          	}

          	section div.down-center {
          		justify-content: flex-end;
          		align-items: center;
          	}

          	section div.down-right {
          		justify-content: flex-end;
          		align-items: flex-end;
          	}

          	section span.text-block {
          		/* display: inline-block; */
          	}

          	li.slide {
          		margin: 10px 0px;
          		font-size: 18px;
          	}

          	div.footer {
          		text-align: center;
          	}

          	section table {
          		position: absolute;
          	}

          	section table,
          	section th,
          	section td {
          		border: 1px solid black;
          	}

          	section svg.drawing {
          		position: absolute;
          		overflow: visible;
          	}

          	.fileUpload {
          		position: relative;
          		overflow: hidden;
          	}

          	.fileUpload input.upload {
          		position: absolute;
          		top: 0;
          		right: 0;
          		margin: 0;
          		padding: 0;
          		font-size: 20px;
          		cursor: pointer;
          		opacity: 0;
          		filter: alpha(opacity=0);
          	}

          	#pptx-thumb {
          		min-width: 240px;
          		height: 180px;
          	}
          </style>
```


 
Finally remove the 

```html
<div id='slides' class='slides'>
```

and the last 

```html
</div> 
```

in your slides/slides.html

To see your slides, just edit the slide/list.json to index your file. 

Next run, 

```bash
grunt
```

to see the result. 

```bash
grunt publish when your are happy. 
```


enjoy ...






