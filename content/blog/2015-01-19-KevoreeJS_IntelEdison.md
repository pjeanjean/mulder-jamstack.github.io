---
layout: blog-post
title: Install KevoreeJS on an Intel Edison
description: Just a doc to show how to install a debian wheezy on an Intel Edison and install KevoreeJS tooling
place: Rennes, France
categories: [kevoreejs, edison]
published: true
---
Just a doc to show how to install a debian wheezy on an Intel Edison and install KevoreeJS tooling.

<!--more-->


Just Install ubuntu on your edison following [this tutorial](https://learn.sparkfun.com/tutorials/loading-debian-ubilinux-on-the-edison?_ga=1.8189682.1772562117.1418888901#install-ubilinux)


Install debian in following this tuto
https://learn.sparkfun.com/tutorials/loading-debian-ubilinux-on-the-edison?_ga=1.8189682.1772562117.1418888901#install-ubilinux


When the Wifi work, you can do that

```bash
su
nano -w /etc/apt/sources.list
```

add the following line

*deb http://http.debian.net/debian wheezy-backports main*

```bash
apt-get update
apt-get upgrade

aptitude -t wheezy-backports install nodejs-dev

#refuse to keep like this and downgrade to 10.0.29 (First select No then Yes)

cd /tmp
wget --no-check-certificate https://www.npmjs.org/install.sh
echo insecure >> ~/.curlrc
sh install.sh

#check that everithing is ok
node --version
```

should display *v0.10.29*
```bash
npm --version
```
should display *2.2.0*

```bash
ln -s /usr/include/nodejs/src/ /usr/include/node
```


```bash
npm set strict-ssl false
```

next install mraa (a librarie for dealing with Arduino I/O. (documentation is [here](https://github.com/intel-iot-devkit/mraa))

```bash
npm -g install mraa
cd /tmp
wget --no-check-certificate https://raw.githubusercontent.com/intel-iot-devkit/mraa/master/examples/javascript/Blink-IO.js
node Blik-IO.js
```

The led should blink ;)

#

#To use kevroee JS

```bash
apt-get install sudo
adduser edison sudo
su edison
sudo chmod a+s /usr/bin/node
echo prefix = ~/.node >> ~/.npmrc
export PATH=$HOME/.node/bin:$PATH
export NODE_PATH=$NODE_PATH:/home/edison/.node/lib/node_modules/

npm install -g grunt
npm install -g grunt-cli
npm install -g bower
npm install -g generator-kevoree
yo kevoree
```

#Other tips
Create missing folder used in /etc/fstab
```bash
sudo mkdir /var/volatile
```

If you want to use typescript

```bash
npm install typescript -g
npm install tsd -g
```


to force the check fs after rebooting
```bash
sudo touch /forcefsck
sudo reboot
```


Add env variable in ~/.bashrc
```bash
echo prefix = ~/.node >> ~/.npmrc
export PATH=$HOME/.node/bin:$PATH
export NODE_PATH=$NODE_PATH:/home/edison/.node/lib/node_modules/
```

Add the follwing line in /etc/hosts (name of nodes)
```bash
127.0.0.1       ubilinux
```

Changing the hostname
```bash
nano -w /etc/hostname
```

Have fun, more docs are available on [http://www.kevoree.org](http://www.kevoree.org)
