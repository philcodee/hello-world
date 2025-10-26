// Simple Clock using Classes
// Demonstrates using a class to organize time display
// Includes modulo-based loops for visual cycling

// TimeDisplay class - handles displaying a time value
class TimeDisplay {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.value = 0;
  }

  // Update the time value
  update(newValue) {
    this.value = newValue;
  }

  // Display the time with label
  display() {
    // Draw label
    fill(150);
    textSize(32); // Made the text size larger for the labels
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y + 60);

    // Draw the value with leading zero if needed
    fill(255, 255, 255);
    textSize(112); // Made the text size larger for the time values
    let displayValue = nf(this.value, 2); // nf() adds leading zeros
    text(displayValue, this.x, this.y);
  }

  // Draw dots in a full circle using modulo
  // Creates dots arranged in a circle that light up based on current value
  drawModuloDots(maxValue, currentColor) {
    let radius = 120; // Radius of the circle //Increased radius to create a circle around the numbers
    let dotSize = 20; // Increased the dot size
    let centerX = this.x;
    let centerY = this.y; // Center around the time display (shifted down 5px)

    // Calculate number of dots to show (reduce for cleaner look)
    let numDots = min(maxValue, 12); // Show max 12 dots

    // Loop through and draw dots in a full circle
    for (let i = 0; i < numDots; i++) {
      // Calculate angle for this dot (full circle: 0 to TWO_PI)
      // Start at top (-HALF_PI) and go clockwise
      let angle = map(i, 0, numDots, -HALF_PI, -HALF_PI + TWO_PI);

      // Calculate position on the circle
      let dotX = centerX + cos(angle) * radius;
      let dotY = centerY + sin(angle) * radius;

      // Determine if this dot should be active based on current value
      // Using map to distribute value across the dots
      let threshold = map(i, 0, numDots - 1, 0, maxValue);

      if (this.value >= threshold) {
        // Use the current cycling color from the color bar
        fill(currentColor);
        noStroke();
        circle(dotX, dotY, dotSize);
        // Add glow effect with transparency
        fill(red(currentColor), green(currentColor), blue(currentColor), 5);
        circle(dotX, dotY, dotSize * 20);
      } else {
        fill(0, 0, 0, 70); // Black at 70% opacity
        noStroke();
        circle(dotX, dotY, dotSize);
      }
    }
  }
}

// Create three TimeDisplay objects
let hourDisplay;
let minuteDisplay;
let secondDisplay;

function setup() {
  createCanvas(800, 800);

  // Create TimeDisplay objects at different x positions
  hourDisplay = new TimeDisplay(400, 160, "hr");
  minuteDisplay = new TimeDisplay(400, 400, "min");
  secondDisplay = new TimeDisplay(400, 640, "sec");
}

function draw() {
  background(30);

  // Get current time
  let h = hour();
  let m = minute();
  let s = second();

  // Get current cycling color for the dots
  let currentColor = getCurrentColor(s);

  // Update each display with current values
  hourDisplay.update(h);
  minuteDisplay.update(m);
  secondDisplay.update(s);

  // Display each time component
  hourDisplay.display();
  minuteDisplay.display();
  secondDisplay.display();

  // Draw modulo-based dot indicators with cycling color
  // These cycle through using the current time values
  hourDisplay.drawModuloDots(24, currentColor); // 24 hours
  minuteDisplay.drawModuloDots(60, currentColor); // 60 minutes
  secondDisplay.drawModuloDots(60, currentColor); // 60 seconds

  // Draw title
  // fill(100);
  // textSize(24);
  // textAlign(CENTER, TOP);
  // text("Simple Clock", width / 2, 20);

  // Draw a color bar that cycles through colors using modulo
  // drawColorBarWithModulo(s);
}

// Function to get the current cycling color
function getCurrentColor(seconds) {
  let numColors = 6;
  let colorIndex = floor(seconds / 10) % numColors;

  let colors = [
    color(255, 100, 100, 30), // Red
    color(255, 200, 100, 30), // Orange
    color(255, 255, 100, 30), // Yellow
    color(100, 255, 100, 30), // Green
    color(100, 100, 255, 30), // Blue
    color(200, 100, 255, 30), // Purple
  ];

  return colors[colorIndex];
}

// Function that uses modulo to cycle through colors
 function drawColorBarWithModulo(seconds) {
  let barHeight = 10;
  let barY = height - 30;
 
  // Get the current color using our helper function
  let currentColor = getCurrentColor(seconds);

  // Draw the color bar
  fill(currentColor);
  noStroke();
  rect(0, barY, width, barHeight);

  // Label
  fill(150);
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text(
    "Color cycles every 10 seconds (using modulo)",
     width / 2,
     barY - 5
  );
}