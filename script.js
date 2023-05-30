//////////////////////////////////////////////////////////////////
/// PAGE SETUP
//////////////////////////////////////////////////////////////////

////////////////////
// MASTER DIV SETUP
// Get master div element and dimensions
const masterDiv = document.getElementById("masterDiv");
// set the master div which contains all page elements to the full innerwidth and innerheight of window
masterDiv.setAttribute("style", `width:${window.innerWidth}px`);
masterDiv.setAttribute("style", `height:${window.innerHeight}px`);
// retreive the dimensions of the master div for child Divs to refer to
const mstrBbox = masterDiv.getBoundingClientRect();

////////////////////
// CONTROLS DIV SETUP
// Get controls div element and dimensions
const controlsDiv = document.getElementById("controls-div1");
// sets the controls div element to one eighth the height of the master Div
controlsDiv.setAttribute("style", `width:${mstrBbox.width}px`);
controlsDiv.setAttribute("style", `height:${mstrBbox.height / 7}px`);
// retreive the dimensions of the controls div for reference
const ctrlBbox = controlsDiv.getBoundingClientRect();
// Get clrRectBtn for clearing sections of the main canvas
const clrRectBtn = document.getElementById("clrRectBtn");
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");

/*assigns clrRectBtn the function of clearing randomly defined rectangular areas of the canvas using the
clearRandomQuadrant() function*/
clrRectBtn.addEventListener("click", async (e) => {
    clearRandomQuadrant();
});
/*assigns playButton the function of starting Tone.js audio*/
playButton.addEventListener("click", (e) => {
    enableTone();
    isPlaying = true;
});
/*assigns stopButton the function of stopping Tone.js audio*/
stopButton.addEventListener("click", (e) => {
    if(isPlaying){
        stopTone();
        isPlaying = false;
    }
});


////////////////////
// CANVAS SETUP
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const ctx2 = canvas.getContext("2d");
const cnvDiv = document.getElementById("canvasDiv");
//set the canvas Div element to occupy the full available space remaining from the controls div
cnvDiv.setAttribute("style", `width:${mstrBbox.width}px`);
cnvDiv.setAttribute("style", `height:${mstrBbox.height - ctrlBbox.height}px`);
const cnvBbox = cnvDiv.getBoundingClientRect();

//set initial canvas size
canvas.width = cnvBbox.width;
canvas.height = cnvBbox.height;

// CANVAS SETUP
////////////////////


//////////////////////////////////////////////////////////////////
/// VARIABLE DECLARATIONS
//////////////////////////////////////////////////////////////////


// Create an array to hold the lines
let lines = [];

// logs (x,y) coordinates for collision instances
// currently not being accessed by anything, but could be used for something interesting
let collisionArray = [];

// variable to increment in the update() function for progressively shifting colour hues
let hueRotate = 0;

// Initialize mouse position variables
let mouseX, mouseY;

//required boolean for start and stop of audio
let isPlaying = false;

//retrieves sliders and assigns to variables
let sldr1 = document.getElementById("sldr1");
let sldr2 = document.getElementById("sldr2");
let sldr3 = document.getElementById("sldr3");
let sldr4 = document.getElementById("sldr4");

/* establishes variables for slider values to which are given dynamic updates by below event listeners. Initialised to specific
values which are overtaken by user input once sliders are moved */
let sldr1Val = 0.3;
let sldr2Val = 0.2;
let sldr3Val = 400;
let sldr4Val = 0.3;

//event listeners to capture slider input changes

/* slider 1 presently unassigned so this can be used for testing out as an interactive control in the code if you wish
take note of both the min and max values set in the html here and the /100 division in the event listener
for the slider her, which is normalising the output value to a range bewteen 0 and 1 with 100 steps of resolution.*/
sldr1.addEventListener('input', (event) => {
    sldr1Val = event.target.value/100; // value of the range slider
})

sldr2.addEventListener('input', (event) => {
    sldr2Val = event.target.value/100; // value of the range slider
})

sldr3.addEventListener('input', (event) => {
    sldr3Val = event.target.value; // value of the range slider
})

sldr4.addEventListener('input', (event) => {
    sldr4Val = event.target.value/25; // value of the range slider
})

//tester rectangle tethered to slider 1
function addFillRect(opacity){
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.fillRect(10,10,20,20);
}


// // Initialise the lines at mouse click coordinates
// function initialize(e) {
//   // start coordinates
//   let mouseX = parseInt(e.clientX);
//   let mouseY = parseInt(e.clientY);
//   // conditional check ensures that mouse clicks in the control Div area will not register as initialisations of new lines
//   if (mouseY >= 0) {
//     //color = "lightgreen";
//     //"- ctrlBbox.height" added to correct for an offset that was occuring related to the responsive scaling of the Canvas
//     lines.push(new Line(mouseX, mouseY - ctrlBbox.height));
//   }
// }


// Initialise a random amount of lines on mouse click, randomly distributed on page
function initialize() {
    //conditional check ensures that mouse clicks in the control Div area will not register as initialisations of new lines
    if(mouseY >= 0){
        for (let i = 0; i < 5; i++) {
            //start coordinates
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            //color = "lightgreen";
            lines.push(new Line(x, y));
        }
    }
}


// Update function
function update() {
    // Hue rotate filter
    // ctx.filter = `hue-rotate(${hueRotate}deg) blur(1px)`
    // adds a full page canvas rect with dull red at very low opacity that adds that tint and is what allows 
    // the trails to build up by drawing over every update
    ctx.fillStyle = 'rgba(50, 20, 20, .05)';
    //ctx.fillStyle = '#2a9d8f50'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    lines.forEach((line, index) => {
        if (!line.dead) {
            if (!line.collision) {
                line.update();
                line.draw();
            }
        } else {
            line.unUpdate();
            line.unDraw();
            if (line.deathComplete){
                lines.splice(index, 1);
            }
        }
    });
    // enbales shift of hue for multicolour effects
    // hueRotate++;

    // //tester small rectangle with slider1 tethered to opacity
    // addFillRect(sldr1Val);

    requestAnimationFrame(update);
}




// Event listeners
window.addEventListener("mousemove", handleMouseMove);
// event listener for clicking anywhere on the page
document.addEventListener('click',(e) => {
    initialize();
    //selects a new scale randomly on each user click
    changeScaleSelection();
});

// Initialize and start the animation
update();



