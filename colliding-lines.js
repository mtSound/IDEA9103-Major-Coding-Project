let lineFamilies = [];
// Line class
class Line {
    constructor(x, y, vx, vy, speed, colour, lineWidth, familyID, depth) {
        this.x = x;
        this.y = y;
        this.vx = vx ?? random(-1, 1); // Random velocity for x-axis (-1 to 1)
        this.vy = vy ?? random(-1, 1); // Random velocity for y-axis (-1 to 1)
        this.speed = speed ?? childScaling;
        this.depth = depth ?? 3;
        this.color = colour ?? lineColour;
        this.lineWidth = lineWidth ?? random(0.5, 4); // Random line width (1 to 4)
        this.prevX = x; // Previous x position
        this.prevY = y; // Previous y position
        this.canvas = offscreen;
        this.ctx = layer;
        this.xyArr = []; // initialise an empty xyArr to store the line coordinates every time it calls the update method
        this.familyID = familyID ?? random(); // set a 'family ID' so lines from the same lineage can't collide with each other
        this.dead = false;
        this.deathComplete = false;
        this.deadX;
        this.deadY;
        this.prevDeadX;
        this.prevDeadY;

        //check the familyID - if it exists, add to the familyCount. Otherwise, create a new family
        checkArr(lineFamilies, this.familyID);
    }

    update() {

        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.vx;
        this.y += this.vy;

        // Check for collision with the canvas borders
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
        }


        // Check for interaction with mouse position
        let dxMouse = mouseX - this.x;
        let dyMouse = mouseY - this.y;
        let distanceMouse = Math.sqrt(dxMouse ** 2 + dyMouse ** 2);
        if (mouseY > 5 && mouseY < canvas.height - 5) {
            if (mouseX > 5 && mouseX < canvas.width - 5) {
                if (distanceMouse < userStrength) {
                    let angleMouse = Math.atan2(dyMouse, dxMouse);
                    let targetXMouse = this.x + Math.cos(angleMouse) * (userStrength / 2);
                    let targetYMouse = this.y + Math.sin(angleMouse) * (userStrength / 2);
                    let axMouse = (targetXMouse - mouseX) * 0.02;
                    let ayMouse = (targetYMouse - mouseY) * 0.02;
                    this.vx -= axMouse;
                    this.vy -= ayMouse;
                }
            }
        }


        this.xy = {
            x: this.x,
            y: this.y,
        };
        this.xyArr.push(this.xy);

        // Check for collision with other lines & stop
        lines.forEach((line) => {
            if (line.familyID !== this.familyID) {
                let dxLines = line.x - this.x;
                let dyLines = line.y - this.y;
                let distanceLines = Math.sqrt(dxLines ** 2 + dyLines ** 2);
                if (distanceLines < populationMax / 2) {
                    let angleLines = Math.atan2(dyLines, dxLines);
                    let targetXLine = this.x + Math.cos(angleLines) * (populationMax / 8);
                    let targetYLine = this.y + Math.sin(angleLines) * (populationMax / 8);
                    let axLines = (targetXLine - line.x) * 0.02;
                    let ayLines = (targetYLine - line.y) * 0.02;
                    this.vx -= axLines;
                    this.vy -= ayLines;
                }
                if (arrContainsObject(this.xy, line.xyArr)) {
                    this.collision = true;
                    this.collisionxy = this.xy;
                    this.createChild();
                    this.dead = true;
                }
            }
        });

        if (this.xyArr.length > ((2 * canvas.width) * (1 / this.lineWidth))) {
            this.dead = true;
            //console.log("a tone would be played");
        }
    }

    draw() {
        // draw on the offscreen canvas
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        ctx.drawImage(this.canvas, 0, 0);


    }

    createChild() {
        let familySize = checkFamilySize(lineFamilies, this.familyID);
        if (this.depth === 3) { //if it's the first gen
            // create a random number of children, scaled to depth
            let children = random(0, 2);
            // children all spawn in the same direction
            if (!this.dead) {
                for (let i = 0; i < children; i++) {
                    // pick a random point along the parent line to spawn child from
                    let xy = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
                    let vxChild = random(-1, 1) + (1 + this.speed);
                    let vyChild = random(-1, 1) + (1 + this.speed);
                    // conditional to stop generating children if the distance between the the generation point and recent collision is too small
                    if ((Math.sqrt((xy.x - this.xy.x) ** 2 + (xy.y - this.xy.y) ** 2)) > 10) {
                        let child = new Line(xy.x, xy.y, vxChild, vyChild, this.speed + this.speed, this.color, this.lineWidth * 0.75, this.familyID, this.depth + 1);
                        lines.push(child);
                    }
                }
            }
        } else if (familySize > populationMax) { // if the population has been exceeded
            let vxChild = random(-1, 1) / (1 + this.speed);
            let vyChild = random(-1, 1) / (1 + this.speed);
            let children = random(0, 1);
            if (!this.dead) {
                for (let i = 0; i < children; i++) {
                    let xy = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
                    if ((Math.sqrt((xy.x - this.xy.x) ** 2 + (xy.y - this.xy.y) ** 2)) > 20) {
                        let child = new Line(xy.x, xy.y, vxChild, vyChild, this.speed / 4, this.color, this.lineWidth, this.familyID, this.depth - 4);
                        lines.push(child);
                    }
                }
            }
        } else {
            // create a random number of children, scaled to depth
            let children = this.depth;
            // children all spawn in the same direction
            if (!this.dead) {
                for (let i = 0; i < children; i++) {
                    // pick a random point along the parent line to spawn child from
                    let xy = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
                    let vxChild = random(-1, 1) * (1 + this.speed);
                    let vyChild = random(-1, 1) * (1 + this.speed);
                    // conditional to stop generating children if the distance between the the generation point and recent collision is too small
                    if ((Math.sqrt((xy.x - this.xy.x) ** 2 + (xy.y - this.xy.y) ** 2)) > 10) {
                        let child = new Line(xy.x, xy.y, vxChild, vyChild, this.speed + this.speed, this.color, this.lineWidth * 0.75, this.familyID, this.depth + 1);
                        lines.push(child);
                    }
                }
            }
        }
    }

    unUpdate() {
        if (this.xyArr.length > 1) {
            let deadXY = this.xyArr[this.xyArr.length - 1];
            let nextDeadXY = this.xyArr[this.xyArr.length - 2];
            this.prevDeadX = deadXY.x;
            this.prevDeadY = deadXY.y;
            this.deadX = nextDeadXY.x;
            this.deadY = nextDeadXY.y;
            this.xyArr.pop();
        } else {
            this.xyArr = [];
            this.deathComplete = true;
            reduceArr(lineFamilies, this.familyID);

            let familySize = checkFamilySize(lineFamilies, this.familyID);
            if (familySize < 1) {
                console.log("a sound could be played");
                removeFamily(lineFamilies, this.familyID)

            }

        }
    }

    unDraw() {
        // draw on the offscreen canvas
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.moveTo(this.prevDeadX, this.prevDeadY);
        this.ctx.lineTo(this.deadX, this.deadY);
        this.ctx.strokeStyle = '#00000080';
        this.ctx.lineWidth = this.lineWidth * 1.5;
        this.ctx.stroke();
        ctx.drawImage(this.canvas, 0, 0);
    }
}