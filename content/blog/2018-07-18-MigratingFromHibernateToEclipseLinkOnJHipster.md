---
layout: blog-post
title: Migrating From Hibernate To EclipseLink On JHipster
place: Stockhoml, Sweden
categories: [JHipster,Hibernate,EclipseLink,Diversity]
toc: true
published: true
---
 

## Working on automatic library substitution.

We are currently working with Orange on a software diversification project. In this framework, we study the ability to automatically migrate a project from one dependency to another in order to understand the difficulties in practice. To understand these difficulties, we study a nominal case that should work perfectly. The replacement of an implementation of one JSR by another on a real project.

### What is JSR? 

The Java Community Process (JCP), established in 1998, is a formalized mechanism that allows interested parties to develop standard technical specifications for Java technology.  The JCP involves the use of Java Specification Requests (JSRs) – the formal documents that describe proposed specifications and technologies for adding to the Java platform. A JSR defines a common contract for a given concern in the Java community.

Among the JSRs, we study the use of the [JSR 338: JPA](https://jcp.org/en/jsr/detail?id=338). This JSR provides a common framework for relational database access using relational object mapping techniques in Java. Many libraries implement this JSR including the famous [hibernate](http://hibernate.org/) library or the no less known [eclipselink](http://www.eclipse.org/eclipselink/). On top of this API, higher level libraries like [Spring-data](http://projects.spring.io/spring-data/) have been built and are commonly used in enterprise projects.

From this common contract, the promise is to be able to change implementation at relatively low cost.

**Let us have a look at the reality**

<!--more-->


To get a project that use spring-data, we start using [JHipster](https://www.jhipster.tech/) code generator. JHipster is a development platform to generate, develop and deploy Spring Boot + Angular/React Web applications and Spring microservices.  The goal is to generate for you a complete and modern Web app or microservice architecture, unifying:

- A high-performance and robust Java stack on the server side with Spring Boot
- A sleek, modern, mobile-first front-end with Angular, React and Bootstrap
- A robust microservice architecture with the JHipster Registry, Netflix OSS, the ELK stack and Docker
- A powerful workflow to build your application with Yeoman, Webpack and Maven/Gradle


We generate an application for employees management that are based on a domain model with 9 entities. You can find the model [here](https://start.jhipster.tech/jdl-studio/) 

We generate the app and we try to do the migration. Let us have a look on the manual operation to do to get a working application. 

## Step 1 Change your dependencies

By default, *spring-boot-starter-data-jpa* uses hibernate. 

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

In your pom.xml, we have to exclude 

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
  <exclusions>
    <exclusion>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-entitymanager</artifactId>
    </exclusion>
    <exclusion>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-core</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

Same thing for hibernate-envers used for versionning entities. 

```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-envers</artifactId>
</dependency>
```

In your pom.xml, we have to exclude 


```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-envers</artifactId>
    <exclusions>
      <exclusion>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-entitymanager</artifactId>
      </exclusion>
      <exclusion>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-core</artifactId>
      </exclusion>
    </exclusions>
</dependency>
```


Next, you have to include eclipselink dependencies

You can add the following dependencies

```xml
<dependency>
  <groupId>org.eclipse.persistence</groupId>
  <artifactId>org.eclipse.persistence.jpa</artifactId>
  <version>2.7.2</version>
</dependency>
<dependency>
  <groupId>org.eclipse.persistence</groupId>
  <artifactId>org.eclipse.persistence.core</artifactId>
  <version>2.7.2</version>
</dependency>
<dependency>
  <groupId>org.eclipse.persistence</groupId>
  <artifactId>eclipselink</artifactId>
  <version>2.7.2</version>
</dependency>
```


## Step 2: Change the configuration for eclipselink


In order to use eclipselink, several configurations have to be change. 


### 2.1. In the pom.xml


We have to use specific code generator for eclipselink. Comment in plugin section

```xml
<!-- For JPA static metamodel generation -->
      <!--   <path>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-jpamodelgen</artifactId>
            <version>${hibernate.version}</version>
        </path> -->
```

And in the build -> plugin section add the following plugin. Do not forget to adapt the *basePackage* property for your project

```xml
<plugin>
  <groupId>com.ethlo.persistence.tools</groupId>
  <artifactId>eclipselink-maven-plugin</artifactId>
  <version>2.7.1.1</version>
  <executions>
    <execution>
      <id>weave</id>
      <phase>process-classes</phase>
      <goals>
        <goal>weave</goal>
      </goals>
    </execution>
    <execution>
      <id>modelgen</id>
      <phase>generate-sources</phase>
      <goals>
        <goal>modelgen</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <basePackages>
      <basePackage>fr.irisa.demo</basePackage>
    </basePackages>
  </configuration>
</plugin>
```        

### 2.2. In you application Java config package

Add the following class:
 
```java

package fr.irisa.demo.config;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.JpaBaseConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.autoconfigure.transaction.TransactionManagerCustomizers;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.jta.JtaTransactionManager;

@Configuration
public class EclipseLinkJpaConfiguration extends JpaBaseConfiguration { 

	@Autowired
	protected EclipseLinkJpaConfiguration(DataSource dataSource, JpaProperties properties,
			ObjectProvider<JtaTransactionManager> jtaTransactionManagerProvider,
			ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
		super(dataSource, properties, jtaTransactionManagerProvider, transactionManagerCustomizers);
	}



    @Override
    protected Map<String, Object> getVendorProperties() {
        HashMap<String, Object> map = new HashMap<>();
        map.put(PersistenceUnitProperties.WEAVING, "static");
        map.put(PersistenceUnitProperties.DDL_GENERATION, "none");
        return map;
    }
    
	@Override
    protected AbstractJpaVendorAdapter createJpaVendorAdapter() { 
        return new EclipseLinkJpaVendorAdapter(); 
    }
}

```

### 2.3. In your spring boot configuration file

In your spring-boot configuration file (application-dev for jhipster sample), replace

```yaml
jpa:
    database-platform: org.hibernate.dialect.MySQL5InnoDBDialect
    database: MYSQL
    show-sql: true
    properties:
        hibernate.id.new_generator_mappings: true
        hibernate.cache.use_second_level_cache: false
        hibernate.cache.use_query_cache: false
        hibernate.generate_statistics: true
```

with 

```yaml
jpa:
    database-platform: org.eclipse.persistence.platform.database.MySQLPlatform
    database: MYSQL
    show-sql: true
    properties:
        eclipselink.target-database: MySQL
        eclipselink.weaving: static
```


## Step 3: When magic disapear

So far, these changes seem normal. The update of the dependencies, tools and configuration of the persistence provider is planned as part of the JSR. But uncloupling is  not magic. 


### Problem 1: Coupling between real implementation of different concerns


JHipster as a real project tries to improve the perfomance. They use a library nammed *jackson-datatype-hibernate*.  This project support JSON serialization and deserialization of Hibernate (http://hibernate.org) specific datatypes and properties; especially lazy-loading aspects. As we will not use hibernate, we must remove the depencies in the *pom.xml* file. 

```xml
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-hibernate5</artifactId>
</dependency>
```

And remove  the use of this module. You can just remove the following line in *in config.JacksonConfiguration.java*

```java
@Bean
public Hibernate5Module hibernate5Module() {
    return new Hibernate5Module();
}
```

### Problem 2: Uncomplete common interface between Hibernate and EclipseLink


Second, current JSR remains unperfect and some annotation such as *org.hibernate.annotations.BatchSize* is not part of the JSR. Each persistence provider uses its own annotation;

```java
@BatchSize(size = 20)
```

should be changed to 

```java
import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.QueryHints;

 @QueryHint(name=QueryHints.BATCH_SIZE, value="20");
```


### Problem 3: The famous  [Hyrum's law](http://www.hyrumslaw.com/)

![](https://imgs.xkcd.com/comics/workflow.png)
> from [xkcd](https://xkcd.com/1172/)

### 3.1 java.util.time.Instant case

Since  JAVA 8, the new date and time API (JSR 310) has been introduced. It creates some types such as *java.util.time.Instant*. An Instant represents a point in time (similar to java.util.Date) with nanoseconds precision. 

The automatic mapping between **Instant** and **java.sql.Timestamp** is not part of the JSR.  Please refer to this [discussion](https://stackoverflow.com/questions/49309076/why-jpa-does-not-support-java-time-instant). 

As hibernate 5 supports this mapping, lots of developers use Instant type but it does not work with other persistence provide. 

As a result in your project, you must refactor your code as follow. 

In **AbstractAuditingEntity.java**

**Refactoring 1**

```java
private Instant createdDate =  Instant.now();
```

->

```java
private Timestamp createdDate =  Timestamp.from(Instant.now());
```
**Refactoring 2**

```java
private Instant lastModifiedDate =  Instant.now();
```

->

```java
private Timestamp lastModifiedDate =  Timestamp.from(Instant.now());
```


**Refactoring 3**

```java
public Instant getCreatedDate() {
    return createdDate.toInstant();
}

public void setCreatedDate(Instant createdDate) {
    this.createdDate = createdDate;
}

```


-> 

```java
public Instant getCreatedDate() {
  if (createdDate!= null)
  return createdDate.toInstant();
  else return null;

}

public void setCreatedDate(Instant createdDate) {
    this.createdDate =  Timestamp.from(createdDate);
}
```

**Refactoring 4**

```java
public Instant getLastModifiedDate() {
    return lastModifiedDate;
}

public void setLastModifiedDate(Instant lastModifiedDate) {
    this.lastModifiedDate = lastModifiedDate;
}
```
    
-> 



```java
public Instant getLastModifiedDate() {
  if (lastModifiedDate!= null)
  return lastModifiedDate.toInstant();
  else return null;
}

public void setLastModifiedDate(Instant lastModifiedDate) {
    this.lastModifiedDate =  Timestamp.from(lastModifiedDate);
}
```


In PersistentAuditEvent.java

**Refactoring 5**


```java
private Instant auditEventDate;
```

->

```java
private Timestamp auditEventDate;
```


**Refactoring 6**



```java
public Instant getAuditEventDate() {
    return auditEventDate;
}

public void setAuditEventDate(Instant auditEventDate) {
    this.auditEventDate = auditEventDate;
}
```

->
    
```java
public Instant getAuditEventDate() {
  if (auditEventDate != null)
    return auditEventDate.toInstant();
  else
    return null;
}

public void setAuditEventDate(Instant auditEventDate) {
  this.auditEventDate = Timestamp.from(auditEventDate);
}

```

### 3.2 The method *flush* case

In each **serviceImpl** class for each domain class, developer does not flush the entiry after saving a new entity. 

It raises the following null pointer problem. Developer saves their entity and getId of the entity. 

```java
  RegionDTO result = regionService.save(regionDTO);
  return ResponseEntity.created(new URI("/api/regions/" + result.getId()))
      .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
      .body(result);

```

In **regionService.save(regionDTO);**, it calls the following code. 

```java
@Override
public RegionDTO save(RegionDTO regionDTO) {
    log.debug("Request to save Region : {}", regionDTO);
    Region region = regionMapper.toEntity(regionDTO);
    //save the entity to the database and get a new entity managed by the peristence provider
    region = regionRepository.save(region);
    //Transform the result to the dto. 
    return regionMapper.toDto(region);
}
```

This code works for Hibernate as hibernate automatically flushes the entity on save. This is not the case in the standard as discussed in [this discussion](https://stackoverflow.com/questions/9732453/jpa-returning-an-auto-generated-id-after-persist). 

As a result, you must refactor your code in that way for each serviceImpl. 

```java
@Override
public RegionDTO save(RegionDTO regionDTO) {
    log.debug("Request to save Region : {}", regionDTO);
    Region region = regionMapper.toEntity(regionDTO);
    //save the entity to the database and get a new entity managed by the peristence provider
    region = regionRepository.save(region);
    regionRepository.flush();
    //Transform the result to the dto. 
    return regionMapper.toDto(region);
}
```

## Lesson learnt

From this first experience, we draw several conclusions:
- First, even with an effort to define a common interface, substitutability cannot be limited to an evolution of the configuration (It cannot be limited to just change the pom.xml). 
- The tests are necessary. Problems related to [Hyrum's law](http://www.hyrumslaw.com/) are only detectable at runtime. 
- Evolution such as the transition from Java 7 to Java 8 tend to break substitutability.
- The automation of substitutability remains possible and easy to implement once these difficulties are discovered.


