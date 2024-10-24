// Define a global Player class that extends the Body
function Player() {
    // Initialize the player object
    this.init = function(x, y) {
        // Inherit the Body properties and set the radius for collision
        Body.call(this, x, y, 7.5); // Player's collision radius is half of the full size

        this.radius = 7.5;
        this.widthFactor = 0.8;
        this.turnSpeed = 8;
        this.acceleration = 2;
        this.isAccelerating = false;
        this.lives = 3;
        this.isAlive = true;
        this.isActive = true;
        this.activateTime = 10;
        this.respawn();
        this.shootTime = 0;
    };

    // Method to render the player on screen
    this.draw = function () {
        if( this.isActive ) {
            $.setColor("white");
        } else {
            $.setColor("grey");
        }

        // Calculate the points for a triangular ship
        const tipX = this.x + Math.cos(this.angle) * this.radius;
        const tipY = this.y + Math.sin(this.angle) * this.radius;

        const leftX = this.x + Math.cos(this.angle + Math.PI * 4 / 5) * this.radius * this.widthFactor;
        const leftY = this.y + Math.sin(this.angle + Math.PI * 4 / 5) * this.radius * this.widthFactor;

        const rightX = this.x + Math.cos(this.angle - Math.PI * 4 / 5) * this.radius * this.widthFactor;
        const rightY = this.y + Math.sin(this.angle - Math.PI * 4 / 5) * this.radius * this.widthFactor;

        // Draw the triangular ship
        $.line(Math.floor(tipX), Math.floor(tipY), Math.floor(leftX), Math.floor(leftY));
        $.line(Math.floor(tipX), Math.floor(tipY), Math.floor(rightX), Math.floor(rightY));
        $.line(Math.floor(leftX), Math.floor(leftY), Math.floor(rightX), Math.floor(rightY));

        // If accelerating, draw a red flame behind the ship
        if (this.isAccelerating) {
            $.setColor("red");

            const flameTipX = this.x - Math.cos(this.angle) * (this.radius * 1.5);
            const flameTipY = this.y - Math.sin(this.angle) * (this.radius * 1.5);

            const flameLeftX = this.x + Math.cos(this.angle + Math.PI * 5 / 6) * this.radius * this.widthFactor * 0.8;
            const flameLeftY = this.y + Math.sin(this.angle + Math.PI * 5 / 6) * this.radius * this.widthFactor * 0.8;

            const flameRightX = this.x + Math.cos(this.angle - Math.PI * 5 / 6) * this.radius * this.widthFactor * 0.8;
            const flameRightY = this.y + Math.sin(this.angle - Math.PI * 5 / 6) * this.radius * this.widthFactor * 0.8;

            $.line(flameTipX,flameTipY,flameLeftX,flameLeftY);
            $.line(flameTipX, flameTipY, flameRightX, flameRightY);
            $.line(flameLeftX, flameLeftY, flameRightX, flameRightY);
        }
    };

    this.update = function (dt) {
        applyMovement(this, dt);
        if( this.activateTime > 0) {
            this.activateTime -= dt;
            if( this.activateTime <= 0) {
                this.isActive = true;
            }
        }
    };

    this.handleInput = function (keys, dt) {
        if (keys["ArrowLeft"]) this.angle -= this.turnSpeed * dt;
        if (keys["ArrowRight"]) this.angle += this.turnSpeed * dt;
        if (keys["ArrowUp"]) {
            this.isAccelerating = true;
            applyThrust(this, this.acceleration);
            startEngine();
        } else {
            this.isAccelerating = false;
            stopEngine();
        }
        if (this.shootTime > 0) {
            this.shootTime -= dt;
        } else {
            if(keys["Space"]){
                playLaserBlast();
                let shot = new Shot();
                shot.init(this.x, this.y);
                shot.velX = Math.cos(this.angle) * 200;
                shot.velY = Math.sin(this.angle) * 200;
                this.shootTime = 0.25;
                shots.push(shot);
            }
        }
    };

    // Method to respawn the player at the center of the screen
    this.respawn = function() {
        this.x = $.width() / 2;
        this.y = $.height() / 2;
        this.velX = 0;
        this.velY = 0;
        this.angle = 0; // Reset angle
        this.isActive = false;
        this.activateTime = 1;
    };
}

// Expose Player globally
window.Player = Player;
