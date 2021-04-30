---
layout: blog-post
title: Playing with docker and opendaylight
description:  A short blog post to share my experience in playing with opendaylight and docker
place: Rennes, France
categories: [sdn, opendaylight, docker]
published: true
---


Currently there is no native integration of Open vSwitch in Docker, i.e., one cannot use the Docker client to automatically add a container's network interface to an Open vSwitch bridge during the creation of the container. However the last version of ovs provides a utility to use ovs with docker. As ovs support openflow 1.3. It provides a greate playground for practical work combining opendaylight, docker and ovs. 


<!--more-->

#Step 0 Installation

First install one of the last version of [ovs](http://openvswitch.org/download/).

Next install [docker](https://www.docker.com/)

```bash
#Install ovs-docker as root
cd /usr/bin
wget https://raw.githubusercontent.com/openvswitch/ovs/master/utilities/ovs-docker
chmod a+rwx ovs-docker
```

#Step 1 Docker and Openvswitch

Manually create a first bridge to test. 

```bash
#Create your bridge
ovs-vsctl add-br ovs-br1            # create a bridge named 'ovs-br1'
ovs-vsctl add-port ovs-br1 eth0     # attach eth0 to ovs-br1
ifconfig ovs-br1 173.16.1.1 netmask 255.255.255.0 up
```

Start two containers in different consoles

```bash
docker run -t -i --name container1 ubuntu /bin/bash
docker run -t -i --name container2 ubuntu /bin/bash
```

Add a port to this docker

```bash
ovs-docker add-port ovs-br1 eth1 container1 173.16.1.2/24
ovs-docker add-port ovs-br1 eth1 container2 173.16.1.3/24
```

Play to ping your containers. 

#Step 2 Openvswitch and opendaylight

Start opendaylight. 

You can follow this [tutorial](https://wiki.opendaylight.org/view/OpenDaylight_Controller:MD-SAL:Startup_Project_Archetype#Part_2_-_Hello_World_-_Defining_a_Simple_RPC) to learn how to develop a plugin for opendaylight. 



get opendaylight

Check you use Java 7.

```bash
 git clone -b release/helium-sr2 https://git.opendaylight.org/gerrit/p/integration.git helium-integ-pristin	
cd  helium-integ-pristin
mvn clean install -DskipTests

cd distributions/extra/karaf/target/assembly/
./karaf
```


In karaf console, install the following feature

```bash
feature:install odl-openflowplugin-all
```

Next in another console

Set Controller (opendaylight ip)

```bash
export ip=127.0.0.1
export port=6633
ovs-vsctl set-controller ovs-br0 tcp:$ip:$port
#Verify Connection
 ovs-vsctl list controller        # verify that it's actively connected
```

Connect to [dlux]( http://localhost:9000/DLUX/index.html) and check you can see your containers. 


#Step 3 Create your own learning switch to connect your container

```bash
git clone -b release/helium-sr2 https://git.opendaylight.org/gerrit/p/openflowplugin.git openflowplugin
cd openflowplugin/samples/learning-switch
mvn clean install -DskipTests
```



create a ping between your two docker containers. 

It will not work. 

in Karak console, install your learning switch. 

```bash
install file://yourpath/openflowplugin/samples/learning-switch/target/learning-switch-0.0.5-Helium-SR2.jar
start bundlenumber
```

Now ping should work. 
#Step 4 Build your own multi-tenant apps with a clear network isolation. 

The goal in this task is to create a vswitch per tenant to clearly isolate your apps. 

We will use [Kevoree](http://www.kevoree.org) and [Occi](http://www.occiware.org/bin/view/Main/) to deploy container and get an abstraction of the configuration. 


#Step 5 Use opendaylight to create routes between distributed container

Coming soon ...
