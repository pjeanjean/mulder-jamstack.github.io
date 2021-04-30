---
layout: blog-post
title: Play with Kevoree with your own model registry
place: Rennes, France
categories: [kevoree, javascript, java]
published: true
---

There are different reasons for using Kevoree with your own Kevoree model (default execution use [http://registry.kevoree.org](http://registry.kevoree.org)). The registry contains the model of existing kevoree artefacts (market place). Among the motivations to deploy your own registry, we can cite:

- the first one is to use Kevoree offline.
- the second one is to avoid the global registry deterioration.

<!--more-->

###Step 1: start your own registry

To deploy your own registry, first install docker on the machine where your want to deploy your registry.

next start your own registry.

```bash
docker run -it -p 8080:8080 -e CURL_REGISTRY=false kevoree/registry-replica
```

Next deploy the NodeType and components you need in your registry.

##Java kevoree artefacts

For example, if you want to use a JavaNode, clone the repository [https://github.com/kevoree/kevoree-library/](https://github.com/kevoree/kevoree-library/).



```bash
git clone https://github.com/kevoree/kevoree-library/
cd kevoree-library
mvn clean install
```

edit the pom.xml to change the registry url.

change

```xml
<properties>
  <publish.registry.url>http://registry.kevoree.org</publish.registry.url>
</properties>
```

to

```xml
<properties>
  <publish.registry.url>http://yourIP:8080</publish.registry.url>
</properties>
```

then deploy the model you need.

###Step 2.a: Publish the whole Java Library model in the registry

If you need all the standard library run

```bash
mvn kev:deploy
```

###Step 2.b: Publish an excerpt of Java Library model in the registry

If you need only the JavaNode, a group, the docker container and a simple channels for example, do.

```bash
cd java/org.kevoree.library.java.javaNode/
mvn kev:deploy
cd ../../java/org.kevoree.library.java.channels/
mvn kev:deploy
cd ../../java/org.kevoree.library.java.ws/
mvn kev:deploy
cd ../../java/org.kevoree.library.java.toys/
mvn kev:deploy
cd ../../cloud/org.kevoree.library.cloud.docker/
mvn kev:deploy
```


Now you can download a JavaNode [http://kevoree.org/download.html](http://kevoree.org/download.html) and run it .

```bash
java -Dkevoree.registry=http://IPOFYOURREGISTRY -Dversion=5.3.2-SNAPSHOT -Dkevoree.version=5.3.2-SNAPSHOT -jar ~/Téléchargements/org.kevoree.platform.standalone-5.3.2-20160128.112324-2.jar
```

Next you can open the [editor](http://editor.kevoree.org). In the settings tap (top right corner), set your registry IP. Next you can pull the model of your running model. Edit the model and push the new configuration.

You can of course start the node with a specific model and a specific node name.

```bash
java -Dnode.name=host -Dnode.bootstrap=docker.kevs  -Dkevoree.registry=http://IPOFYOURREGISTRY -Dversion=5.3.2-SNAPSHOT -Dkevoree.version=5.3.2-SNAPSHOT -jar ~/Téléchargements/org.kevoree.platform.standalone-5.3.2-20160128.112324-2.jar
```

Or start directly from the [watchdog](http://oss.sonatype.org/service/local/artifact/maven/redirect?r=public&g=org.kevoree.watchdog&a=org.kevoree.watchdog&v=RELEASE).

```bash
java -Dkevoree.registry=http://IPOFYOURREGISTRY  -jar ~/Téléchargements/org.kevoree.watchdog-0.27.jar 5.3.2-SNAPSHOT
```

You can of course start the node with a specific model and a specific node name.


```bash
java -Dnode.name=host -Dnode.bootstrap=docker.kevs -Dkevoree.registry=http://IPOFYOURREGISTRY  -jar ~/Téléchargements/org.kevoree.watchdog-0.27.jar 5.3.2-SNAPSHOT
```

## JavaScript kevoree artefacts

```bash
git clone --recursive git@github.com:kevoree/kevoree-js.git
cd kevoree-js
```

###Step 3: Publish the whole JavaScript Library model in the registry


next you can execute the following bash script

```bash
#!/bin/bash

function publish_comp {
    cd $1
    pwd
    git checkout master
    git pull
    npm i
    grunt publish --kevoree-registry-host=<IPOFYOURREGISTRY> --kevoree-registry-port=8080
    cd ..
}

publish_comp "runtimes/nodejs"
publish_comp "runtimes/browser"
publish_comp "libraries/chan/local"
publish_comp "libraries/chan/mqtt"
publish_comp "libraries/chan/remotews"
publish_comp "libraries/chan/ws"
publish_comp "libraries/group/remotews"
publish_comp "libraries/group/ws"
publish_comp "libraries/node/javascript"
publish_comp "libraries/comp/ticker"
publish_comp "libraries/comp/consoleprinter"
publish_comp "libraries/comp/msgsender"
```

Next you can download the runtime.

```bash
npm i -g kevoree-nodejs-runtime
```


and start this runtime.


```bash
KEVOREE_REGISTRY_HOST=<YOURREGISTRYHOST> KEVOREE_REGISTRY_PORT=9000 kevoreejs
```

You can also provide a specific node name and a specific model to bootstrap.

```bash
KEVOREE_REGISTRY_HOST=<YOURREGISTRYHOST> KEVOREE_REGISTRY_PORT=9000 kevoreejs --nodeName node0 --kevscript model.kevs
```

To ensure it works offline, provide an internal Maven repository, deploy your kevoree artefact in this repository and set your settings.xml to use this repository. For JavaScript, you can use [sinopia](https://www.npmjs.com/package/sinopia).

To install it, you can use the [docker image](https://registry.hub.docker.com/u/keyvanfatehi/sinopia/), or install it using npm.

```bash

# installation and starting (application will create default
# config in config.yaml you can edit later)
$ npm install -g sinopia
$ sinopia

# npm configuration
$ npm set registry http://localhost:4873/

# if you use HTTPS, add an appropriate CA information
# ("null" means get CA list from OS)
$ npm set ca null
```

next rerun the step 3 in adding a line to publish your kevoreejs artefact.

```bash
#!/bin/bash

function publish_comp {
    cd $1
    pwd
    git checkout master
    git pull
    npm i
    npm set registry http://localhost:4873/
    npm publish
    grunt publish --kevoree-registry-host=<IPOFYOURREGISTRY> --kevoree-registry-port=8080
    cd ..
}

publish_comp "runtimes/nodejs"
publish_comp "runtimes/browser"
publish_comp "libraries/chan/local"
publish_comp "libraries/chan/mqtt"
publish_comp "libraries/chan/remotews"
publish_comp "libraries/chan/ws"
publish_comp "libraries/group/remotews"
publish_comp "libraries/group/ws"
publish_comp "libraries/node/javascript"
publish_comp "libraries/comp/ticker"
publish_comp "libraries/comp/consoleprinter"
publish_comp "libraries/comp/msgsender"
```
