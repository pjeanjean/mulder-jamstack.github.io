---
layout: blog-post
title: Using Kevoree to drive Docker
description: Just a doc to show how you can drive docker using Kevoree Models@runtime frmaework
place: Rennes, France
categories: [docker, kevoree]
published: true
---
Just a doc to show how you can drive docker using Kevoree Models@runtime frmaework. 

<!--more-->


Just download the kevoree watchdog from [here](http://oss.sonatype.org/service/local/artifact/maven/redirect?r=public&g=org.kevoree.watchdog&a=org.kevoree.watchdog&v=RELEASE)

Download the followinf kev script file [docker.kevs](../../../docs/docker.kevoree.kevs)

This file contains the following configuration for your distributed deployement, currently just deploying an nginx docker container. 

```bash
add host : DockerNode/5.1.0
add host.nginx : DockerNode/5.1.0
add sync : WSGroup/5.1.0

attach host sync

set host.commitRepo = 'heads'
set host.nginx.image = 'nginx'
set sync.master = 'host'

```

Next, you can run the watchdog
```bash
java -Dnode.name=host -Dnode.bootstrap=docker.kevoree.kevs  -jar org.kevoree.watchdog-0.27.jar 5.1.0 
```


Next, you can open the running model from the [kevoree editor](http://editor.kevoree.org).

File -> open from Node -> Pull model

From the editor, you can integrate other docker nodes in the model in setting the name of the docker image and the parameters of the current images. 

It also exists some docker images for Kevoree Java platform and Kevoree NodeJs platform to reconfigure the apps inside the containers. [https://registry.hub.docker.com/repos/kevoree/](https://registry.hub.docker.com/repos/kevoree/)

Have fun, more docs are available on [http://www.kevoree.org](http://www.kevoree.org)

