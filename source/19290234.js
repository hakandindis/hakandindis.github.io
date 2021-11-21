var gl;
var theta;
var thetaLoc;
var color = [1.0, 0.0, 0.0, 1.0];
var isDirClockwise = false;
var delay = 50;

function changeRotation() {
  isDirClockwise = !isDirClockwise;
}

window.onload = function init() {
  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context

  //gl = canvas.getContext("webgl");
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

  var myButton = document.getElementById("DirectionButton");
  myButton.addEventListener("click", changeRotation);

  var m = document.getElementById("mymenu");
  m.addEventListener("click", function () {
    switch (m.selectedIndex) {
      case 0:
        //direction = !direction;
        break;
      case 1:
        delay /= 2.0;
        break;
      case 2:
        delay *= 2.0;
        break;
    }
  });

  var colors = {
    red: new vec4(1, 0, 0, 1),
    blue: new vec4(0, 0, 1, 1),
    green: new vec4(0, 1, 0, 1),
    yellow: new vec4(1, 1, 0, 1),
    cyan: new vec4(0, 1, 1, 1),
    magenta: new vec4(1, 0, 1, 1),
  };

  var vertices = [
    //ABC
    vec2(-0.9, 0.7),
    vec2(-0.9, -0.7), //
    vec2(-0.7, -0.7), //
    //ADC
    vec2(-0.9, 0.7), //
    vec2(-0.7, 0.7), //
    vec2(-0.7, -0.7), //

    //EFG
    vec2(-0.7, 0.1), //
    vec2(-0.7, -0.1), //
    vec2(-0.3, -0.1), //
    //EHG
    vec2(-0.7, 0.1), //
    vec2(-0.3, 0.1), //
    vec2(-0.3, -0.1), //

    //KNM
    vec2(-0.1, 0.7), //
    vec2(-0.3, 0.7), //
    vec2(-0.3, -0.7), //
    //KLM
    vec2(-0.1, 0.7), //
    vec2(-0.1, -0.7), //
    vec2(-0.3, -0.7), //

    /* S HARFİ*/

    //ABC
    vec2(0.1, 0.7), //
    vec2(0.9, 0.7), //
    vec2(0.9, 0.5), //

    //ADC
    vec2(0.1, 0.7), //
    vec2(0.1, 0.5), //
    vec2(0.9, 0.5), //
    //DEF
    vec2(0.1, 0.5), //
    vec2(0.3, 0.5), //
    vec2(0.3, 0.1), //
    //DGF
    vec2(0.1, 0.5), //
    vec2(0.1, 0.1), //
    vec2(0.3, 0.1), //
    //GNL
    vec2(0.1, 0.1), //
    vec2(0.1, -0.1), //
    vec2(0.9, -0.1), //
    //GKL
    vec2(0.1, 0.1), //
    vec2(0.9, 0.1), //
    vec2(0.9, -0.1), //
    //LPR
    vec2(0.9, -0.1), //
    vec2(0.9, -0.7), //
    vec2(0.7, -0.7), //
    //LMR
    vec2(0.9, -0.1), //
    vec2(0.7, -0.1), //
    vec2(0.7, -0.7), //

    //TYR
    vec2(0.1, -0.5), //
    vec2(0.7, -0.5), //
    vec2(0.7, -0.7), //
    //TSR
    vec2(0.1, -0.5), //
    vec2(0.1, -0.7), //
    vec2(0.7, -0.7), //
  ];

  var colorLocation = gl.getUniformLocation(program, "fragment_colors");
  gl.uniform4fv(colorLocation, color);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");

  theta = 0;
  gl.uniform1f(thetaLoc, theta);

  window.addEventListener("keydown", checkKeyPressed);

  // Set clear color, fully opaque
  gl.clearColor(0.0, 1.0, 1.0, 1.0);

  requestAnimFrame(render);
};

function render() {
  setTimeout(function () {
    //requestAnimFrame(render);
    gl.clear(gl.COLOR_BUFFER_BIT);
    theta += isDirClockwise ? -0.05 : 0.05;
    gl.uniform1f(thetaLoc, theta);

    //colorLocation = gl.getUniformLocation(program, "fragment_color");

    //gl.uniform4fv(colorLocation, color);

    //gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 48);
    render();
  }, delay);

  // Clear the color buffer with specified clear color
}

function checkKeyPressed(e) {
  if (e.keyCode == "84") {
    color = [Math.random(), Math.random(), Math.random(), 1];
  }
}
