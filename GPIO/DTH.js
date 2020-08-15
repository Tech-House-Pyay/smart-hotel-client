/* # Connect
    - pin1: VCC - 5v(+)
    - pin2: data - GPIO 4(Pin 7), data - resistor(4.7K or 10K) - 5v
    - pin3: not use
    - pin4: GND - Ground(-)
*/

var sensor = require("node-dht-sensor");
const { read } = require("..");
var tem = 0;
var hum = 0;
function DHT(callback, opt) {
  var self = this;
  if (!opt) opt = { temp: 5, humi: 5 };

  self.read = function (op) {
    sensor.read(11, 4, function (err, temperature, humidity) {
      if (!err) {
        // console.log(`temp: ${temperature}°C, humidity: ${humidity}%`, op);
        tem = temperature;
        hum = humidity;
      }
    });
    switch (op) {
      case 0:
        return tem;
      case 1:
        return hum;
      default:
        return -1;
    }
  };
  var tempC = 0;
  var humC = 0;
  function readTemp() {
    if (tempC != self.read(0)) {
      callback("DHT", 0, self.read(0));
      tempC = self.read(0);
    }
  }
  function readHumi() {
    if (humC != self.read(1)) {
      callback("DHT", 1, self.read(1));
      humC = self.read(1);
    }
  }
  var tempInterval = setInterval(readTemp, opt.temp * 2000);
  var humiInterval = setInterval(readHumi, opt.humi * 2000);
  this.set = function (opt) {
    clearInterval(tempInterval);
    clearInterval(humiInterval);
    tempInterval = setInterval(readTemp, opt.temp * 2000);
    humiInterval = setInterval(readHumi, opt.humi * 2000);
  };
}

module.exports = DHT;
