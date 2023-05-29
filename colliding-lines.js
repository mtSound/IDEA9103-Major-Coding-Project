let lineFamilies = [{ familyID: 0, familyCount: 0 }];
// Line class
class Line {
    constructor(x, y, vx, vy, speed, colour, lineWidth, familyID, depth) {
        this.x = x;
        this.y = y;
        this.vx = vx ?? random(-1, 1); // Random velocity for x-axis (-1 to 1)
        this.vy = vy ?? random(-1, 1); // Random velocity for y-axis (-1 to 1)
        this.speed = speed ?? 0.01;
        this.depth = depth ?? 1;
        this.color = colour ?? getRandomColour();
        this.lineWidth = lineWidth ?? random(1, 4); // Random line width (1 to 4)
        this.prevX = x; // Previous x position
        this.prevY = y; // Previous y position
        this.canvas = new OffscreenCanvas(cnvBbox.width, cnvBbox.height);
        this.ctx = this.canvas.getContext('2d');
        this.xyArr = []; // initialise an empty xyArr to store the line coordinates every time it calls the update method
        this.familyID = familyID ?? random(); // set a 'family ID' so lines from the same lineage can't collide with each other
        this.dead = false;
        this.deathComplete = false;
        this.deadX;
        this.deadY;
        this.prevDeadX;
        this.prevDeadY;

        //check the familyID
        let key = this.familyID;
        checkArr(lineFamilies, key);
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
        const dxMouse = mouseX - this.x;
        const dyMouse = mouseY - this.y;
        const distanceMouse = Math.sqrt(dxMouse ** 2 + dyMouse ** 2);
        if (distanceMouse < 50) {
            const angleMouse = Math.atan2(dyMouse, dxMouse);
            const targetXMouse = this.x + Math.cos(angleMouse) * 50;
            const targetYMouse = this.y + Math.sin(angleMouse) * 50;
            const axMouse = (targetXMouse - mouseX) * 0.02;
            const ayMouse = (targetYMouse - mouseY) * 0.02;
            this.vx -= axMouse;
            this.vy -= ayMouse;
        }


        this.xy = {
            x: this.x,
            y: this.y,
        };
        this.xyArr.push(this.xy);

        // Check for collision with other lines & stop
        lines.forEach((line) => {
            if (line.familyID !== this.familyID) {
                if (arrContainsObject(this.xy, line.xyArr)) {
                    this.collision = true;
                    this.collisionxy = this.xy;
                    this.createChild();
                    this.dead = true;
                }
            }
        });

        if (this.xyArr.length > 1000) {
            this.dead = true;
        }
    }

    draw() {
        // // draw on the main canvas
        // ctx.beginPath();
        // ctx.lineCap = "round";
        // ctx.moveTo(this.prevX, this.prevY);
        // ctx.lineTo(this.x, this.y);
        // ctx.strokeStyle = this.color;
        // ctx.lineWidth = this.lineWidth;
        // ctx.stroke();

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
        if (familySize > 50) {
            let vxChild = random(-1, 1) / (1 + this.speed);
            let vyChild = random(-1, 1) / (1 + this.speed);
            if (!this.dead) {
                let xy = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
                if ((Math.sqrt((xy.x - this.xy.x) ** 2 + (xy.y - this.xy.y) ** 2)) > 10) {
                    let child = new Line(xy.x, xy.y, vxChild, vyChild, this.speed - this.speed, this.color, this.lineWidth * 0.9, this.familyID, this.depth - 3);
                    lines.push(child);
                }
            }
        } else {
            // create a random number of children, scaled to depth
            let children = Math.round(random(0, this.depth));
            // children all spawn in the same direction
            let vxChild = random(-1, 1) * (1 + this.speed);
            let vyChild = random(-1, 1) * (1 + this.speed);
            if (!this.dead) {
                for (let i = 0; i < children; i++) {
                    // pick a random point along the parent line to spawn child from
                    let xy = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
                    // conditional to stop generating children if the distance between the the generation point and recent collision is too small
                    if ((Math.sqrt((xy.x - this.xy.x) ** 2 + (xy.y - this.xy.y) ** 2)) > 10) {
                        let child = new Line(xy.x, xy.y, vxChild, vyChild, this.speed + this.speed, this.color, this.lineWidth * 0.9, this.familyID, this.depth + 1);
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
        }
    }

    unDraw() {
        // // // draw on the main canvas
        // ctx.beginPath();
        // ctx.lineCap = "round";
        // ctx.moveTo(this.prevDeadX, this.prevDeadY);
        // ctx.lineTo(this.deadX, this.deadY);
        // ctx.strokeStyle = '#00000080';
        // ctx.lineWidth = this.lineWidth;
        // ctx.stroke();

        // draw on the offscreen canvas
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.moveTo(this.prevDeadX, this.prevDeadY);
        this.ctx.lineTo(this.deadX, this.deadY);
        this.ctx.strokeStyle = '#00000060';
        this.ctx.lineWidth = this.lineWidth * 1.5;
        this.ctx.stroke();
        ctx.drawImage(this.canvas, 0, 0);
    }
}

function checkCollision(ball, line) {
    const dx = ball.x - line.x;
    const dy = ball.y - line.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    return distance < ball.radius + line.width / 2;
  }