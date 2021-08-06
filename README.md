# wifi-coffee
Wi-Fi enabled coffee machine



https://beagleboard.org/Support/BoneScript/

https://debian.beagleboard.org/images/BBB-blank-debian-9.5-iot-armhf-2018-10-07-4gb.img.xz


## Configure Wi-Fi and static IP address

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
