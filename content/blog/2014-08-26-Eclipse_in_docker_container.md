---
layout: blog-post
title: Tips for starting any X11 apps (e.g. eclipse) in a docker container from a linux host
description: Just a tips for starting any X11 apps (e.g. eclipse) in a docker container from a linux host
place: Rennes, France
categories: [docker, eclipse]
published: true
---
Just a tips for starting any X11 apps (e.g. eclipse) in a docker container from a linux host

<!--more-->


```bash
docker run -i -t -e DISPLAY=unix$DISPLAY -v=/tmp/.X11-unix:/tmp/.X11-unix:rw barais/eclipse-xtend /eclipse/eclipse
```

Do not forget to let external app to connect to X.

```bash
xhost + # for lazy reckless idiot (as me)
#For others
xhost +local:`docker inspect --format='{{ .Config.Hostname }}' $containerId`
```

Next you can restart your container using:

```bash
xhost +local:`docker inspect --format='{{ .Config.Hostname }}' $containerId`
docker start $containerId
```

To start google chrome

```bash
docker run -i -t -e DISPLAY=unix$DISPLAY -v=/tmp/.X11-unix:/tmp/.X11-unix:rw barais/browser google-chrome --disable-setuid-sandbox --user-data-dir=/tmp
```

To start firefox

```bash
docker run -i -t -e DISPLAY=unix$DISPLAY -v=/tmp/.X11-unix:/tmp/.X11-unix:rw barais/browser firefox
```

I think that I have to test that for teaching or tutorials...
