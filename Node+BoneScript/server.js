"use strict";

const http = require("http");
const b = require("bonescript");

const buttonOut = "P8_8";
const ledIn = "P8_7";

var ledInValue = 0;
var ledInChangeTime = Date.now();

http
  .createServer(function (req, res) {
    let statusCode = 200;
    if (req.url.endsWith("api/push")) {
      b.digitalWrite(buttonOut, b.HIGH);
      setTimeout(() => {
        b.digitalWrite(buttonOut, b.LOW);
      }, 300);
    } else if (req.url.endsWith("api/read")) {
    } else if (req.url.endsWith("api/kill")) {
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    } else {
      statusCode = 404;
    }
    res.writeHead(statusCode, { "Content-Type": "text/json" });
    res.end(JSON.stringify({ url: res.url, value: powerLedValue, timestamp: Date.now() - ledInChangeTime }));
  })
  .listen(8081);

b.pinMode(buttonOut, b.OUTPUT);
b.digitalWrite(buttonOut, b.LOW);

b.pinMode(ledIn, b.INPUT);
b.attachInterrupt(
  ledIn,
  (x) => {
    powerLedValue = x.value;
    powerLedChangeTime = Date.now();
  },
  b.CHANGE
);
