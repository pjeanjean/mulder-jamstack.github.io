---
layout: blog-post
title: Some tips for JHipster
description: Own servlet with JHipster
place: Rennes, France
categories: [jhipster]
published: true
---
I really like [JHipster project](http://jhipster.github.io/).
The server stack is clean and ready for production

* Spring Boot for easy application configuration
* Maven or Gradle configuration for building, testing and running the application
* "development" and "production" profiles (both for Maven and Gradle)
* Spring Security
* Spring MVC REST + Jackson
* Optional WebSocket support with Spring Websocket
* Spring Data JPA + Bean Validation
* Database updates with Liquibase
* MongoDB support if you'd rather use NoSQL instead of a classical relational database

Ready to go into production:
* Monitoring with Metrics
* Caching with ehcache (local cache) or hazelcast (distributed cache)
* Optional HTTP session clustering with hazelcast
* Optimized static resources (gzip filter, HTTP cache headers)
* Log management with Logback, configurable at runtime
* Connection pooling with HikariCP for optimum performance
* Builds a standard WAR file or an executable JAR file

and the client part is also clean

Single Web page application:

* Responsive Web Design
* HTML5 Boilerplate
* Twitter Bootstrap
* AngularJS
* Full internationalization support with Angular Translate
* Optional WebSocket support with Spring Websocket

With the great Yeoman development workflow:

* Easy installation of new JavaScript libraries with Bower
* Build, optimization and live reload with Grunt or Gulp.js
* Testing with Karma and PhantomJS

For me, it mainly misses some entity code generator that use [TypeScript](http://www.typescriptlang.org).

<!--more-->
#Tips for JHipster.

##Define your own servlet

If you want to add your own servlet. It is quite easy. In the *WebConfigurer* class and in the method *onStartup* you can easily add declare new servlets.

```java
servletContext.addServlet("foo"/*servlet name*/, MyServlet1.class /*servlet class*/);
servletContext.getServletRegistration("foo" /*servlet name*/).addMapping("/im/toto.png" /*servlet path*/);
```

Now you can add your servlet. In this example, it a servlet that plays with images to get only a part of a big image.

```java
package com.mycompany.myapp.web.rest;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class MyServlet1 extends HttpServlet  {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
      ServletContext cntx= getServletContext();
        // Get the absolute path of the image
        String filename =  cntx.getRealPath("/assets/images/hipster.png");
        // retrieve mimeType dynamically
        String mime = cntx.getMimeType(filename);
        if (mime == null) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
          return;
        }
        resp.setContentType(mime);
        File file = new File(filename);
        FileInputStream in = new FileInputStream(file);
        OutputStream out = resp.getOutputStream();
        BufferedImage bigImg = ImageIO.read(file);
        BufferedImage small = bigImg.getSubimage(0, 0,200, 200);

        // Copy the contents of the file to the output stream
         ByteArrayOutputStream baos = new ByteArrayOutputStream();
         ImageIO.write( small, "png", baos );
         baos.flush();
         byte[] imageInByte = baos.toByteArray();
       resp.setContentLength(imageInByte.length);
         out.write(imageInByte);
         out.close();
         in.close();
  }
}

```

##get the User which is currently logged in.
```java
userRepository.findOneByLogin(SecurityUtils.getCurrentLogin()).get();
```


##Use Hibernate to create the schema.
Sometimes, the use of liquidbase is a bit overkill especially at the beginning of a project if you just miss some attributes of your entities. In that case, you can let hibernate manage the database schema.

```
generate-ddl: true
 hibernate:
     ddl-auto: update

```

It does not really follow the JHipster philosophy but it is usefull when you create a new app from scratch.
