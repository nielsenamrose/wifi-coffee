"use strict";

const http = require("http");
const b = require("bonescript");

const buttonOut = "P9_15";
const manualOut = "P9_23";
const ledIn = "P9_41";

var ledInValue = 0;
var ledInChangeTime = Date.now();

b.pinMode(buttonOut, b.OUTPUT);
b.digitalWrite(buttonOut, b.LOW);

b.pinMode(manualOut, b.OUTPUT);
b.digitalWrite(manualOut, b.LOW);

b.pinMode(ledIn, b.INPUT);
b.attachInterrupt(ledIn, true, b.CHANGE, (err, response) => {
  //console.log(err);
  //console.log(response);
  ledInValue = response.value;
  ledInChangeTime = Date.now();
});

http
  .createServer((req, res) => {
    let statusCode = 200;
    if (req.url.endsWith("api/push")) {
      b.digitalWrite(buttonOut, b.HIGH);
      setTimeout(() => {
        b.digitalWrite(buttonOut, b.LOW);
      }, 200);
    } else if (req.url.endsWith("api/pushManual")) {
      b.digitalWrite(manualOut, b.HIGH);
      setTimeout(() => {
        b.digitalWrite(manualOut, b.LOW);
      }, 200);
    } else if (req.url.endsWith("api/read")) {
    } else if (req.url.endsWith("api/kill")) {
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    } else {
      statusCode = 404;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.writeHead(statusCode, { "Content-Type": "text/json" });
    //console.log(req.url);
    //console.log(ledInValue);
    res.end(
      JSON.stringify({
        url: req.url,
        value: ledInValue,
        age: Date.now() - ledInChangeTime,
      })
    );
  })
  .listen(8081);
