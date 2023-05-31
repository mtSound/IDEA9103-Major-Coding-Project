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
let mstrBbox = masterDiv.getBoundingClientRect();

////////////////////
// CONTROLS DIV SETUP
// Get controls div element and dimensions
const controlsDiv = document.getElementById("controls-div1");
// sets the controls div element to one eighth the height of the master Div
controlsDiv.setAttribute("style", `width:${mstrBbox.width}px`);
controlsDiv.setAttribute("style", `height:${mstrBbox.height / 7}px`);
// retreive the dimensions of the controls div for reference
let ctrlBbox = controlsDiv.getBoundingClientRect();
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
const cnvelement = document.querySelector('.canvas')
const canvas = document.getElementById("canvas");
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

let opts = {
    blurLevel: 0.5,
    fill: 'rgba(50, 20, 20, .05)',
};

//////////////////////////////////////////////////////////////////
/// ColorPattern set up
var colorPattern = [
    "#002db3",
    "#4d79ff",
    "#00076f",
    "#44008b",
    "#9f45b0",
    "#e54ed0",
    "#ffe4f2"

]
var galaxyColor = [
    "#2B506F",
    "#182937",
    "#B1BED2",
    "#4C7097",
    "#7591BB",
]

////////////////////
// JOEL'S WINDOW RESIZING FUNCTION

let offscreen, layer;//declare the offscreen canvas & context variables for use

let lastWindowResize;
let shouldCanvasResize = false;//initialise as false
let firstClick = true;

function windowResized() {
    //onresize event callback
    lastWindowResize = new Date();//store timestamp of current time to compare later
    shouldCanvasResize = true;//set the flag that will resize the canvas when the time is right
}

function resizeDrawingCanvas() {
    offscreen = new OffscreenCanvas(canvas.width, canvas.height);//make it the same size as the main canvas on the DOM
    layer = offscreen.getContext('2d');//another context
}


function resizeMainCanvas() {
    //standard resizing of the main canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//////////////////////////////////////////////////////////////////
/// VARIABLE DECLARATIONS
//////////////////////////////////////////////////////////////////

let blackholes = [];

let lines = [];// Create an array to generate lines

let collisionArray = [];//logs (x,y) coordinates for collision instances

let hueRotate = 0;// shift the colour hues

let mouseX, mouseY;// Initialize mouse position variables

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
/// LINE BEHAVIOURS
//////////////////////////////////////////////////////////////////

// limit this to around 5
let numOfLines = 5;// number of lines to start with - scaled to canvas

let childScaling = 0.0001;//scaling for the speed of children (be gentle)

let populationMax = 20;// the limit at which scaling back occurs

let userStrength = 60;// how strongly the mouse interacts with lines

let linesAvoid = true;


//////////////////////////////////////////////////////////////////
/// BLACKHOLE BEHAVIOURS
//////////////////////////////////////////////////////////////////

// Set the initial size, number and angle of new lines
let numOfBlackholes = 2;

let initialSize = 20;

let numRectangles = 6;

let angle = 2;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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




// Initialise a random amount of lines on mouse click, randomly distributed on page
function initialize() {
    if (mouseY >= 0) {
        for (let i = 0; i < numOfLines; i++) {
            //start coordinates
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            lines.push(new Line(x, y));
            firstClick = false;
        }
        for (let i = 0; i < numOfBlackholes; i++) {
            //start coordinates
            let centreX = random(0, canvas.width);
            let centreY = random(0, canvas.height);
            blackholes.push(new Blackhole(centreX, centreY));
        }
    }
}


// Initialise the lines at mouse click coordinates
function seed(event) {
    mouseX = event.clientX;
    mouseY = event.clientY - ctrlBbox.height;
    lines.push(new Line(mouseX, mouseY));
}

// Update function
function update() {
    resizeMainCanvas();
    resizeDrawingCanvas();
    if (shouldCanvasResize) {
        resizeMainCanvas();//this is important, we only resize the main canvas at the beginning of a draw loop. 
        //This way we don't get any canvas blanking.

        let now = new Date();
        if (now - lastWindowResize >= 1000) {
            //at least 1000ms since last resize
            resizeDrawingCanvas();
            shouldCanvasResize = false;
        }
    }

    // Hue rotate filter
    //ctx.filter = `hue-rotate(${hueRotate}deg) blur(0.3px)`;
    ctx.fillStyle = opts.fill;
    ctx.globalAlpha = opts.blurLevel;
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
            if (line.deathComplete) {
                lines.splice(index, 1);
            }
        }
    });
    blackholes.forEach((blackhole) => {
        blackhole.update();
        blackhole.draw();
    });
    // enbales shift of hue for multicolour effects
    // hueRotate++;

    // //tester small rectangle with slider1 tethered to opacity
    // addFillRect(sldr1Val);
    requestAnimationFrame(update);
    addEventListener("resize", windowResized);
}


// Initialize and start the animation
update();


//////////////////////////////////////////////////////////////////
/// EVENT LISTENERS
//////////////////////////////////////////////////////////////////

// Event listeners
window.addEventListener("mousemove", handleMouseMove);

// // event listener for clicking anywhere on the page
// document.addEventListener('click', initOrSeed);

// Event listeners
window.addEventListener("mousemove", handleMouseMove);
// event listener for clicking anywhere on the page

document.addEventListener('click', (e) => {
    initOrSeed();
    //initialize();
    //selects a new scale randomly on each user click
    changeScaleSelection();
});