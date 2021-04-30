---
layout: blog-post
title: Deploying openvpn on top of raspberry pi with docker
place: Rennes, France
categories: [docker,rpi,raspberrypi,raspberry]
published: true
---

With the emergence of cloud offers with arm based server, it is convenient to be able to deploy vpn server on top of these platforms. For example Scaleway is a simple, scalable cloud platform. It's the a platform where you can start x86 64bit and ARM BareMetal servers from a unique and simple graphical interface but also through API. Next you can use docker to deploy your micro-services. In this blog post, I just summarize how you can deploy your own openvpn server. 


<!--more-->

## Intialize the container

Pick a name for the $OVPN_DATA data volume container, it will be created automatically.

```bash
OVPN_DATA="ovpn-data"
```

Initialize the `$OVPN_DATA` container that will hold the configuration files and certificates

```bash
docker volume create --name $OVPN_DATA
docker run -v $OVPN_DATA:/etc/openvpn --rm giggio/openvpn-arm ovpn_genconfig -u udp://VPN.SERVERNAME.COM
docker run -v $OVPN_DATA:/etc/openvpn --rm -it giggio/openvpn-arm ovpn_initpki nopass
```


Start OpenVPN server process

```bash
docker run -v $OVPN_DATA:/etc/openvpn -d --name openvpn -p 1194:1194/udp --cap-add=NET_ADMIN giggio/openvpn-arm
```

Generate a client certificate without a passphrase

```bash
docker run -v $OVPN_DATA:/etc/openvpn --rm -it giggio/openvpn-arm easyrsa build-client-full CLIENTNAME nopass
```

Retrieve the client configuration with embedded certificates

```bash
docker run -v $OVPN_DATA:/etc/openvpn --rm giggio/openvpn-arm ovpn_getclient CLIENTNAME > CLIENTNAME.ovpn
```


## Running a Second Fallback TCP Container

### TCP vs. UDP - Pros & Cons

By default, OpenVPN is configured to use the UDP protocol. Because UDP incurs minimal protocol overhead (for example, no acknowledgment is required upon successful packet receipt), it can sometimes result in slightly faster throughput. However, in situations where VPN service is needed over an unreliable connection, the user experience can benefit from the extra diagnostic features of the TCP protocol.

As an example, users connecting from an airplane wifi network may experience high packet drop rates, where the error detection and sliding window control of TCP can more readily adjust to the inconsistent connection.

Another example would be trying to open a VPN connection from within a very restrictive network. In some cases port 1194, or even UDP traffic on any port, may be restricted by network policy. Because TCP traffic on port 443 is used for normal TLS (https) web browsing, it is very unlikely to be blocked.

Instead of choosing between UDP and TCP, you can use both. A single instance of OpenVPN can only listen for a single protocol on a single port, but this image makes it easy to run two instances simultaneously. After building, configuring, and starting a standard container listening for UDP traffic on 1194, you can start a second container listening for tcp traffic on port 443:

```bash
OVPN_DATA="ovpn-data"
docker run -v $OVPN_DATA:/etc/openvpn -d -p 443:1194/tcp --privileged giggio/openvpn-arm ovpn_run --proto tcp
```

ovpn_run will load all the values from the default config file, and --proto tcp will override the protocol setting.


This allows you to use UDP most of the time, but fall back to TCP on the rare occasion that you need it.

Note that you will need to configure client connections manually. At this time it is not possible to generate a client config that will automatically fall back to the TCP connection.


## Importing openvpn configuration in your linux client

Copy the generating ovpn file to your client. 

If you use network manager, you can import this configuration file. 

Open .ovpn file with a text editor.

And change lines that looks like


```
remote VPN.SERVERNAME.COM 1194  udp
```

to

```
remote VPN.SERVERNAME.COM 
port 1194 
proto udp
```


for connecting to tcp. 

And change it to 

```
remote VPN.SERVERNAME.COM
port 443
proto tcp
```

See [here](http://askubuntu.com/questions/760345/cannot-import-saved-openvpn-configuration-file-in-ubuntu-16-04-lts) for more information. 

## Doing the same for x64 processor

You can do exactly the same on X64 processor in replacing `giggio/openvpn-arm` with `kylemanna/openvpn`


## Source 

- [https://github.com/giggio/docker-openvpn-arm](https://github.com/giggio/docker-openvpn-arm)
- [https://github.com/kylemanna/docker-openvpn/blob/master/docs/tcp.md](https://github.com/kylemanna/docker-openvpn/blob/master/docs/tcp.md)
- [https://github.com/kylemanna/docker-openvpn/tree/master/docs](https://github.com/kylemanna/docker-openvpn/tree/master/docs)


