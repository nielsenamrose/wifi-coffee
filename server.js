"use strict";

const http = require("http");
const b = require("bonescript");

const powerOut = "P8_7";
const grinderOut = "P9_15";
const ledIn = "P9_41";

var ledInValue = 0;
var ledInChangeTime = Date.now();

var grinderRuns = 0;

b.pinMode(powerOut, b.OUTPUT);
b.digitalWrite(powerOut, b.LOW);

b.pinMode(grinderOut, b.OUTPUT);
b.digitalWrite(grinderOut, b.LOW);

b.pinMode(ledIn, b.INPUT);
b.attachInterrupt(ledIn, true, b.CHANGE, (err, response) => {
  //console.log(err);
  console.log(response);
  ledInValue = response.value;
  ledInChangeTime = Date.now();
});

const startGrinderTimer = function () {
  setTimeout(() => {
    grinderRuns -= 1;
    if (grinderRuns === 0) b.digitalWrite(grinderOut, b.LOW);
    else startGrinderTimer();
  }, 10000);
};

http
  .createServer((req, res) => {
    let statusCode = 200;
    if (req.url.endsWith("api/push") || req.url.endsWith("api/pushPower")) {
      b.digitalWrite(powerOut, b.HIGH);
      setTimeout(() => {
        b.digitalWrite(powerOut, b.LOW);
      }, 200);
    } else if (req.url.endsWith("api/pushGrinder")) {
      if (grinderRuns === 0) {
        b.digitalWrite(grinderOut, b.HIGH);
        startGrinderTimer();
      }
      grinderRuns += 1;
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
        grinderRuns: grinderRuns,
        age: Date.now() - ledInChangeTime,
      })
    );
  })
  .listen(8081);
