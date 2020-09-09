/*
# Control buttons
# Components
    * 5 x Resistor 1k Ohm
    * 5 x Push button
# Connect
    * BUTTON (1) - Pins 32, 36, 38, 40, 26 (Any GPIOs pin)
             (2) - 5V
             (2) - Resistor 1k Ohm - GND
@ needed: sudo
*/
var btnPins = ["P1-32", "P1-36", "P1-38", "P1-40", "P1-37", "P1-18"]; // add for fan
function Buttons(five, callback) {
  var buttons = new five.Buttons({
    pins: btnPins,
  });
  buttons.on("press", function (button) {
    console.log("press");
    callback(btnPins.indexOf(button.pin));
  });
}
module.exports = Buttons;
