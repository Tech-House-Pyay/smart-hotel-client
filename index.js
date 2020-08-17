var five = require("johnny-five");
var Raspi = require("raspi-io").RaspiIO;
var http = require("http");
var io = require("socket.io-client");
// var Lamp = require("./GPIO/led");
var DHT = require("./GPIO/DTH");
var ADC = require("./GPIO/ADC");
var Motion = require("./GPIO/Motion");
var Windows = require("./GPIO/Windows");
var Lamps = require("./GPIO/Lamps");
var Motor = require("./GPIO/Motor");
var Relay = require("./GPIO/Relay");
var Omx = require("node-omxplayer");

var serverUrl = "http://192.168.100.229";
var socketIo = io(serverUrl);

var SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const { constants } = require("buffer");
var port = new SerialPort("/dev/ttyUSB0");

const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

// console.log(Lamp);

var server = http.createServer().listen(3000);
var serverIo = require("socket.io")(server);

var board = new five.Board({
  io: new Raspi(),
});

// function Gpio(server) {
var self = this;
var gasValue = 710;
var flameValue = 700;
var readyW = false;
var doorDelay = 7;
// this.windows = new Windows(fnCallback);
// this.dht = new DHT(fnCallback, { temp: 5, humi: 5 });
board.on("ready", function () {
  console.log("board is real");

  self.motion = new Motion(five, fnCallback);
  self.lamps = new Lamps(five);
  self.relay = new Relay();
  self.motor = new Motor(five, fnCallback, { time: 3.3 });
  self.adc = new ADC(five, fnCallback, {
    gas: 1,
    flame: 1,
    water: 1,
    gasLevel: gasValue,
    flameLevel: flameValue,
  });
  new five.Led("P1-7").strobe();
  // setInterval(function () {
  //   if (self.dht.read(0))
  //     saveLog("Data", "DHT", 0, self.dht.read(0), "Temperature", "Hardware");
  //   if (self.dht.read(1))
  //     saveLog("Data", "DHT", 1, self.dht.read(1), "Humidity", "Hardware");
  // }, 60000);
});

function allLampsOff() {
  for (var i = 0; i < 8; i++) {
    self.lamps.off(i);
  }
}

function allRelayOff() {
  self.relay.allClose();
}

this.read = function () {
  console.log("ca;;;;;");
  var rtn = {};
  rtn.temperature = self.dht.read(0);
  rtn.humidity = self.dht.read(1);
  rtn.gas = this.adc.read(0);
  rtn.flame = this.adc.read(1);
  rtn.windows = [];
  for (i = 0; i < 2; i++) {
    rtn.windows[i] = this.windows.read(i);
  }
  console.log("qwqwqw", rtn);
  return rtn;
};

serverIo.on("connection", function (socket) {
  console.log("connected....");
  // allLampsOff();
  // allRelayOff();
  //LED
  socket.on("balight", (data) => {
    if (data) {
      self.lamps.on(0);
    } else {
      self.lamps.off(0);
    }
    socket.emit("blight", data);
  });
  socket.on("dolight", (data) => {
    if (data) {
      self.lamps.on(4);
    } else {
      self.lamps.off(4);
    }
    socket.emit("dlight", data);
  });
  socket.on("set1light", (data) => {
    if (data) {
      self.lamps.on(2);
    } else {
      self.lamps.off(2);
    }
    socket.emit("s1light", data);
  });
  socket.on("set2light", (data) => {
    if (data) {
      self.lamps.on(3);
    } else {
      self.lamps.off(3);
    }
    socket.emit("s2light", data);
  });
  //END LED

  socket.on("fan", (data) => {
    console.log("Fan is " + data);
    if (data) {
      self.relay.on("1");
    } else {
      self.relay.off("1");
    }
    socket.emit("fan", data);
  });

  socket.on("pump", (data) => {
    console.log("pump is " + data);
    if (data) {
      self.relay.on("0");
    } else {
      self.relay.off("0");
    }
    socket.emit("pump", data);
  });

  socket.on("light", (data) => {
    console.log("light is " + data);
    if (data) {
      self.relay.on("3");
    } else {
      self.relay.off("3");
    }
    // Lamp(data ? 1 : 0);
    socket.emit("light", data);
  });
  socket.on("outer", (data) => {
    console.log("outer light is " + data);
    if (data) {
      self.relay.on("2");
    } else {
      self.relay.off("2");
    }
    socket.emit("outer", data);
  });
  socket.on("security", (data) => {
    console.log("security is " + data);
    socket.emit("security", data);
  });
  socket.on("door", (data) => {
    console.log("door is " + data);
    if (data) {
      console.log("open door");
      self.motor.toggle();
    } else {
      console.log("close door");
      self.motor.toggle();
    }
    socket.emit("door", data);
  });
  socket.on("doorR", (data) => {
    console.log("open door by rfid");
    self.motor.open(doorDelay);
  });
  // setInterval(() => {

  // }, 1000);

  // this.read = () => {
  //   var data = {};
  // };
  // self.dht.read(0);
  self.setTemp = (value) => {
    socket.emit("temperature", value);
  };
  self.setHum = (value) => {
    socket.emit("humity", value);
  };
  self.setWater = (value) => {
    // console.log("water", value);
    socket.emit("water", value);
  };
  self.setGas = (value) => {
    socket.emit("gas", value);
  };
  self.setFlame = (value) => {
    socket.emit("flame", value);
  };
  self.setWindow0 = (value) => {
    socket.emit("window0", value);
  };
  self.setWindow1 = (value) => {
    socket.emit("window1", value);
  };
  self.setAlarm = (idx, value) => {
    socket.emit("alarm", { index: idx, value: value });
  };
  readyW = true;
  self.dht = new DHT(fnCallback, { temp: 3, humi: 3 });
  self.windows = new Windows(fnCallback);

  parser.on("data", (data) => {
    console.log(data);
    socket.emit("rfid", data);
  });
});
var mo = false;
var mo1 = true;
function fnCallback(type, index, value) {
  switch (type) {
    case "MOTION":
      self.motor.open(doorDelay);
      console.log("Motion value ", value);
      break;
    case "DHT":
      if (index == 0) self.setTemp(value);
      if (index == 1) self.setHum(value);
      break;
    case "ADC":
      if (index == 2 && readyW) {
        self.setWater(value);
        
        if(value < 10 &&  !mo){
          console.log('should open');
          self.relay.on("0");
          mo = true;
        }else if(value > 30 && mo1){
          mo1=false
          console.log("should close")
          self.relay.off("0");
        }
        console.log('water ',value,mo)
      }
      if (index == 0 && readyW) self.setGas(value);
      if (index == 1 && readyW) self.setFlame(1020 - value);
      break;
    case "ALARM":
      // if (index == "0") {
      //   var player = Omx("./mp3/gas.wav");
      //   setTimeout(function () {
      //     player.quit();
      //   }, 5000);
      // } else if (index == "1") {
      //   var player = Omx("./mp3/flame.wav");
      //   setTimeout(function () {
      //     player.quit();
      //   }, 5000);
      // }
      // self.setAlarm(index, value);
      console.log("ALARM", index, value);
      break;
    case "WINDOW":
      if (index == 0 && readyW) self.setWindow0(value);
      if (index == 1 && readyW) self.setWindow1(value);
      break;
  }
}

// }

// console.log("server is running....");

// module.exports = Gpio;
