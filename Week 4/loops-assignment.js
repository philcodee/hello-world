
// Primary source for code: My idea was to start simple by drawing a square on the screen and have it follow the cursor around. p5.js reference pages: square(...), doubleClicked(), draw() 

// AI Use: I also wanted to apply a double-click behavior to the sqaure fill. 

// The doubleCLicked() reference page did not provide an exact example of that, 

// so I gave GPT the code block and it suggested assigning the sqaure fill to "value", instead of a constant integer! 

// ---Assignment starts here---

// Start with a variable called 'value' and set to zero.

let value = 0

// When sketch starts make a drawing area that is 800 x 800 px.

function setup() {
    createCanvas (800, 800);
} 

// When draw loop starts, set the background to light gray, draw a square, set square fill to "value", which first equals zero.

function draw() {
    background(220);
    fill(value); // <- This is where GPT helped me
    square(mouseX, mouseY, 100);
}

//When user double-clicks, if value is exactly (is integer, is equal to zero) change to "255". If the user double-clicks again, change the value back to "0".

function doubleClicked() {
    if (value === 0) {
        value = 255;
    } else {
        value = 0;
    }
}