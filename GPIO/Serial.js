var SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var port = new SerialPort("/dev/ttyUSB0");

const parser = port.pipe(new Readline({ delimiter: "\r\n" }));
parser.on("data", (data) => {
  console.log(data);
});
