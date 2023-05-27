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
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const ctx2 = canvas.getContext("2d");
const cnvDiv = document.getElementById("canvasDiv");
//set the canvas Div element to occupy the full available space remaining from the button Div
cnvDiv.setAttribute("style", `width:${mstrBbox.width}px`);
cnvDiv.setAttribute("style", `height:${mstrBbox.height - btnBbox.height}px`);
const cnvBbox = cnvDiv.getBoundingClientRect();

//set initial canvas size
canvas.width = cnvBbox.width;
canvas.height = cnvBbox.height;


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




// // Initialise the lines at mouse click coordinates
// function initialize(e) {
//   // start coordinates
//   let mouseX = parseInt(e.clientX);
//   let mouseY = parseInt(e.clientY);
//   // conditional check ensures that mouse clicks in the button Div area will not register as initialisations of new lines
//   if (mouseY > btnBbox.height) {
//     //color = "lightgreen";
//     //"- btnBbox.height" added to correct for an offset that was occuring related to the responsive scaling of the Canvas
//     lines.push(new Line(mouseX, mouseY - btnBbox.height));
//   }
// }

// Initialise a random amount of lines on mouse click, randomly distributed on page
function initialize() {
    for (let i = 0; i < 500; i++) {
        //start coordinates
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        //color = "lightgreen";
        lines.push(new Line(x, y));
    }
}


// Update function
function update() {
    // Hue rotate filter
    //ctx.filter = `hue-rotate(${hueRotate}deg) blur(1px)`
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
    //hueRotate++;
    requestAnimationFrame(update);
}




// Event listeners
window.addEventListener("mousemove", handleMouseMove);
// event listener for clicking anywhere on the page
document.addEventListener('click', initialize);

// Initialize and start the animation
update();



