var gl;
var buffer;

var u_theta;
var theta;

var vPosition;

var u_scale;
var scale;

var u_translation;
var translation;

var u_color;
var color;

var vertices;

var positionDirection;
var rotationDirection;
var scaleDirection;
window.onload = function init() {
  const canvas = document.querySelector("#glcanvas");
  gl = WebGLUtils.setupWebGL(canvas);

  // Only continue if WebGL is available and working
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  window.onkeydown = function (event) {
    var key = String.fromCharCode(event.keyCode);
    switch (key) {
      case "W":
        positionDirection = "up";
        changePosition();
        break;
      case "A":
        positionDirection = "left";
        changePosition();
        break;
      case "S":
        positionDirection = "down";
        changePosition();
        break;
      case "D":
        positionDirection = "right";
        changePosition();
        break;
    }
  };

  document.getElementById("slide").onchange = function () {
    scale[0] = this.value * 0.01;
    scale[1] = this.value * 0.01;

    drawScene();
  };

  /*
  var rightButton = document.getElementById("rightButton");
  rightButton.addEventListener("click", function () {
    positionDirection = "right";
    changePosition();
  });

  var leftButton = document.getElementById("leftButton");
  leftButton.addEventListener("click", function () {
    positionDirection = "left";
    changePosition();
  });

  var upButton = document.getElementById("upButton");
  upButton.addEventListener("click", function () {
    positionDirection = "up";
    changePosition();
  });

  var downButton = document.getElementById("downButton");
  downButton.addEventListener("click", function () {
    positionDirection = "down";
    changePosition();
  });

  */

  var colorButton = document.getElementById("colorButton");
  colorButton.addEventListener("click", function () {
    changeColor();
  });

  var clockwiseRotationButton = document.getElementById(
    "clockwiseRotationButton"
  );
  clockwiseRotationButton.addEventListener("click", function () {
    rotationDirection = "clockwise";
    changeRotation();
  });

  var counterClockwiseRotationButton = document.getElementById(
    "counterClockwiseRotationButton"
  );
  counterClockwiseRotationButton.addEventListener("click", function () {
    rotationDirection = "counterClockwise";
    changeRotation();
  });

  /*
  var increaseScaleButton = document.getElementById("increaseScaleButton");
  increaseScaleButton.addEventListener("click", function () {
    scaleDirection = "increase";
    changeScale();
  });

  var decreaseScaleButton = document.getElementById("decreaseScaleButton");
  decreaseScaleButton.addEventListener("click", function () {
    scaleDirection = "decrease";
    changeScale();
  });

  */

  vertices = [
    //ABC
    vec2(-0.9, 0.7), //A
    vec2(-0.9, -0.7), //B
    vec2(-0.7, -0.7), //C
    //ADC
    vec2(-0.9, 0.7), //A
    vec2(-0.7, 0.7), //D
    vec2(-0.7, -0.7), //C

    //EFG
    vec2(-0.7, 0.1), //E
    vec2(-0.7, -0.1), //F
    vec2(-0.3, -0.1), //G
    //EHG
    vec2(-0.7, 0.1), //E
    vec2(-0.3, 0.1), //H
    vec2(-0.3, -0.1), //G

    //KNM
    vec2(-0.1, 0.7), //K
    vec2(-0.3, 0.7), //N
    vec2(-0.3, -0.7), //M
    //KLM
    vec2(-0.1, 0.7), //K
    vec2(-0.1, -0.7), //L
    vec2(-0.3, -0.7), //M

    /* S HARFİ*/

    //ABC
    vec2(0.1, 0.7), //A
    vec2(0.9, 0.7), //B
    vec2(0.9, 0.5), //C

    //ADC
    vec2(0.1, 0.7), //A
    vec2(0.1, 0.5), //D
    vec2(0.9, 0.5), //C
    //DEF
    vec2(0.1, 0.5), //D
    vec2(0.3, 0.5), //E
    vec2(0.3, 0.1), //F
    //DGF
    vec2(0.1, 0.5), //D
    vec2(0.1, 0.1), //G
    vec2(0.3, 0.1), //F
    //GNL
    vec2(0.1, 0.1), //G
    vec2(0.1, -0.1), //N
    vec2(0.9, -0.1), //L
    //GKL
    vec2(0.1, 0.1), //G
    vec2(0.9, 0.1), //K
    vec2(0.9, -0.1), //L
    //LPR
    vec2(0.9, -0.1), //L
    vec2(0.9, -0.7), //P
    vec2(0.7, -0.7), //R
    //LMR
    vec2(0.9, -0.1), //L
    vec2(0.7, -0.1), //M
    vec2(0.7, -0.7), //R

    //TYR
    vec2(0.1, -0.5), //T
    vec2(0.7, -0.5), //Y
    vec2(0.7, -0.7), //R
    //TSR
    vec2(0.1, -0.5), //T
    vec2(0.1, -0.7), //S
    vec2(0.7, -0.7), //R

    /* Ş HARFİ NOKTASI */

    //QZU
    vec2(0.4, -0.8), //Q
    vec2(0.4, -1.0), //Z
    vec2(0.6, -1.0), //U

    //QWU
    vec2(0.4, -0.8), //Q
    vec2(0.6, -0.8), //W
    vec2(0.6, -1.0), //U
  ];

  vPosition = gl.getAttribLocation(program, "vPosition");
  u_translation = gl.getUniformLocation(program, "u_translation");
  u_color = gl.getUniformLocation(program, "u_color");
  u_scale = gl.getUniformLocation(program, "u_scale");
  u_theta = gl.getUniformLocation(program, "u_theta");

  //create a buffer to put positions in
  buffer = gl.createBuffer();

  //bind it to ARRAY_BUFFER (ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  //put geometry data into buffer
  setGeometry();

  theta = 0;
  translation = [0, 0, 0, 0];
  color = [Math.random(), Math.random(), Math.random(), 1];
  scale = [0.75, 0.75, 0, 0];

  //gl.uniform1f(u_theta, theta);

  // Set clear color of canvas, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //drawScene();
  drawScene();
};

function drawScene() {
  //clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  // turn on the attribute
  gl.enableVertexAttribArray(vPosition);
  //bind the position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(vPosition, size, type, normalize, stride, offset);

  // set the color
  gl.uniform4fv(u_color, color);

  // Set the translation.
  gl.uniform4fv(u_translation, translation);

  //set the scale
  gl.uniform4fv(u_scale, scale);

  //set the rotation
  gl.uniform1f(u_theta, theta);

  // Set clear color of canvas, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 54; // 6 triangles in the 'F', 3 points per triangle
  gl.drawArrays(primitiveType, offset, count);
}

function setGeometry() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
}

function changePosition() {
  if (positionDirection == "right") {
    translation[0] += 0.07;
  } else if (positionDirection == "left") {
    translation[0] -= 0.07;
  } else if (positionDirection == "up") {
    translation[1] += 0.07;
  } else if (positionDirection == "down") {
    translation[1] -= 0.07;
  }

  drawScene();
}

function changeColor() {
  color = [Math.random(), Math.random(), Math.random(), 1];
  drawScene();
}

function changeRotation() {
  if (rotationDirection == "clockwise") {
    theta -= 0.1;
  } else {
    theta += 0.1;
  }

  drawScene();
}

function changeScale() {
  if (scaleDirection == "increase") {
    scale[0] += 0.05;
    scale[1] += 0.05;
  } else {
    scale[0] -= 0.05;
    scale[1] -= 0.05;
  }

  drawScene();
}
