// Line class
class Line {
    constructor(x, y, vx, vy, colour, lineWidth, familyID) {
        this.x = x;
        this.y = y;
        this.vx = vx ?? random(-1, 1); // Random velocity for x-axis (-1 to 1)
        this.vy = vy ?? random(-1, 1); // Random velocity for y-axis (-1 to 1)
        this.color = colour ?? getRandomColour();
        this.lineWidth = lineWidth ?? random(0, 3); // Random line width (1 to 4)
        this.prevX = x; // Previous x position
        this.prevY = y; // Previous y position
        this.canvas = new OffscreenCanvas(cnvBbox.width, cnvBbox.height);
        this.ctx = this.canvas.getContext('2d');
        this.xyArr = []; // initialise an empty xyArr to store the line coordinates every time it calls the update method
        this.familyID = familyID ?? random(); // set a 'family ID' so lines from the same lineage can't collide with each other
        this.dead = false;
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
        const distanceMouse = Math.sqrt(dxMouse**2 + dyMouse**2);
        if (distanceMouse < 80) {
            const angleMouse = Math.atan2(dyMouse, dxMouse);
            const targetXMouse = this.x + Math.cos(angleMouse) * this.length;
            const targetYMouse = this.y + Math.sin(angleMouse) * this.length;
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
                    this.die();
                }
            }
        });

        

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
        // create a random number of children (up to 6)
        let children = Math.round(random(0, 5));
        // children all spawn in the same direction
        let vxChild = random(-1, 1);
        let vyChild = random(-1, 1);
        if (!this.dead) {
            for (let i = 0; i < children; i++) {
                // pick a random point along the parent line to spawn child from
                let xy = this.xyArr[Math.floor(Math.random() * this.xyArr.length)];
                // conditional to stop generating children if the distance between the the generation point and recent collision is too small
                if ((Math.sqrt((xy.x - this.xy.x) ** 2 + (xy.y - this.xy.y) ** 2)) > 10) {
                    let child = new Line(xy.x, xy.y, vxChild, vyChild, this.color, this.lineWidth * 0.5, this.familyID);
                    lines.push(child);
                }
            }
        }
    }

    die() {
        ctx.clearRect(0, 0, window.innerWidth, window.height);
        this.dead = true;
        this.xyArr = [];
    }
}