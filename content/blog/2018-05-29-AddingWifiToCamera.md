---
layout: blog-post
title: Add wifi to any camera
place: Rennes, France
categories: [OpenWRT,Camera,Canon]
published: true
---


I have an old camera that makes very nice pictures (CANON EOS 400D), however it does not offer an easy way to share pictures with my smartphone. It's not a big issue but I tend to use it less because I can't instantly share these photos. 

In this small blog post, I share a homemade solution to add this capacity to any device with a USB connection. The main idea is to connect a compact router to the network and automatically push the photos to the smartphone when it joins the wireless network. Of course, we can imagine others scenarios. 

Materials required:


- [NEXX WT3020](https://wiki.openwrt.org/toh/nexx/wt3020). The [Nexx WT3020](http://www.nexx.com.cn/index.php/home/detail?pid=199) is a series of miniature routers based on the [MediaTek MT7620n](https://wikidevi.com/wiki/MediaTek_MT7620) with two Ethernet ports and a 802.11n 2T/2R 2.4 GHz 300Mbps wireless interface.  There are several models with different hardware and software features. Please choose NEXX WT3020F that also have USB port.  You can buy one for a little less than 15 euros for example [https://www.gearbest.com/NEXX-WT3020F-_gear/](https://www.gearbest.com/NEXX-WT3020F-_gear/)

![](https://wiki.openwrt.org/_media/media/nexx/wt3020/wt3020a_top.jpg?cache=&w=900&h=675&tok=ad7401)


<!--more-->
The value of this router (besides its price, its compactness, and its microUSB power supply) is the support of OpenWRT [https://wiki.openwrt.org/toh/nexx/wt3020](https://wiki.openwrt.org/toh/nexx/wt3020). 

## Flash the router

I was largely inspired by [this work](https://dslrcontroller.com/) but the code is not open source and it didn't work well with my device. 

You can download last snaphots of openwrt to flash openwrt from stock firmware. [download link](https://downloads.openwrt.org/snapshots/targets/ramips/mt7620/openwrt-ramips-mt7620-wt3020-8M-squashfs-factory.bin)

To install openwrt, we can follow the following [manual](https://dslrcontroller.com/guide-wifi_wt3020.php) in uploading the previously download image.


If you just want to update openwrt later, you can take this [image](https://downloads.openwrt.org/snapshots/targets/ramips/mt7620/openwrt-ramips-mt7620-wt3020-8M-squashfs-sysupgrade.bin)

## Prepare the router

When your router starts, it is necessary to connect it to the network via an ethernet cable (wan port of your nexx router). Wifi is disabled by default.

You can then connect via ssh and update the package list

```bash
ssh root@YOURROUTERIP
opkg update
opkg upgrade
reboot
```


###  Install luci (Router Web Configuration)

luci is a Web Interface used to manage OpenWrt. 

```bash
opkg install luci
```


### Install gphoto2

gPhoto2 is a free, redistributable, ready to use set of digital camera software applications for Unix-like systems, written by a whole team of dedicated volunteers around the world. It supports more than 2300 cameras


```bash
opkg install gphoto2
```

### install the driver for your camera (for my device)

```bash
opkg install libgphoto2-drivers-ptp2
```

### Install sshfs

SSHFS is a FUSE-based filesystem client for mounting remote directories over a SSH connection. We use it  to mount phone FS to upload photos using gphotos. 


```bash
opkg install sshfss
```


### Install hostpad-utils

The hostapd utility is designed to	be a ``daemon''	program	that runs in the background and	acts as	the backend component controlling the wireless connection.  hostapd_cli is a text-based frontend	program	for interacting	with hostapd. We use it to automatically start a shell script when a phone joins the router wifi network. 

```bash
opkg install hostapd-utils
```

### Reboot the rooter

```bash
reboot
```

## Configure the Wifi

Unconnect the WAN ethernet cable from the WAN port and connect it to the LAN port. 

Next connect to http://192.168.1.1
Default password is root root
Change the password and create a WIFI AP from luci interface. 

## Prepare the phone

Connect your phone to this WIFI. In LUCI, configure the WIFI to provide always the same IP for the phone mac address. Install the [s]implesshd](https://play.google.com/store/apps/details?id=org.galexander.sshd&hl=fr) on your phone application and launch this application. 

## Prepare the ssh connection between the phone and the router

Next connect to the router using SSH.

```bash
ssh root@192.168.1.1
```

Generate ssh keys pair (used to copy photos to the phone using scp)

```bash

export KEY_DIR="/root/.ssh"

# Make directories
mkdir -p "$KEY_DIR"

# Generate an RSA key using dropbear
dropbearkey -t rsa -f "${KEY_DIR}/id_rsa"

# Output Public Key
dropbearkey -y -f "${KEY_DIR}/id_rsa" | grep "^ssh-rsa " > "${KEY_DIR}/id_rsa.pub"

# Show Public Key
cat "${KEY_DIR}/id_rsa.pub"
```

Copy the public key to the android phone using ssh: Copy the *id_rsa.pub* file to /data/data/org.galexander.sshd/files and rename this file with the name *authorized_keys*

## Check the ssh connection between the phone and the router


Restart the *simplesshd* application on the phone. 

Test the connection between the router and the phone

from the router, test the connection between the router and the phone. You should be able to connect without password.

```bash
ssh root@PHONEIP # Replace PHONEIP using your phone's IP visible from the luci web interface
```

Once this works, if your phone is rooted in the simpleshd application setup menu, for the Login Shell key, you can set the path to the command su (*/xbin/su*). Path to the command shell. The default Android shell is /system/bin/sh, but you may prefer to use the one that comes with busybox or whatever. If you set it to the su binary (i.e., /system/xbin/su), then scp, sftp, and rsync will run as root and should be able to access files outside of /sdcard. If the name of the shell contains "su" in it, instead of putting "-" before argv[0] to indicate the login shell, SimpleSSHD puts "-" as argv[1]. That is, a regular login shell would be invoked as "-sh", but su will be invoked as "su -".


## Finalize the router configuration to automatically copy new photos on the phone. 

On the router, install two scripts. 

In the */usr/bin/* directory, create the *copytophone.sh* file with the following content. This script is invoked each time a device connects to the router. It is possible to filter on the MAC address of the device that connects with the *$4* parameter in the bash script. 

```bash
#!/bin/ash
connected="AP-STA-CONNECTED"
disconnected="AP-STA-DISCONNECTED"
HOME=/root

if [ $2 = $connected ]; then
        /bin/echo "$3 Connected!" >> /var/log/hostapd.log
        # Wait  that the user start simplessh after connecting to WIFI
        /bin/sleep 15
        /bin/rm -rf /root/test
        /bin/mkdir /root/test
        # Mount /root/test on  ... Change the remote folder on the phone if your phone is not rooted
        /usr/bin/sshfs -o reconnect,ssh_command="ssh -p 2222 -i /root/.ssh/id_rsa" root@192.168.2.198:/mnt/runtime/default/EBEB-FA00/DCIM/EOS /root/test
        /bin/sleep 3
        if mount | grep /root/test > /dev/null; then
          cd /root/test
          /usr/bin/gphoto2 -P --skip-existing
          cd /root
          /bin/umount /root/test
          else
		echo "could not mount ssh" >> /var/log/hostapd.log
	fi
else 
  if [ $2 = $disconnected ]; then
    echo "$3 Disconnected" >> /var/log/hostapd.log
    killall gphoto2
  else
    echo "$1.$2.$3" >> /var/log/hostapd.log
    echo "What happened now?" >> /var/log/hostapd.log
  fi
fi
```

Ensure that this script is executable

```bash
chmod a+x /usr/bin/copytophone.sh
```

In */etc/init.d*, copy the *done* file to *hostapdphoto*. In this text file, in the boot() function, put the following content. 

```bash
sleep 10
hostapd_cli -a  -i wlan0 /usr/bin/copytophone.sh&                             
```
replace **START=10** by **START=97**. Enable this script by default when the router starts. 

```bash
/etc/init.d/hostapdphoto enable
```


At the end to use the process, power the router with a small external battery, connect the phone to the router. Connect your phone to the WIFI. Start simplesshd on the phone, look at the simplesshd logs when the client logs off, the photos should be on the phone in the folder selected in the copytophone.sh script file. 

Enjoy and specialize that for your own needs. 

##  Comments

- Yes, there are WIFI sd cards for a few euros but the use of gphoto allows to elaborate more complicated scenarios and support Compact Flash devices. 
- This could be used to more complex scenarii, in particular, you can use gphoto to control the camera from the phone [1](https://www.linux.com/news/sophisticated-picture-taking-gphoto), [2](http://www.eos-numerique.com/forums/f16/capture-dimage-sous-linux-avec-gphoto2-105805/). 

