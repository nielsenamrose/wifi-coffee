"use strict";

const http = require("http");
const b = require("bonescript");

const powerOut = "P9_15";
const manualOut = "P9_23";
const grinderOut = "P9_25";

const ledIn = "P9_41";

var ledInValue = 0;
var ledInChangeTime = Date.now();
var ledInTimer = null;

var _heating = false;
var _ready = false;

var _grinderRuns = 0;
var _grinderStarted = false;

var _brewRuns = 0;
var _isBrewing = false;

b.pinMode(powerOut, b.OUTPUT);
b.digitalWrite(powerOut, b.LOW);

b.pinMode(grinderOut, b.OUTPUT);
b.digitalWrite(grinderOut, b.LOW);

b.pinMode(manualOut, b.OUTPUT);
b.digitalWrite(manualOut, b.LOW);

b.pinMode(ledIn, b.INPUT);
b.attachInterrupt(ledIn, true, b.CHANGE, (err, response) => {
  //console.log(err);
  console.log(response);
  ledInValue = response.value;
  ledInChangeTime = Date.now();

  ledInTimer = setTimeout(() => {
    let old = Date.now() - ledInChangeTime > 600;
    _ready = old && ledInValue == 1;
    _heating = !old && (_heating || ledInValue == 1);
    if (_ready) {
      startGrinderIfReady();
      brewIfReady();
    } else if (!_heating) stopGrinder();
  }, 700);
});

const pushButton = function (output) {
  b.digitalWrite(output, b.HIGH);
  setTimeout(() => {
    b.digitalWrite(output, b.LOW);
  }, 200);
};

const startGrinderIfReady = function () {
  if (_ready && _grinderRuns > 0) {
    b.digitalWrite(grinderOut, b.HIGH);
    if (!_grinderStarted) {
      setTimeout(() => {
        _grinderRuns = _grinderRuns > 0 ? _grinderRuns - 1 : 0;
        if (_grinderRuns < 1) stopGrinder();
        else {
          _grinderStarted = false;
          startGrinderIfReady();
        }
      }, 10000);
      _grinderStarted = true;
    }
  }
};

const stopGrinder = function () {
  b.digitalWrite(grinderOut, b.LOW);
  if (_grinderStarted) {
    _grinderStarted = false;
    _grinderRuns = 0;
  }
};

const brewIfReady = function () {
  if (_ready && _brewRuns > 0 && !_isBrewing) {
    pushButton(manualOut);
    _isBrewing = true;
    setTimeout(() => {
      if (_isBrewing) {
        pushButton(manualOut);
        _isBrewing = false;
        _brewRuns = _brewRuns > 0 ? _brewRuns - 1 : 0;
      }
      brewIfReady();
    }, 25000);
  }
};

http
  .createServer((req, res) => {
    let statusCode = 200;
    if (req.url.endsWith("api/pushPower")) {
      _ready = false;
      _heating = !_heating && !_ready;
      pushButton(powerOut);
    } else if (req.url.endsWith("api/pushGrinder")) {
      _grinderRuns = _grinderRuns < 5 ? _grinderRuns + 1 : 0;
      startGrinderIfReady();
    } else if (req.url.endsWith("api/incbrewruns")) {
      _brewRuns = _brewRuns < 2 ? _brewRuns + 1 : 0;
      brewIfReady();
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
        heating: _heating,
        ready: _ready,
        grinderRuns: _grinderRuns,
        brewRuns: _brewRuns,
      })
    );
  })
  .listen(8081);
