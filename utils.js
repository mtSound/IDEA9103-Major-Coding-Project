// COLLISION FUNCTION
// set a 'resolution' for rounding coordinates - if we don't do this, matched coordinates are too specific to compute
const resolution = 3;

// ARRAY CONTAINS OBJECT
// check if an object is present in an array, the main function for collision detection
// it also performs some rounding so that close matches are also evaluated (within +/- resolution)
function arrContainsObject(obj, arr) {
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i].x >= (obj.x - resolution) && arr[i].x <= (obj.x + resolution)) && (arr[i].y >= (obj.y - resolution) && arr[i].y <= (obj.y + resolution))) {
            return true;
        }
    }
    return false;
}

// Check the array of 'Line families' for a family ID
// If it's already present, increment the family count
// otherwise add a new familyID
function checkArr(array, key) {
    let found = false;
    for (let i = 0; i < array.length; i++) {
        if (array[i].familyID === key) {
            array[i].familyCount += 1;
            found = true;
        }
    }

    if (!found) {
        let newFamily = {
            familyID: key,
            familyCount: 1
        }
        array.push(newFamily);
    }
}

// Reduce the family count when a line dies
function reduceArr(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].familyID === key) {
            array[i].familyCount -= 1;
        }
    }
}

// Check the size of a family
function checkFamilySize(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].familyID === key) {
            return array[i].familyCount;
        }
    }
}

// Remove a family from the LineFamilies array
function removeFamily(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].familyID === key) {
            if (array[i].familyCount === 0) {
                array.splice([i], 1);
            }
        }
    }
}

//OVERLOADED RANDOM FUNCTION
//random will return a value between 0 and 1 (not including 1)
//random (upper) will return a value between 0 and upper (not including upper)
//random (lower, upper) will return a value between lower and upper (not including upper) 
function random() {
    switch (arguments.length) {
        case 0:
            return Math.random();
        case 1:
            if (typeof arguments[0] == 'number') {
                return Math.random() * arguments[0];
            } else if (Array.isArray(arguments[0])) {
                let index = Math.floor(random(arguments[0].length));
                return arguments[0][index];
            }
        case 2:
            return arguments[0] + Math.random() * (arguments[1] - arguments[0]);
        default:
            console.log("too many arguments passed to random()");
            break;
    }
}

// OVERLOADED RANDOM COLOUR FUNCTION
// you can pass in an argument to append opacity/transparency
function getRandomColour() {
    const letters = "0123456789ABCDEF";
    switch (arguments.length) {
        case 0:
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            //color += "10"
            return color;
        case 1: //add transparency
            if (typeof arguments[0] == 'number') {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];

                }
                color += `${arguments[0]}`;
                //console.log(arguments[0])
                return color;
            }
    }
}

// // CLEAR RANDOM RECT FUNCTION
// function clearRandomQuadrant() {
//     clearX = canvas.width * random();
//     clearY = canvas.height * random();
//     clearWidth = Math.round(random(canvas.width));
//     clearHeight = Math.round(random(canvas.height));

//     ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
//     // removes from the lines array stored coordinates matching the cleared area 
//     rectClearArraySweep()
// }

// // REMOVE XY COORDS FROM ARRAY FOLLOWING RANDOM RECT
// function rectClearArraySweep() {
//     for (let i = lines.length - 1; i > 0; i--) {
//         if (
//             lines[i].x >= clearX &&
//             lines[i].x <= clearX + clearWidth &&
//             lines[i].y >= clearY &&
//             lines[i].y <= clearY + clearHeight
//         ) {
//             //removes from the array any instance which passed the above conditions
//             lines.splice(i, 1);
//         }
//     }
// }


// MOUSE MOVEMENT FUNCTION
// offsets for the height of the control DIV
function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY - ctrlBbox.height;
}

// Simple boolean to check whether or not it's the first canvas click (generate multiple lines), or a later click (generate a single line)
function initOrSeed() {
    if (firstClick) {
        initialize();
    } else {
        seed(event);
    }
}

function fadeInAbstract() {
    if (!window.AnimationEvent) { return; }
    fader.classList.add('fade-out');
    abstract.classList.add('fade-in');
}

function fadeOutAbstract() {
    pageLoadDiv.classList.add('fade-out');
}

function fadeInCanvas() {
    masterDiv.classList.add('fade-in');
}

/////////// Array of background colours to cycle through ///////////////
let backgroundColors = [
    "#083691",
    "#062d79",
    "#052461",
    "#041b49",
    "#031230",
    "#010918",
    "#000000"
]
let currentIndex = 0;

// Interval for cycling background colours
setInterval(function () {
    document.body.style.cssText = "background-color: " + backgroundColors[currentIndex];
    currentIndex++;
    if (currentIndex == undefined || currentIndex >= backgroundColors.length) {
        currentIndex = 0;
    }
}, 1000);

function updateDimensions() {
    masterDiv.setAttribute("style", `width:${window.innerWidth}px`);
    masterDiv.setAttribute("style", `height:${window.innerHeight}px`);
    mstrBbox = masterDiv.getBoundingClientRect();
    controlsDiv.setAttribute("style", `width:${mstrBbox.width}px`);
    controlsDiv.setAttribute("style", `height:${mstrBbox.height / 15}px`);
    ctrlBbox = controlsDiv.getBoundingClientRect();
    cnvDiv.setAttribute("style", `width:${mstrBbox.width}px`);
    cnvDiv.setAttribute("style", `height:${mstrBbox.height - ctrlBbox.height}px`);
    cnvBbox = cnvDiv.getBoundingClientRect();
    canvas.width = cnvBbox.width;
    canvas.height = cnvBbox.height;
    clrSqrWidth = canvas.width / clearDimensions;
    clrSqrHeight = canvas.height;
}