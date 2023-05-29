//////////////////////////////////////////////////////////////////
/// PAGE SETUP
//////////////////////////////////////////////////////////////////

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

// create an array for balls
const balls = [];

// logs (x,y) coordinates for collision instances
// currently not being accessed by anything, but could be used for something interesting
let collisionArray = [];

// variable to increment in the update() function for progressively shifting colour hues
let hueRotate = 0;

// Initialize mouse position variables
let mouseX, mouseY;

// Set the initial size, number and angle of new lines
const initialSize = 60;
const numRectangles = 8;
let angle = 0;



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

// function to create balls 
function createBall(x, y) {
    const ball = {x, y,
      radius: 20,
      speedX: Math.random() * 4 - 1,
      speedY: Math.random() * 4 - 1,
    };
    balls.push(ball);
  }


// function to create lines      
function createLine(x, y) {
  const lines = {
    x,
    y,
    length: Math.random() * 100 + 50,
    stretch: 1,
    speed: Math.random() * 0.2 + 0.01,
  };

  lines.push(lines);
}

// Initialise a random amount of lines on mouse click, randomly distributed on page
function initialize() {
        // I change the max amount from 500 to 10, otherwise the page would overload :) - Amy

    for (let i = 0; i < 10; i++) {
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

// Initialize and start the animation
update();


// I moved this function of event listeners to a new group - Amy

// // Event listeners
// window.addEventListener("mousemove", handleMouseMove);
// // event listener for clicking anywhere on the page
// document.addEventListener('click', initialize);



// click to generate a new ball and lines
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    createBall(mouseX, mouseY);
    initialize();
  });


  function draw() {
    // ctx.clearRect(0, 0, 600, 600);
  
    const spacing = 100;
    const maxDistance = 600;
    const gradientStops = ['blue', 'indigo', 'violet']; 
  
    for (let i = 0; i < numRectangles; i++) {
      const currentAngle = angle + (i * (2 * Math.PI / numRectangles));
      const distance = (maxDistance / numRectangles) * i;
  
      const x = canvas.width / 2 + Math.cos(currentAngle) * distance;
      const y = canvas.height / 2 + Math.sin(currentAngle) * distance;
      const size = initialSize - (i * (initialSize / numRectangles));
  
      const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
      gradientStops.forEach((color, index) => {
        gradient.addColorStop(index / (gradientStops.length - 1), color);
      });
  
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, size, size);
    }
  
      balls.forEach(ball => {
      ball.x += ball.speedX;
      ball.y += ball.speedY;
  
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.speedX = -ball.speedX;
      }
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
      }
  
      // Collision detection (balls & rect)
      for (let i = 0; i < numRectangles; i++) {
      const currentAngle = angle + (i * (2 * Math.PI / numRectangles));
      const distance = (maxDistance / numRectangles) * i;
  
      const rectX = canvas.width / 2 + Math.cos(currentAngle) * distance;
      const rectY = canvas.height / 2 + Math.sin(currentAngle) * distance;
      const rectSize = initialSize - (i * (initialSize / numRectangles));
  
      const rect = { x: rectX, y: rectY, width: rectSize, height: rectSize };
  
      if (checkCollision(ball, rect)) {
        ball.speedX = -ball.speedX;
        ball.speedY = -ball.speedY;
      }
    }

  
      ctx.fillStyle = colorPattern;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    //  To generate 
    lines.forEach(line => {
      line.stretch += line.speed;
  
      if (line.stretch > 1 || line.stretch < 0) {
        line.speed = -line.speed;
      }
  
      const startX = line.x;
      const startY = line.y;
      const endX = startX + (Math.random() * 200 - 100);
      const endY = startY + (Math.random() * 200 - 100);
      const lineLength = line.length;
  
      const lineGradient = ctx.createLinearGradient(startX, startY, endX, endY);
      lineGradient.addColorStop(0, 'yellow');
      lineGradient.addColorStop(0.5, 'red');
      lineGradient.addColorStop(1, 'blue');
  
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + (endX - startX) * line.stretch, startY + (endY - startY) * line.stretch);
      ctx.stroke();
    });
    angle += 0.02;
  
    requestAnimationFrame(draw);
  }
  
  
  draw();