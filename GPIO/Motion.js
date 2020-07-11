/*
# Pin
    * VCC - 5V(+)
    * OUT(GPIO) - Pin 22 (GPIO 25)
    * GND: Ground(-)
*/

function Motion(five, callback) {
  // Create a new `motion` hardware instance.
  var motion = new five.Motion("P1-22");
  // var motions1 = new five.Motion("P1-24");

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function () {
    console.log("Montion sensor 0 calibrated");
  });
  // motions1.on("calibrated", function() {
  //     console.log("Montion sensor 1 calibrated");
  // });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function () {
    callback("MOTION", 0, true);
  });
  // motions1.on("motionstart", function() {
  //     callback('MOTION', 1, true);
  // });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function () {
    callback("MOTION", 0, false);
  });
  // motions1.on("motionend", function() {
  //     callback('MOTION', 1, false);
  // });
}
module.exports = Motion;
