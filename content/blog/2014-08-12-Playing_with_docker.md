---
layout: blog-post
title: Running a DHT (ETCD) in a cluster using docker
description:  Playing with docker and etcd
place: Rennes, France
categories: [docker]
published: true
---
I am just playing using docker and etcd. 

To create a distributed dht within a cluster using etcd and docker. I create a container based on ubuntu. I just add the go language git and etcd. If you want to play with it you can pul it

```bash
docker pull barais/etcd
```

and start your three containers. 

```bash
sudo docker run -p 4001:4001 -p 7001:7001 -t -i barais/etcd   /etcd/bin/etcd -peer-addr 172.17.42.1:7001 -addr 172.17.42.1:4001  -data-dir machines/machine1 -name machine

sudo docker run -p 4002:4002 -p 7002:7002 -t -i barais/etcd   /etcd/bin/etcd -peer-addr 172.17.42.1:7002 -addr 172.17.42.1:4002  -peers 172.17.42.1:7001,172.17.42.1:7003 -data-dir machines/machine2 -name machine2

sudo docker run -p 4003:4003 -p 7003:7003 -t -i barais/etcd   /etcd/bin/etcd  -peer-addr 172.17.42.1:7003 -addr 172.17.42.1:4003 -peers 172.17.42.1:7001,172.17.42.1:7002 -data-dir machines/machine3 -name machine3
```

Next step: doing the same thing using [kubernetes](https://github.com/GoogleCloudPlatform/kubernetes).

To follow ...
