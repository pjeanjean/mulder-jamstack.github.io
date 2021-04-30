---
layout: blog-post
title: Integration api-platform and angularjs 2
place: Rennes, France
categories: [api-platform,symfony3,angularjs,ng2,angularjs2]
published: true
---

Even if I prefer to use [Spring Boot](https://projects.spring.io/spring-boot/) as a basis for the the server stack and [JHipster](https://jhipster.github.io/) to generate the apps skeleton, I often have to use [Php](http://php.net/manual/fr/intro-whatis.php) framework for students projects. 
This blog post explains how you can integrate [api-platform](https://api-platform.com/), 
a PHP framework to build modern web APIs built on top [symfony 3](https://symfony.com/), 
and [angularJS 2](https://angular.io/) with [angular cli](https://cli.angular.io/) 
for building Single Page Application.


<!--more-->

A new kind of web application is now suggested, we call it "*the Rise of Single Page Applications (SPA)*"

This [article](https://dzone.com/articles/architectural-shift-in-web-applications-with-emerg) explains this new trend and the furture evolution. The three following paragraphs just explain this new architecture. 

> *We woke up to new era of AJAX with the overnight success of applications like Gmail and Google Maps, where refreshing the entire page became a thing of the past. Applications were now designed to request only the necessary bits and pieces (partial responses) of content and information as needed to create highly interactive user experiences using Thin Clients that up until now were only possible using Thick Clients. The additional logic required to do this on the client side wasn’t anything dramatically new — it was almost the same thing that had been previously used in the Server Web Layer. We essentially moved the Web Layer from the server to the client (Web Browser).*

> *However, this additional logic on the client side brought about new challenges and complexities, such as having to deal with numerous XMLHttpRequests and understand the web browser’s DOM (Document Object Model) at a much deeper level than ever before necessary. To handle this added complexity many new JavaScript based frameworks emerged to handle low-level details and routine actions. Some frameworks are opinionated and some are not; some are bare bones and some are end-to-end solutions. And while it seemed like a new framework was appearing every other day, the good ones were all leveraging the same best practices and patterns that had been previously used with success in the Server Web Layer including Components, MVC (Model, View and Controller), Annotations, Dependency Injection, Services and Contracts by Interfaces etc.*

> *Since the Web Layer was removed from the Server Layer and moved to the Client Layer, a new thin layer was introduced to the Server Layer in order to expose the existing Server Business Layer directly to the new Client Web Layer. This was most frequently done using custom SOAP or REST APIs. The creation of these APIs and the architectural shift in the placement of the Web Layer paved the way to support functionalities like off-line support, but more importantly, the ability to support multiple client types, even those with different native implementations, using the same back end (think of a single backend powering iOS and Android apps, as well as desktop and mobile Web interfaces).*

To follow this architecture, we could easily combine [api-platform](https://api-platform.com/), a PHP framework to build modern web APIs built on top [symfony 3](https://symfony.com/), and [angularJS 2](https://angular.io/) for building Single Page Application. 

# Step 1: Get the tooling. 

1. Install [nodejs](https://nodejs.org/en/).
2. Install php7
3. Install [angular-cli](https://angular.io/)


```bash
npm install -g angular-cli
```

# Step 2: Get and configure api platform. 

You can start from the demo app.

Clone the repo

```bash
git clone https://github.com/api-platform/demo
```

Go in the folder

```bash
cd demo
```

## Install composer

Composer is equivalent to maven or npm for the PhP community. It is a Dependency Manager for PHP.

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
```

Install dependencies required by api-platform (symfony3, doctrine, ...)

```bash
php composer.phar install
```

## Create the database
Next you can configure the connexion to the the database. 

```bash
bin/console doctrine:database:create
```

Create your object model in src/AppBundle/Entity. The demo app comes with two entities (Book and Review for the demo). 

```bash
bin/console doctrine:schema:create 
```

Check that your database has been created. 


## Update the routing
In the app/config/routing.yml add a prefix for your apu, it can be somethings like that. 

```
api:
    resource: '.'
    type:     'api_platform'
    prefix:   '/api'  # This line can be added
```

## Start the server

Next, you can start the server in doing. 

```bash
bin/console server:start # for starting the server
bin/console server stop # for stopping the server
```

## Check that your application is running
Go to [http://localhost:8000/api](http://localhost:8000/api).

You can see the swagger interface. 

When you modify your business object model, you can update the schema

```bash
bin/console doctrine:schema:update --force 
```

The [swagger](http://swagger.io/) interface is automatically up to date if you modify your entities. 


# Prepare the frontend
For preparing the front end, we will use angularjs2 and angular-cli. 

```bash
ng new frontend
```

Next, let a process that watches your typescript file and generate the web application. 

```bash
cd frontend
ng build -w --base-href front --sourcemap true --output-path ../web/front
```


In an other console come back to the root of your project and restart the server. 

```bash
bin/console server:start # for starting the server
bin/console server stop # for stopping the server
```

Go to [http://localhost:8000/api](http://localhost:8000/api) you will get swagger
Go to [http://localhost:8000/front](http://localhost:8000/front) you will get your frontend

Open you visual code studio editor in the root of your project. 


Next you can read the doc of open platform and read the doc of angular2 to integrate some widgets. 

### api-platform
- [documentation](https://api-platform.com/docs/)

### angular js 2
- [Official documentation](https://angular.io/docs/ts/latest/)
- [courses](https://github.com/AngularClass/awesome-angular2)
- [great widgets](http://www.primefaces.org/primeng/)
- [bootstrap ng2 components](https://github.com/valor-software/ng2-bootstrap)
- [great book](https://books.ninja-squad.com/angular)

Enjoy!

# Deploy your application with apache

Stop the server and the ng build process. 

In the frontend folder, run the following command to  build the web application for the production. 

```bash
rm -rf ../web/front
ng build --base-href front --sourcemap true --output-path ../web/front --target=production
```

And configure apache to serve your web folder of your project or copy it where you want to deploy your app. 
If you have to change your database parameters, do not forget to update your app/config/parameters.yml.


# Conclusion
Great you will have now this great architecture. 
Next blog posts will show, how you can easily integrate ng2 and primefaces components for the frontend and how you can manage RBAC rules and authentifications for such an application. 

<img src="https://api-platform.com/dist/e89da8a0f3ea2c3e006fb5328246624c.png" alt="arch" style="width: 800px;"/>

