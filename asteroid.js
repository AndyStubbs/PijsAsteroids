// Define a global Asteroid class
function Asteroid() {
    this.size = 15; // Reduce the asteroid size
    this.points = [];
    this.rotationSpeed = 0;

    this.init = function(x, y, size) {
        Body.call(this, x, y, size || 15); // Asteroid's collision radius
        this.size = size || 15; // Size for rendering
        this.points = this.generatePoints(10, this.size);
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        let a = Math.random() * Math.PI * 2;
        this.velX = Math.cos(a) * 40;
        this.velY = Math.sin(a) * 40;
        this.aVel = (Math.random() - 0.5) * 1.5;
    };

    this.generatePoints = function (numPoints, radius) {
        let points = [];
        for (let i = 0; i < numPoints; i++) {
            let angle = (Math.PI * 2 / numPoints) * i;
            let distance = radius + (Math.random() - 0.5) * radius * 0.4;
            points.push({ angle: angle, distance: distance });
        }
        return points;
    };

    this.draw = function () {
        $.setColor("#dedede");

        for (let i = 1; i < this.points.length; i++) {
            let a1 = this.angle + this.points[i - 1].angle;
            let a2 = this.angle + this.points[i].angle;
            let d1 = this.points[i - 1].distance;
            let d2 = this.points[i].distance;
            let x1 = this.x + Math.cos(a1) * d1;
            let y1 = this.y + Math.sin(a1) * d1;
            let x2 = this.x + Math.cos(a2) * d2;
            let y2 = this.y + Math.sin(a2) * d2;
            $.line(x1,y1,x2,y2);
            if( i === this.points.length - 1) {
                a1 = this.angle + this.points[0].angle;
                d1 = this.points[0].distance;
                x1 = this.x + Math.cos(a1) * d1;
                y1 = this.y + Math.sin(a1) * d1;
                $.line(x1,y1,x2,y2);
            }
        }
    };

    this.update = function(dt) {
        applyMovement(this, dt);
        this.angle += this.rotationSpeed;
    };

    this.split = function() {
        if( this.size <= 5 ) {
            return;
        }
        let v = Math.sqrt(this.velX * this.velX + this.velY * this.velY);
        let a = Math.random() * Math.PI;

        // Create Rock1
        let rock1 = new Asteroid();
        rock1.init( this.x, this.y, this.size - 5 );
        rock1.velX = Math.cos(a) * v * 1.2;
        rock1.velY = Math.sin(a) * v * 1.2;
        rock1.update(0.15);
        asteroids.push(rock1);
        let rock2 = new Asteroid();
        rock2.init( this.x, this.y, this.size - 5 );
        rock2.velX = Math.cos(-a) * v * 1.2;
        rock2.velY = Math.sin(-a) * v * 1.2;
        rock2.update(0.15);
        asteroids.push( rock2 );
    };
}

// Expose Asteroid globally
window.Asteroid = Asteroid;
