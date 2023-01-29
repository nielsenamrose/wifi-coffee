"use strict";

const http = require("http");
const b = require("bonescript");

const powerOut = "P9_23";
const manualOut = "P9_15";
const grinderOut = "P9_25";

const ledIn = "P9_41";

const provingTime = 600;
const GRIND_TIME = 12000;
const BREW_TIME = 40000;
const AUTO_OFF_TIME = 300000;

var ledInValue = 0;
var ledInChangeTime = Date.now();
var ledInTimer = null;

var _heating = false;
var _ready = false;
var _proving = true;

var _grinderRuns = 0;
var _grinderStarted = false;

var _brewRuns = 0;
var _isBrewing = false;

var _offTimer = null;
var _offTimerStartTime = -1

b.pinMode(powerOut, b.OUTPUT);
b.digitalWrite(powerOut, b.LOW);

b.pinMode(grinderOut, b.OUTPUT);
b.digitalWrite(grinderOut, b.LOW);

b.pinMode(manualOut, b.OUTPUT);
b.digitalWrite(manualOut, b.LOW);

b.pinMode(ledIn, b.INPUT);
b.attachInterrupt(ledIn, true, b.CHANGE, (err, response) => {
  //console.log(err);
  if (response.value === ledInValue) return;
  console.log(response);
  ledInValue = response.value;
  ledInChangeTime = Date.now();
  _proving = true;

  ledInTimer = setTimeout(() => {
    _proving = Date.now() - ledInChangeTime < provingTime;
    _ready = !_proving && ledInValue == 1;
    _heating = _proving && (_heating || ledInValue == 1);
    startGrinderIfReady();
    brewIfReady();
    if (!_ready && !_heating) stopGrinder();
    if (_ready && _offTimerStartTime < 0) startOffTimer();
    if (!_ready && !_heating && !_proving && _offTimerStartTime > 0) stopOffTimer();
  }, provingTime + 100);
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
      }, GRIND_TIME);
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
      setTimeout(brewIfReady, 500);
    }, BREW_TIME);
  }
};

const startOffTimer = function() {
  _offTimer = setTimeout(turnOff, AUTO_OFF_TIME);
  _offTimerStartTime = Date.now();
}

const stopOffTimer = function() {
  clearTimeout(_offTimer);
  _offTimerStartTime = -1;
}

const getOffTimerRemaining = function() {
  return _offTimerStartTime > 0 ? _offTimerStartTime + AUTO_OFF_TIME - Date.now() : 0;
}

const turnOff = function() {
  _offTimerStartTime = -1;
  pushButton(powerOut);
}

http
  .createServer((req, res) => {
    let statusCode = 200;
    if (req.url.endsWith("api/pushPower")) {
      _ready = false;
      _heating = !_heating;
      pushButton(powerOut);
    } else if (req.url.endsWith("api/pushGrinder") || req.url.endsWith("api/incgrinderruns")) {
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
        proving: _proving,
        grinderRuns: _grinderRuns,
        brewRuns: _brewRuns,
        offTimer: getOffTimerRemaining() 
      })
    );
  })
  .listen(8081);
