var five = require("johnny-five");
var Raspi = require("raspi-io").RaspiIO;
var http = require("http");
var io = require("socket.io-client");
// var Lamp = require("./GPIO/led");
var DHT = require("./GPIO/DTH");
var Motion = require("./GPIO/Motion");

var serverUrl = "http://192.168.100.4";
var socketIo = io(serverUrl);

// console.log(Lamp);

var server = http.createServer().listen(3000);
var serverIo = require("socket.io")(server);

var board = new five.Board({
  io: new Raspi(),
});

// function Gpio(server) {
var self = this;
// this.dht = new DHT(fnCallback, { temp: 5, humi: 5 });
board.on("ready", function () {
  console.log("board is real");
  self.motion = new Motion(five, fnCallback);
  new five.Led("P1-7").strobe();
  // setInterval(function () {
  //   if (self.dht.read(0))
  //     saveLog("Data", "DHT", 0, self.dht.read(0), "Temperature", "Hardware");
  //   if (self.dht.read(1))
  //     saveLog("Data", "DHT", 1, self.dht.read(1), "Humidity", "Hardware");
  // }, 60000);
});

this.read = function () {
  console.log("ca;;;;;");
  var rtn = {};
  rtn.temperature = self.dht.read(0);
  rtn.humidity = self.dht.read(1);
  console.log("qwqwqw", rtn);
  return rtn;
};

serverIo.on("connection", function (socket) {
  console.log("connected....");
  socket.on("light", (data) => {
    console.log("light is " + data);
    // Lamp(data ? 1 : 0);
    socket.emit("light", data);
  });
  socket.on("outer", (data) => {
    console.log("outer light is " + data);
    socket.emit("outer", data);
  });
  socket.on("security", (data) => {
    console.log("security is " + data);
    socket.emit("security", data);
  });
  socket.on("door", (data) => {
    console.log("door is " + data);
    socket.emit("door", data);
  });
  setInterval(() => {
    var num = Math.random();
    socket.emit("water", Math.floor(num * 100));
  }, 1000);
  // this.read = () => {
  //   var data = {};
  // };
  // self.dht.read(0);
  self.setHum = (value) => {
    socket.emit("humity", value);
  };
  self.dht = new DHT(fnCallback, { temp: 3, humi: 3 });
});
function fnCallback(type, index, value) {
  switch (type) {
    case "MOTION":
      console.log("Motion value ", value);
      break;
    case "DHT":
      console.log("DHT2222", index, value);
      if (index == 1) self.setHum(value);
      break;
  }
}

// }

// console.log("server is running....");

// module.exports = Gpio;
