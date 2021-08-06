"use strict"

const http = require("http");
const b = require("bonescript");

const powerOutPlus = "P8_8";
const powerLedPlus = "P8_7";

var powerLedValue = 0;
var powerLedChangeTime = Date.now()

http
  .createServer(function (req, res) {
    let statusCode = 200;
    if (req.url.endsWith('api/push')){
      b.digitalWrite(powerOutPlus, b.HIGH);
      setTimeout(function(){b.digitalWrite(powerOutPlus, b.LOW)}, 300);
    }
    else if(req.url.endsWith('api/read')){
    }
    else if(req.url.endsWith('api/kill')){
      setTimeout(function(){process.exit(0)}, 1000);
    }
    else {
      statusCode = 404;
    }
    res.writeHead(statusCode, { "Content-Type": "text/json" });
    res.end(JSON.stringify({url: res.url, value: powerLedValue, timestamp: Date.now() - powerLedChangeTime}))
  })
  .listen(8081);

b.pinMode(powerOutPlus, b.OUTPUT);
b.digitalWrite(powerOutPlus, b.LOW);

b.pinMode(powerLedPlus, b.INPUT);
b.attachInterrupt(powerLedPlus, function(x){powerLedValue=x.value; powerLedChangeTime=Date.now()}, b.CHANGE);
