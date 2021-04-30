---
layout: blog-post
title: JHipster and Software Engineering teaching
description: JHipster for Software Engineering teachning at University of Rennes 1
place: Rennes, France
categories: [jhipster,software engineering]
published: true
---

I am a fan of the [JHipster](http://jhipster.github.io/) framework. Recently, through a discussion with [Jean-Marc Jézéquel](http://people.irisa.fr/Jean-Marc.Jezequel/), we decide to use it as a support for teaching advanced concepts in Software Engineering and Sofware Architecture at the University of Rennes 1 in a flip classroom. 

<!--more-->


#JHipster

The **goal** of JHipster is to provide a framework for building Modern Web apps that have:

* Beautiful design
* Stop waiting for pages to load
* Dynamic updates of page fragments

These apps must be build using the latest HTML5/CSS3/JS technologies. 
Those websites should be delivered fast. Waiting 1 minute for your application to "deploy" is not acceptable.
Modern websites should be able to handle huge numbers of concurrent users. We need robust, high-performance application servers. 

The goal of JHipster is to solve those issues through. 

* A beautiful front-end, with the latest HTML5/CSS3/JavaScript frameworks
* A robust and high-quality back-end, with the latest Java/Caching/Data access technologies
* All automatically wired up, with security and performance in mind
* And great developer tooling, for maximum productivity

Even for simple applications, achieving this goal raises specific conerns to manage system complexity. 

For achieving this goal, JHipster combines:

* generative programming concepts (through YO), 
* aspect oriented-concepts (through Spring)
* software product lines concepts 
* Object relational mapping concepts (through JPA)
* Restful services 
* Test Driven Development
* ...

through the following technologies

* client side: 
	* YEOMAN, 
	* GRUNT, 
	* BOWER, 
	* ANGULARJS, 
	* Karma, 
	* Bootstrap

* server side: 
	* MAVEN, SPRING (Dependency injection and AOP), 
	* SPRING MVC REST, 
	* SPRING DATA JPA, 
	* Spring security, 
	* liquidbase, 
	* caching techologies (Ehcache, HazelCast), 
	* Template mechanisms (Thymeleaf), 
	* Monitoring techiques, 
	* ready for cloud ;). 

#SPL teaching using JHipster

JHipster is a Yeoman generator. It can generate more than 10k  architecture types of project depending on different criteria. As a result, when you start to create a project, you must answer a set of questions to select the required features for your application. 

To illustrate Software Product Line principle and the feature diagram notation, I build a  feature model for JHipster using Feature IDE and I create a generator for create the app automatically from eclipse or IntelliJ. 

Here is a snapshot of the feature diagram. You can see the number of potential architecture types. 


<img src="../../../img/post/1.png" width="750px" />

Here is a snapshot of a configuration model you can define from FeatureIde. 

<img src="../../../img/post/2.png" width="750px" />


Behind the scene, I use xdotool to wrap the jhipster console when you define a first model. 

```bash
#extract of the shell script generated	
#!/bin/bash
xfce4-terminal -T jhipstergen -x yo jhipster &
sleep 2
WID=`xdotool search --name "jhipstergen"`  
xdotool windowactivate $WID 
xdotool windowfocus $WID 
#appnam
xdotool type myapp
xdotool key "Return"
#package
xdotool type fr.irisa.jhipster
xdotool key "Return"
#Java Selection
#xdotool key Down
xdotool key "Return"
...
```

The feature model, some config sample and the generator for jhipster are available [here](https://github.com/barais/featureModelJHipster/).

#Model-driven engineering teaching using JHipster

Once you have created your application, you will want to create entities. For example, you might want to create an Car and a Person entity. For each entity, you will need:

* A database table
* A Liquibase change set
* A JPA Entity
* A Spring Data JPA Repository
* A Spring MVC REST Controller, which has the basic CRUD operations
* An AngularJS router, a controller and a service
* An HTML view
* If you have several entities, you will likely want to have relationships between them. For this, you will need:
	* A database foreign key
	* Specific JavaScript and HTML code for managing this relationship

The "entity" sub-generator will create all the necessary files, and provide a CRUD front-end for each entity.

Of course, the use of modelling techniques (UML) is confortable to create your business model.

I propose to use [genmymodel](https://dashboard.genmymodel.com/) a great online uml tools with a support of [Acceleo](https://eclipse.org/acceleo/) to define your own code generator that must be deployed on github. 

I provide a [custom code generator](https://github.com/barais/genmymodeljhipstergenerator) for JHipster (generating json file for entity). 

You can easily use it directly from GenMyModel. 

<img src="../../../img/post/3.png" width="750px" />
<img src="../../../img/post/4.png" width="750px" />
<img src="../../../img/post/5.png" width="750px" />

You get an archive file that can be added to your app root folder. <img src="../../../img/post/6.png" width="750px" />

Next call the shell script. 

```bash
#to the folder root.
sh model.sh
```

As a result, you can easily extend the feature diagram in adding your own custom generator. 


```bash
#to the folder root.
mvn spring-boot:run
#In an other console
grunt serve
```

You obtain a clean runnable skeleton of your application. You can add services, refine restful services and create custom UI for your application. 

The workflow is explained within a set of slides [here](http://slides.com/olivierbarais/variability-modelling-and-model-driven-enginnering-a-tour-with-jhipster/).

#Software architecture teaching using JHipster
To understand JHipster, developer must be familiar with

* Maven, git jenkins
* Object-Relational Mapping (JPA and SpringDataJpa)
* Dependency Injection and Advanced Oriented Design (Spring Core)
* Http, Servlet and Rest architecture (Spring Rest)
* distributed development
* ...

The flip classroom will be a pretext to introduce these technologies and the software architecture principles. 


#Open discussions and course plan (to refine)
We would like to use JHipster for building flip classroom. 

The course outline can be the following. 

* Practical work 1. 

Discover JHipster through documentation. 

* Course 1. 

Maven, git jenkins

* Course 2. 

Object-Relational Mapping (JPA and SpringDataJpa)

* Course 3

Dependency Injection and Advanced Oriented Design (Spring Core)

* Course 4

Http, Servlet and Rest architecture (Spring Rest)

* Course 5

Aspect Oriented Programming (Spring AOP)

* Course 6

Model-Driven Engineering 

* Course 7

Generative programming (Xtend, Spoon)

* Course 8

Software Product Line and Variability Engineering

* Course 9

Software Language Egineering (Internal DSL, external DSL, (and AngularJS directives ))

* Course 10

Web Enginneering (AngularJS, Web app testing)

## Student must provide the follwing projects

* Project 1: Develop a complex app using JHipster

* Project 2: Create a subgenerator for Php synmfony, Android App, ... 


#Videos
I will provide a short video soon. 






 



