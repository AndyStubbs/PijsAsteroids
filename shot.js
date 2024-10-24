function Shot() {
    this.init = function(x, y) {
        Body.call(this, x, y, 2);
        this.lifetime = 1;
    };

    this.draw = function () {
        let b = 255;
        if( this.lifetime < 0.25 ) {
            b = Math.floor(this.lifetime / 0.25 * 255);
        }
        $.setColor( [ b / 2, b / 2, b ] );
        $.circle( this.x, this.y, this.radius );
    };

    this.update = function (dt) {
        applyMovement(this, dt);
        this.lifetime -= dt;
    };
}

window.Shot = Shot;
