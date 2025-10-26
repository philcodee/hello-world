// Step 6 (altered): Full HD output (1920×1080), 8×4 grid layout
// Configurable alpha for fill and outline separately
// Produces high-resolution exports
// This is the p5.js equivalent of looping-pattern-step6.py

let canvasWidth = 1920;
let canvasHeight = 1080;
let cellWidth = 1920 / 8;
let cellHeight = 1080 / 4;

// Color palette - grayscale (16 colors)
let palette = [
  [0, 0, 0], [10, 0, 0], [20, 0, 0], [30, 0, 0],
  [30, 10, 0], [30, 20, 0], [30, 30, 10], [30, 30, 20],
  [30, 30, 30], [40, 30, 30], [50, 30, 30], [60, 40, 30],
  [60, 50, 30], [60, 60, 40], [60, 60, 50], [60, 60, 60]
];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
}

function draw() {
  // Black background
  background(120, 70, 10);

  // Create a 8×4 grid to fill the HD canvas
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      drawMultipleCircles(
        i * cellWidth,
        j * cellHeight,
        cellWidth,
        48  // number of circles to draw
      );
    }
  }
}

// Helper function to draw a single circle with fill and outline
function drawCircle(x, y, diameter, fillColor, strokeColor) {
  fill(fillColor);
  stroke(strokeColor);
  strokeWeight(1);
  ellipse(x + diameter / 2, y + diameter / 2, diameter, diameter);
}

// Helper function to draw multiple circles in a circular pattern
function drawMultipleCircles(x, y, diameter, number) {
  // Calculate angle between each circle
  let angle = PI / number;

  for (let i = 0; i < number; i++) {
    // Use sin and cos to position circles in a circle
    let newX = sin(angle * i) * diameter / 4 + x;
    let newY = cos(angle * i) * diameter / 4 + y;

    // Get color from palette (cycle through if needed)
    let circleColor = palette[i % palette.length];

    // Fill color with no opacity (0 alpha) - only outline visible
    let fillColor = color(circleColor[0], circleColor[1], circleColor[2], 0);
    // Outline color with full opacity (255 alpha)
    let strokeColor = color(circleColor[0], circleColor[1], circleColor[2], 255);

    drawCircle(newX, newY, diameter, fillColor, strokeColor);
  }
}

// Press 's' to save the canvas as a high-resolution image
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('myImage', 'png');
  }
}