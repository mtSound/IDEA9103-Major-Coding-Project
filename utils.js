// COLLISION FUNCTION
// set a 'resolution' for rounding coordinates - if we don't do this, matched coordinates are too specific to compute
const resolution = 3;
// check if an object is present in an array
// it also performs some rounding so that close matches are also evaluated (within +/- resolution)
function arrContainsObject(obj, arr) {
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i].x >= (obj.x - resolution) && arr[i].x <= (obj.x + resolution)) && (arr[i].y >= (obj.y - resolution) && arr[i].y <= (obj.y + resolution))) {
            collisionArray.push({ x: arr[i].x, y: arr[i].y });
            // //once the array has multiple entries, draws a line from the first collision point to the most recent
            // if(collisionArray.length>=2){
            //   x1 = collisionArray[0].x;
            //   y1 = collisionArray[0].y;
            //   x2 = collisionArray[collisionArray.length-1].x;
            //   y2 = collisionArray[collisionArray.length-1].y;
            //   drawLine(x1,y1,x2,y2);
            // }
            return true;
        }
    }
    return false;
}

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
        //return newFamily;
    }
}

function checkFamilySize(array, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].familyID === key) {
            return array[i].familyCount;
        }
        // } else {
        //     return false;
        // }
    }
}

//familyObject['familyCount']++;

//OVERLOADED RANDOM FUNCTION
//random will return a value between 0 and 1 (not including 1)
//random (upper) will return a value between 0 and upper (not including upper)
//random (lower, upper) will return a value between lower and upper (not including upper) 
function random() {
    switch (arguments.length) {
        case 0:
            return Math.random();
        //break;
        case 1:
            if (typeof arguments[0] == 'number') {
                return Math.random() * arguments[0];
            } else if (Array.isArray(arguments[0])) {
                let index = Math.floor(random(arguments[0].length));
                return arguments[0][index];
            }
        //break;
        case 2:
            return arguments[0] + Math.random() * (arguments[1] - arguments[0]);
        //break;
        default:
            console.log("too many arguments passed to random()");
            break;
    }
}

// RANDOM COLOUR FUNCTION
function getRandomColour() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//LINE DRAWING FUNCTION
function drawLine(x1, y1, x2, y2) {
    ctx2.beginPath();
    ctx2.moveTo(x1, y1);
    ctx2.lineTo(x2, y2);
    ctx2.strokeStyle = "rgba(255,255,255,1)";
    //ctx2.strokeStyle = colour ?? getRandomColour();
    ctx2.lineWidth = 0.2;
    ctx2.stroke();
}

// CLEAR RANDOM RECT FUNCTION
function clearRandomQuadrant() {
    clearX = canvas.width * random();
    clearY = canvas.height * random();
    clearWidth = Math.round(random(canvas.width));
    clearHeight = Math.round(random(canvas.height));

    ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
    // removes from the lines array stored coordinates matching the cleared area 
    rectClearArraySweep()
}

// REMOVE XY COORDS FROM ARRAY FOLLOWING RANDOM RECT
function rectClearArraySweep() {
    for (let i = lines.length - 1; i > 0; i--) {
        if (
            lines[i].x >= clearX &&
            lines[i].x <= clearX + clearWidth &&
            lines[i].y >= clearY &&
            lines[i].y <= clearY + clearHeight
        ) {
            //removes from the array any instance which passed the above conditions
            lines.splice(i, 1);
        }
    }
}

// MOUSE MOVEMENT FUNCTION
function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY - ctrlBbox.height;
}