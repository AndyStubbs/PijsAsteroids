let player;
let asteroids = [];
let shots = [];
let keys = {};
let score = 0;
let level = 0;
let lastTime = 0;
let hiScore = 0;
let popupTime = 0;
let popupMessage = "";
let isSound = false;

if(localStorage.getItem("jsAsteroidsHighScore")) {
    let data = localStorage.getItem("jsAsteroidsHighScore");
    let num = Number(JSON.parse(data));
    if(!isNaN(num)) {
        hiScore = num;
    }
}
$.setVolume(0.25);

// Set up key events
$.onkey("ArrowUp", "down", () => keys["ArrowUp"] = true);
$.onkey("ArrowUp", "up", () => keys["ArrowUp"] = false);
$.onkey("ArrowLeft", "down", () => keys["ArrowLeft"] = true);
$.onkey("ArrowLeft", "up", () => keys["ArrowLeft"] = false);
$.onkey("ArrowRight", "down", () => keys["ArrowRight"] = true);
$.onkey("ArrowRight", "up", () => keys["ArrowRight"] = false);
$.onkey(" ", "down", () => keys["Space"] = true);
$.onkey(" ", "up", () => keys["Space"] = false);

$.ready(initGame);

function initGame() {
    $.screen("400x300");
    $.setFont(3);
    $.setPosPx(0, $.height() / 2);
    $.setColor("#00FF00");
    $.print("Do you want sound (y/n)?", true, true);
    $.onkey("y", "down", () => {
        isSound = true;
        startGame();
        nextLevel();
        gameLoop(0);
    }, true );
    $.onkey("n", "down", () => {
        isSound = false;
        startGame();
        nextLevel();
        gameLoop(0);
    }, true );
}



function nextLevel() {
    if( isSound ) {
        $.play("C16d16");
    } 
    level += 1;
    popupMessage = `Level ${level}`;
    popupTime = 3;
    asteroids = [];
    for (let i = 0; i < 1 + level * 2; i++) {
        let asteroid = new Asteroid();
        asteroid.init(Math.random() * $.width(), Math.random() * $.height(), 20);
        asteroids.push(asteroid);
    }
}

function startGame() {
    score = 0;
    level = 0;
    isGameOver = false;
    player = new Player();
    player.init($.width() / 2, $.height() / 2);
}

function gameLoop(t) {
    let dt = (t - lastTime) / 1000;
    lastTime = t;
    $.cls();

    if(popupTime > 0) {
        $.setColor("#00FF00");
        $.setPosPx(0, Math.floor($.height() / 2));
        $.print(popupMessage, true, true);
        popupTime -= dt;
    }
    if(player.isAlive){
        player.handleInput(keys, dt);
        player.update(dt);
        player.draw();
    } else {
        $.setColor("#00FF00");
        $.setPosPx(0, Math.floor($.height() / 2) - 8);
        $.print("Game Over", true, true);
        $.setPosPx(0, Math.floor($.height() / 2) + 8);
        $.print("Press F5 to Restart", true, true);
    }

    let isGameOver = false;
    for (let i = asteroids.length - 1; i >= 0; i -= 1) {
        let asteroid = asteroids[i];
        asteroid.update(dt);
        asteroid.draw();

        // Check for collisions between the player and asteroids
        if (player.isActive && checkCollision(player, asteroid)) {
            player.lives -= 1;
            playLongExplosion();
            if(player.lives === 0) {
                player.isAlive = false;
                player.isActive = false;
            } else {
                player.respawn();
            }
        }

        for(let j = shots.length - 1; j >= 0; j -= 1) {
            let shot = shots[j];
            if( shot.lifetime > 0 && checkCollision(shot, asteroid)){
                asteroid.split();
                asteroids.splice(i, 1);
                shot.lifetime = 0;
                score += level;
                if(score > hiScore) {
                    hiScore = score;
                    localStorage.setItem("jsAsteroidsHighScore", JSON.stringify(hiScore));
                }
                playExplosion();
                break;
            }
        }
    }

    for(let i = shots.length - 1; i >= 0; i -= 1){
        let shot = shots[ i ];
        shot.update(dt);
        shot.draw();
        if(shot.lifetime <= 0) {
            shots.splice(i, 1);
        }
    }

    printScore();

    if(asteroids.length === 0) {
        nextLevel();
    }
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function printScore() {
    // Set Color
    $.setColor("#00FF00");

    // Print Lives
    let livesText = `${player.lives}`;
    $.setPosPx(8, 2);
    $.print("Lives", true);
    $.setPosPx(8, 16);
    $.print(livesText, true);

    // Print Score
    let scoreText = `${score}`;
    let cx = $.width() / 2;
    $.setPosPx(cx - ("Score".length / 2 * 8), 2);
    $.print("Score", 16);
    $.setPosPx(cx - (scoreText.length / 2) * 8, 16);
    $.print(scoreText, true);

    // Print Hi Score
    let hiText = `${hiScore}`;
    $.setPosPx($.width() - ("High".length * 8) - 8, 2);
    $.print("High", true);
    $.setPosPx($.width() - (hiText.length * 8) - 8, 16);
    $.print(hiText, true);
}