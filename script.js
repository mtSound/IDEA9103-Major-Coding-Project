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
// BUTTON DIV SETUP
// Get button div element and dimensions
const buttonDiv = document.getElementById("button-div1");
// sets the button Div element to one eighth the height of the master Div
buttonDiv.setAttribute("style", `width:${mstrBbox.width}px`);
buttonDiv.setAttribute("style", `height:${mstrBbox.height / 12}px`);
// retreive the dimensions of the button div for reference
const btnBbox = buttonDiv.getBoundingClientRect();
// Get button 1
const button1 = document.getElementById("button1");

/*assigns button 1 the function of clearing randomly defined rectangular areas of the canvas using the
clearRandomQuadrant() function*/
button1.addEventListener("click", () => {
    clearRandomQuadrant();
})


////////////////////
// CANVAS SETUP
const cnvelement = document.querySelector('.canvas')
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx2 = canvas.getContext("2d");
const cnvDiv = document.getElementById("canvasDiv");
//set the canvas Div element to occupy the full available space remaining from the button Div
cnvDiv.setAttribute("style", `width:${mstrBbox.width}px`);
cnvDiv.setAttribute("style", `height:${mstrBbox.height - btnBbox.height}px`);
const cnvBbox = cnvDiv.getBoundingClientRect();


//set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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


//////////////////////////////////////////////////////////////////
/// EVENT LISTENERS
//////////////////////////////////////////////////////////////////

// Event listeners
window.addEventListener("mousemove", handleMouseMove);

// event listener for clicking anywhere on the page
document.addEventListener('click', initOrSeed);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
/// LINE BEHAVIOURS
//////////////////////////////////////////////////////////////////

//let numOfLines = canvas.width / 32;// number of lines to start with - scaled to canvas
let numOfLines = 20;

let childScaling = 0.0001;//scaling for the speed of children (be gentle)

let populationMax = 20;// the limit at which scaling back occurs

let userStrength = 60;// how strongly the mouse interacts with lines

let linesAvoid = true;


//////////////////////////////////////////////////////////////////
/// BLACKHOLE BEHAVIOURS
//////////////////////////////////////////////////////////////////

// Set the initial size, number and angle of new lines
let numOfBlackholes = 4;

let initialSize = 20;

let numRectangles = 6;

let angle = 0;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Initialise a random amount of lines on mouse click, randomly distributed on page
function initialize() {
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


// Initialise the lines at mouse click coordinates
function seed(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
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
    ctx.filter = `hue-rotate(${hueRotate}deg) blur(0.3px)`;
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
    blackholes.forEach((blackhole) =>{
        blackhole.update();
        blackhole.draw();
    });
    // enbales shift of hue for multicolour effects
    hueRotate++;
    requestAnimationFrame(update);
    addEventListener("resize", windowResized);
}


// Initialize and start the animation
update();





