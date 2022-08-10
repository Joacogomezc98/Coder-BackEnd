"use strict";

// EJERCICIO 1
var randomPixel = function randomPixel() {
  var px = Math.floor(Math.random() * 256);
  return px;
};

var randomColor = "rgb(".concat(randomPixel(), ", ").concat(randomPixel(), ", ").concat(randomPixel(), ")");
console.log(randomColor);
