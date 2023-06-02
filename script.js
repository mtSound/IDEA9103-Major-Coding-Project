//////////////////////////////////////////////////////////////////
/// PAGE SETUP
//////////////////////////////////////////////////////////////////

// pade load and abstract elements
const fader = document.getElementById('fader');
const pageLoadDiv = document.getElementById("pageload");
const abstract = document.getElementById('abstract');

////////////////////
// MASTER DIV SETUP
// Get master div element and dimensions
let masterDiv = document.getElementById("masterDiv");
// set the master div which contains all page elements to the full innerwidth and innerheight of window
masterDiv.setAttribute("style", `width:${window.innerWidth}px`);
masterDiv.setAttribute("style", `height:${window.innerHeight}px`);
// retreive the dimensions of the master div for child Divs to refer to
let mstrBbox = masterDiv.getBoundingClientRect();

////////////////////
// CONTROLS DIV SETUP
// Get controls div element and dimensions
let controlsDiv = document.getElementById("controls-div1");
// sets the controls div element to one eighth the height of the master Div
controlsDiv.setAttribute("style", `width:${mstrBbox.width}px`);
controlsDiv.setAttribute("style", `height:${mstrBbox.height / 15}px`);
// retreive the dimensions of the controls div for reference
let ctrlBbox = controlsDiv.getBoundingClientRect();
// Get clrRectBtn for clearing sections of the main canvas
const clrRectBtn = document.getElementById("clrRectBtn");
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");

/*assigns clrRectBtn the function of enabling the canvas to be cleared via a sweeping bar from left to right, executed by a conditional
waiting for canvasClearable to be set to 'true'*/
clrRectBtn.addEventListener("click", async (e) => {
    canvasClearable = true;
});

masterDiv.style.display = "none";
let pageLoad = true;


////////////////////
// CANVAS SETUP
let cnvelement = document.querySelector('.canvas')
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let ctx2 = canvas.getContext("2d");
let cnvDiv = document.getElementById("canvasDiv");
//set the canvas Div element to occupy the full available space remaining from the controls div
cnvDiv.setAttribute("style", `width:${mstrBbox.width}px`);
cnvDiv.setAttribute("style", `height:${mstrBbox.height - ctrlBbox.height}px`);
let cnvBbox = cnvDiv.getBoundingClientRect();

//set initial canvas size
canvas.width = cnvBbox.width;
canvas.height = cnvBbox.height;

let clearDimensions = 120;
let canvasClearable = false;

let clrSqrX = 0;
let clrSqrY = 0;
let clrSqrWidth = canvas.width / clearDimensions;
let clrSqrHeight = canvas.height;

function clearFullCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


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
    masterDiv.width = window.innerWidth;
    masterDiv.height = window.innerHeight;
    mstrBbox = masterDiv.getBoundingClientRect();
    controlsDiv.width = mstrBbox.width;
    controlsDiv.height = mstrBbox.height / 15;
    ctrlBbox = controlsDiv.getBoundingClientRect();
    cnvDiv.width = mstrBbox.width;
    cnvDiv.height =mstrBbox.height - ctrlBbox.height;
    cnvBbox = cnvDiv.getBoundingClientRect();
    canvas.width = cnvBbox.width;
    canvas.height = cnvBbox.height;
    clrSqrWidth = canvas.width / clearDimensions;
    clrSqrHeight = canvas.height;
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

/* establishes variables for slider values to which are given dynamic updates by below event listeners. Initialised to specific
values which are overtaken by user input once sliders are moved */
let sldr1Val = 0.3;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
/// LINE BEHAVIOURS
//////////////////////////////////////////////////////////////////

// limit this to around 5
let numOfLines = 7;// number of lines to start with - scaled to canvas

let childScaling = 0.0001;//scaling for the speed of children (be gentle)

let populationMax = 20;// the limit at which scaling back occurs

let userStrength = 60;// how strongly the mouse interacts with lines

let linesAvoid = true;


//////////////////////////////////////////////////////////////////
/// BLACKHOLE BEHAVIOURS
//////////////////////////////////////////////////////////////////

// Set the initial size, number and angle of new lines
let numOfBlackholes = 1;

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
// sldr1.addEventListener('input', (event) => {
//     sldr1Val = event.target.value / 100; // value of the range slider
// })

//tester rectangle tethered to slider 1
function addFillRect(opacity) {
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    if (shouldCanvasResize) {
        resizeMainCanvas();

        let now = new Date();
        if (now - lastWindowResize >= 1000) {
            //at least 1000ms since last resize
            resizeDrawingCanvas();
            //resizeMainCanvas();
            shouldCanvasResize = false;
        }
    }

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


    // //tester small rectangle with slider1 tethered to opacity
    // addFillRect(sldr1Val);
    requestAnimationFrame(update);
    addEventListener("resize", windowResized);

    if (canvasClearable) {
        if (clrSqrX < canvas.width) {
            ctx.clearRect(clrSqrX, clrSqrY, clrSqrWidth, clrSqrHeight)
            ctx2.clearRect(clrSqrX, clrSqrY, clrSqrWidth, clrSqrHeight)
            clrSqrX += clrSqrWidth;
        }
        else {
            canvasClearable = false
            clrSqrX = 0;
            isPlaying = true;
        }
    }

}

fadeInAbstract();

// Initialize the animation
update();


//////////////////////////////////////////////////////////////////
/// EVENT LISTENERS
//////////////////////////////////////////////////////////////////

// Event listeners
window.addEventListener("mousemove", handleMouseMove);

// Event listeners
window.addEventListener("mousemove", handleMouseMove);

document.addEventListener('click', (e) => {
    if (pageLoad === true) {
        fadeOutAbstract();
        setTimeout(() => {
            pageLoadDiv.style.display = "none";
            masterDiv.style.display = "block";
            fader.style.opacity = 0;
             fader.style.display = "none";
            fadeInCanvas();
            updateDimensions();
            pageLoad = false;
        }, 3100);
    }
    else {
        initOrSeed();
        changeScaleSelection();
        playTone();
    }

});