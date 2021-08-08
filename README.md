# Wi-Fi enabled coffee machine

This is **not** a learning project. The coffee machine is a mission critical household appliance.

This is the simplest solution I could think of. This implementation uses the pre installed Node.js and [BoneScript](https://beagleboard.org/Support/BoneScript/)


## Hardware setup

I am using the BeagleBone Green Wireless. Just because I still have a couple of them laying around from another project.

### Flashing the BBGW

Flash the BBGW with the [Debian 10.3 image](https://debian.beagleboard.org/images/bone-eMMC-flasher-debian-10.3-iot-armhf-2020-04-06-4gb.img.xz)

### Configure Wi-Fi and static IP address

Connect the BBGW to the PC via USB. Then access it via SSH on 192.168.7.2. Default username:password is debian:temppwd.

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

## Install software

Install required Epoll node module
```
sudo npm install -g epoll --unsafe-perm=true --allow-root
```
TODO: Not sure that --unsafe-perm=true is necessary


```
$ git clone https://github.com/nielsenamrose/wifi-coffee.git
$ cd wifi-coffee
$ sudo mkdir /var/www/http
$ sudo cp html/* /var/www/html/
$ sudo cp server.js /var/lib/cloud9/autorun/
```
