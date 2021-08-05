function run() {
  var b = require("bonescript");
  b.pinMode("P8_19", b.INPUT);
  getButtonStatus();
  function getButtonStatus() {
    b.digitalRead("P8_19", onButtonRead);
  }
  function onButtonRead(x) {
    $("#buttonStatus").html(x.value);
    setTimeout(getButtonStatus, 20);
  }
}

setTargetAddress("192.168.1.11:80", { initialized: run });
