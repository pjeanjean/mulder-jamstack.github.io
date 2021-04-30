---
layout: blog-post
title: Using Go-Docker and Docker Swarm to create a  high-volume live and on demand video encoding solutions
place: Rennes, France
categories: [docker, swarm, go-docker]
published: true
---

The idea is to propose an initial solution to securely manages high-volume live and on demand video encoding solutions in
combination with the scale and elasticity of the cloud. The providing service will automatically provisions and dynamically scales docker instances, and can seamlessly integrate those resources with on site infrastructure to instantly expand video processing capacity. This flexibility enables video providers to rapidly enhance multiscreen video offerings, grow audiences, generate greater revenues, and decrease capital expenses.

<!--more-->

In this example, we will build an initial proof of concept for video encoding using [go-docker](http://www.genouest.org/godocker/), [docker swarm](https://docs.docker.com/swarm/), [cAdvisor](https://github.com/google/cadvisor), [grafana](http://grafana.org/) and [influxDB](https://influxdb.com/). 

#Step 1: Docker swarm installation

You can follow this tutorial
[docker swarm installation](https://docs.docker.com/swarm/install-manual/)

To summary

```bash
docker pull swarm
docker run --rm swarm create
> 7c99516aee4662826684dde48f60361f
#get the id. Replace in the next commands
```

Next join the swarm (replace the token in the following commands):

```bash
docker run -d swarm join --addr=172.17.0.1:2375 token://7c99516aee4662826684dde48f60361f
```

Finally launch the manager

```bash
docker run -d -p 2378:2375 swarm manage token://7c99516aee4662826684dde48f60361f
```

check it works. 

```bash
docker -H tcp://localhost:2378 info
```

You should get something like that

```bash
78 info
Containers: 104
Images: 37
Role: primary
Strategy: spread
Filters: health, port, dependency, affinity, constraint
Nodes: 1
 head-demo: 172.17.0.1:2375
  └ Containers: 104
  └ Reserved CPUs: 4 / 4
  └ Reserved Memory: 4 GiB / 16.35 GiB
  └ Labels: executiondriver=native-0.2, kernelversion=4.2.0-18-generic, operatingsystem=Ubuntu 15.10, storagedriver=overlay
CPUs: 4
Total Memory: 16.35 GiB
Name: 0a478e14e47e
```

#Step 2 Install go-docker


##Requirements

Mongodb and Redis are required. Either install them on a server, or get them in containers:

Run god-mongo god-redis. 


```bash
docker rm god-mongo god-redis god-web
docker -H localhost:2378  run --name god-mongo -d mongo
docker -H localhost:2378  run --name god-redis -d redis
```

## Running components
Run the web server, interface is reachable at http://localhost:6543

Get the following config file

- [go-d.ini](../../../docs/godocker/go-d.ini)
- [production.ini](../../../docs/godocker/production.ini)

Warning: data shared directory (here /opt/godshared) must match
on host AND container as final job will end in a host container needing the same volume directory.
shared_dir parameter in go-d.ini configuration file must be changed accordingly.


```bash
mkdir /opt/godshared
mkdir /tmp/vid
```

```bash
docker -H localhost:2378  run \
  --rm \
  --name god-web
  --link god-mongo:god-mongo  \
  --link god-redis:god-redis  \
  -v /opt/godshared:/opt/godshared \
  -v path_to/go-d.ini:/opt/go-docker/go-d.ini \
  -v path_to/production.ini:/opt/go-docker-web/production.ini \
  -p 6543:6543 \
  -e "PYRAMID_ENV=prod" \
  osallou/go-docker \
  gunicorn -p godweb.pid --log-config=/opt/go-docker-web/production.ini --paste /opt/go-docker-web/production.ini
```

The first time only, you must initialize db etc...

```bash
docker -H localhost:2378 run \
--link god-mongo:god-mongo \
--link god-redis:god-redis \
-v /opt/godshared:/opt/godshared \
-v path_to/go-d.ini:/opt/go-docker/go-d.ini \
 --rm \
 osallou/go-docker \
 /usr/bin/python go-d-scheduler.py init
```

Run one scheduler

```bash
docker -H  localhost:2378 run \
  --rm \
  --link god-mongo:god-mongo  \
  --link god-redis:god-redis  \
  --link god-web:god-web \
  -v /opt/godshared:/opt/godshared \
  -v path_to/go-d.ini:/opt/go-docker/go-d.ini \
  osallou/go-docker \
  /usr/bin/python go-d-scheduler.py run
```


Run one or many watchers (1 is enough test or medium size production)

```bash
docker -H localhost:2378  run \
  --rm \
  --link god-mongo:god-mongo  \
  --link god-redis:god-redis  \
  --link god-web:god-web \
  -v /opt/godshared:/opt/godshared \
  -v path_to/go-d.ini:/opt/go-docker/go-d.ini \
  osallou/go-docker \
  /usr/bin/python go-d-watcher.py run
```

#Step 3 Create and schedule tasks



Install godocker cli.
```bash
pip install godocker_cli
```

Configure your go-docker

Go to http://localhost:6543/
In the project, create a project test and add godocker as a member and add a share folder /tmp/vid video volume. 


<a href="../../../docs/godocker/image.png"><img src="../../../docs/godocker/image.png"  width="750" /></a>

Next go to the godocker (top right) link. 
and get the APIKEY


```bash
~/.local/bin/godlogin -a <APIKEY> -l godocker -s http://localhost:6543/ --no-certificate
```

```bash
cd /tmp/vid
mkdir /tmp
wget http://arcagenis.org/mirror/mango/ToS/tears_of_steel_1080p.mkv
```

Next download the two following scripts

- [split.sh](../../../docs/godocker/split.sh)
- [mergeandclean.sh](../../../docs/godocker/mergeandclean.sh)


Run the followind three command

```bash
SPLIT=`~/.local/bin/godjob create  --external_image    -n split -d "Jit Split"   -p test -i barais/ffmpeg -s split.sh | sed -r 's/Task added. Job id is //g'`


for f in /tmp/vid/tmp/*.sh; do echo "`~/.local/bin/godjob create  --external_image    -n encode -d "Jit Encode" -c 1 --parent "$SPLIT"  -p test -i barais/ffmpeg -s $f | sed -r 's/Task added. Job id is //g'`," >> /tmp/vid/tmp/listprocess  ; done && PROCESS=`cat  /tmp/vid/tmp/listprocess | tr -d '\n'`


~/.local/bin/godjob create  --external_image    -n merge -d "Jit Merge and Clean"  -c 1 --parent "${PROCESS-1}" -p test -i barais/ffmpeg -s mergeandclean.sh

```

You can also run everythin in one command

```bash
mkdir /tmp/vid/tmp && SPLIT=`~/.local/bin/godjob create  --external_image    -n split -d "Jit Split"   -p test -i barais/ffmpeg -s split.sh | sed -r 's/Task added. Job id is //g'` && for f in /tmp/vid/tmp/*.sh; do echo "`~/.local/bin/godjob create  --external_image    -n encode -d "Jit Encode" -c 1 --parent "$SPLIT"  -p test -i barais/ffmpeg -s $f | sed -r 's/Task added. Job id is //g'`," >> /tmp/vid/tmp/listprocess  ; done && PROCESS=`cat  /tmp/vid/tmp/listprocess | tr -d '\n'` ~/.local/bin/godjob create  --external_image    -n merge -d "Jit Merge and Clean"  -c 1 --parent "${PROCESS-1}" -p test -i barais/ffmpeg -s mergeandclean.sh
```

Next you can easily install cAdvisor and grafana. Just modify to go-d.ini file. 


#Next steps


##Technical details

- Use go-docker env variables to encode in a task specific folder. 
- Use [glusterfs](http://www.gluster.org/) to share volumes and compare the performance with the use of a simple nfs filse system. Does it matter for such a use case. 
- Decrease docker ffmpeg image size.
- Finish a small portable demonstrator based on four raspberry pis 2 (within this [box](http://www.ldlc.com/fiche/PB00168033.html)).  
- Do the same experience with [mozilla taskcluster](https://tools.taskcluster.net/) to compare with go-docker. 


##Scientific Breakthroughs

- Allow to share hardware capabilities such as GPU encoding facilities with go-docker. 
- Define a standard librairies of video processing micro-services. 
- Provide dataflow tempate to let user specify video processing flows. (We will use [node-red](http://nodered.org/) to test). 
- Provide an extenstible framework for creating and testing video processing micro-services that can be easily included in a video-processing flows. 
- Improve or specialize docker scheduler such as swarm, [nomad](https://hashicorp.com/blog/nomad.html) or [mesos](http://mesos.apache.org/) to put video processing micro-services close to video raw datas. 
- Use the best hardware storage technologies depending of the micro-services wich is used.

##Want to play with us
- Join [B-COM](https://b-com.com/) JiT project. [contact](mailto:Christophe.DION@b-com.com;Antoine.CABOT@b-com.com;barais@irisa.fr)


Have fun ...

