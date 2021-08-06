# wifi-coffee

Wi-Fi enabled coffee machine

This is **not** a learning project. The coffee machine is a mission critical household appliance.

## Hardware setup

I am using the BeagleBone Green Wireless. Just because I still have a couple of them laying around from another project.

### Flashing the BBW

It is a know fact, that the number of bugs in a software project is constant. You just get differnet bugs with each new version. I wanted to develop on a PC running windows 10 and I wanted to use VS Code with the Remote Development extension. I was only able to get this to work with the Debian 9.13 image.

https://rcn-ee.com/rootfs/bb.org/testing/2020-08-25/stretch-iot/bone-eMMC-flasher-debian-9.13-iot-armhf-2020-08-25-4gb.img.xz

### Configure Wi-Fi and static IP address

```
$ sudo connmanctl
connmanctl> enable wifi
connmanctl> scan wifi
connmanctl> services
connmanctl> agent on
connmanctl> connect wifi_884aea627540_4e69656c73656e34_managed_psk
connmanctl> services
```
Confirm there is a *AO or *AR next to the Nexwork ID
```
connmanctl> config wifi_884aea627540_4e69656c73656e34_managed_psk --ipv4 manual 192.168.1.15 255.255.255.0 192.168.1.1
connmanctl> config wifi_884aea627540_4e69656c73656e34_managed_psk --nameservers 8.8.8.8 4.4.4.4
connmanctl> quit
```

Reference: https://www.fis.gatech.edu/how-to-configure-bbw-wifi/
