// Do not rename these variables, as `dom-setup.js`
// references them by name.
let strokeColor = [0, 0, 0, 0];
let strokeWidth = 0;
let fillColor = [0, 0, 0, 0];

let r = 10;
let a = 0;
let c = 20;
let angle = 50;
let art;
let grassBuffer;

// Let's keep track of the state of mouse interactions.
let lastClick = {
  x: 0,
  y: 0
};

// Other things to keep track of
let canvas, buffer;

function setup() {
  windowResized();
  createCanvas(720, 500, WEBGL);
  art = createGraphics(400, 400)
  grassBuffer = createGraphics(width, height);
}

function draw() {

  //--------------------------grass pattern---------------------------
  for (let i = 0; i < 10; i++) { // density of the grass
    let x = r + c * cos(a);
    let y = r + c * sin(a);

    let length = random(10, 30); // Random length of the curve
    let controlPointX1 = random(-20, 20); 
    let controlPointY1 = random(-20, 20); 
    let controlPointX2 = random(-20, 20); 
    let controlPointY2 = random(-20, 20); 

    // Draw grass-like curve on the buffer
    grassBuffer.stroke(random(0,10), random(200, 255), random(0, 10));
    grassBuffer.strokeWeight(random(0.5, 1.5)); 
    grassBuffer.noFill(); // No fill for the curves
    grassBuffer.bezier(
      x + controlPointX1, y + controlPointY1, // Start point
      x - length / 1.5, y, // First control point
      x + length / 1.5, y, // Second control point
      x + controlPointX2, y + controlPointY2 // End point
    );

    c += 0.2;
    a += 0.15;
  }

  // Draw the grass buffer onto the screen
  image(grassBuffer, 0, 0);

  // Draw rotating box with grass texture
  background(0);
  rotateX(frameCount * 0.001); //speed
  rotateY(frameCount * 0.001);
  rotateZ(frameCount * 0.001);
  texture(grassBuffer); 

  box(300);
}

// function mousePressed() {
//   lastClick = {
//     x: mouseX,
//     y: mouseY
//   };
// }

function windowResized() {
  // Take a snapshot of the canvas before deleting it,
  // and then redraw the snapshot after creating a new canvas.
  const pixels = canvas?.get();

  // Delete element before measuring parent.
  // Otherwise, if downsizing, a large canvas will force the parent div
  // to remain large, and we cannot measure the effect of the window resize.
  canvas?.remove();

  // Measure the parent div and create a new canvas.
  const containerDimensions = getElementDimensions("canvas-container");
  canvas = createCanvas(containerDimensions.width, containerDimensions.height);
  canvas.parent("canvas-container");
  canvas.drop(parseFile);

  // Create the buffer for background drawing.
  buffer = createGraphics(containerDimensions.width, containerDimensions.height);
  buffer.background(255);

  // Redraw the snapshot.
  if (pixels !== undefined) {
    image(pixels, 0, 0);
    buffer.image(pixels, 0, 0);
  }
}


function parseFile(file) {
  console.log("Parsing file: ");
  console.log(file);

  if (file.subtype === 'png') {
    loadImage(file.data, img => {
      // Add the imported image centered in the buffer.
      buffer.imageMode(CENTER);
      buffer.image(img, 0.5 * buffer.width, 0.5 * buffer.height);
    });
  }
}


// Helper function to get the dimensions of an element.
function getElementDimensions(elementId) {
  const element = document.getElementById(elementId);
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height
  };
}