var Gpio = require("onoff").Gpio;
var pump = new Gpio(5, "out");
var fan = new Gpio(6, "out");
var dec = new Gpio(13, "out");
var light = new Gpio(19, "out");

fan.writeSync(1);
pump.writeSync(1);
dec.writeSync(1);
light.writeSync(1); //

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
