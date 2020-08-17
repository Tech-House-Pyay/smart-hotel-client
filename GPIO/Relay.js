var Gpio = require("onoff").Gpio;
var pump = new Gpio(5, "out");
var fan = new Gpio(6, "out");
var dec = new Gpio(13, "out");
var light = new Gpio(19, "out");

function Relay() {
  this.off = function (idx) {
    if (idx == "0") {
      pump.writeSync(0);
    } else if (idx == "1") {
      fan.writeSync(0);
    } else if (idx == "2") {
      dec.writeSync(0);
    } else if (idx == "3") {
      light.writeSync(0);
    }
  };
  this.on = function (idx) {
    if (idx == "0") {
      pump.writeSync(1);
    } else if (idx == "1") {
      fan.writeSync(1);
    } else if (idx == "2") {
      dec.writeSync(1);
    } else if (idx == "3") {
      light.writeSync(1);
    }
  };

  this.allClose = function () {
    fan.writeSync(0);
    pump.writeSync(0);
    dec.writeSync(0);
    light.writeSync(0); //
  };

  function unexportOnClose() {
    fan.writeSync(0);
    pump.writeSync(0);
    dec.writeSync(0);
    light.writeSync(0);
    fan.unexport();
    pump.unexport();
    dec.unexport();
    light.unexport();
  }
  process.on("SIGINT", unexportOnClose);
}
module.exports = Relay;
