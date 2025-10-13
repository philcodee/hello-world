let canvasWidth = 800;
let canvasHeight = 800;
let s = 100

//Tan and dark green for 'White' and 'Black' squares
let palette = [
  [227, 220, 194], [36, 87, 42]
];

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(255);

  // Create a 8 x 8 grid, using palette colors
  for (let i = 0; i < 8; i++) {      
    for (let j = 0; j < 8; j++) {      
      
      // Select color from palette based on position
      let colorIndex = (i + j) % 2; // using the modulo operator to alternate between black and white
      let squareColor = palette[colorIndex];
      
      drawSquare(
        j * s, 
        i * s, 
        s, 
        squareColor);  // x, y, size, color
    }
  }
}

// Helper function to draw squares
function drawSquare(x, y, side, squareColor) {
  noStroke();
  fill(squareColor);
  square(x, y, side);
}

// Saves image
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('chessboard', 'png');
  }
}