#! /bin/sh
node server.js &

sleep 2m
echo 0 > /sys/class/leds/beaglebone:green:usr0/brightness
echo 0 > /sys/class/leds/beaglebone:green:usr1/brightness
echo 0 > /sys/class/leds/beaglebone:green:usr2/brightness
echo 0 > /sys/class/leds/beaglebone:green:usr3/brightness
echo 0 > /sys/class/leds/wl18xx_bt_en/brightness
exit 0
