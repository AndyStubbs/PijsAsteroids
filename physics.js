// Define a global Body class for objects with physics
function Body(x, y, radius) {
    this.x = x || 0;            // Object's x position
    this.y = y || 0;            // Object's y position
    this.velX = 0;              // Velocity on the X-axis
    this.velY = 0;              // Velocity on the Y-axis
    this.angle = 0;             // Angle the object is facing (in radians)
    this.acceleration = 0;      // Acceleration applied during movement
    this.radius = radius || 0;  // Collision radius of the object
    this.aVel = 0;
}

// Function to apply movement based on velocity and handle screen wrapping
function applyMovement(obj, dt) {
    obj.x += obj.velX * dt;
    obj.y += obj.velY * dt;
    obj.angle += obj.aVel * dt;

    // Wrap the object around the screen edges
    if (obj.x > $.width()) obj.x = 0;
    if (obj.x < 0) obj.x = $.width();
    if (obj.y > $.height()) obj.y = 0;
    if (obj.y < 0) obj.y = $.height();
}

// Function to apply thrust in the direction the object is facing
function applyThrust(obj, acceleration) {
    obj.velX += Math.cos(obj.angle) * acceleration;
    obj.velY += Math.sin(obj.angle) * acceleration;
}

// Global function to check collision between two bodies
function checkCollision(body1, body2) {
    const dx = body1.x - body2.x;
    const dy = body1.y - body2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If the distance between the two objects is less than the sum of their radii, they collide
    return distance < (body1.radius + body2.radius);
}

// Expose the functions and the Body class globally for reuse
window.Body = Body;
window.applyMovement = applyMovement;
window.applyThrust = applyThrust;
window.checkCollision = checkCollision;
