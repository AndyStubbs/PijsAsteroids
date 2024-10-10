function playLaserBlast() {
    if( !isSound ) {
        return;
    }
    var freq = 440;   // Start frequency
    var interval = setInterval(function() {
        // Play a short sound burst
        $.sound({
            oType: "square",  // Square wave for retro feel
            frequency: freq,      // Current frequency
            volume: 0.05,     // Volume
            duration: 0.05,  // Short burst
            decay: 0.02,     // Quick decay for sharp sound
            attack: 0.01,    // Instant attack
            release: 0.02    // Quick release
        });
        
        // Decrease frequency to simulate the pitch slide effect
        freq -= 75;

        // Stop the loop when the frequency is too low
        if (freq <= 150) {
            clearInterval(interval);
        }
    }, 50);  // Delay between each sound burst
}

let engineRunning = false;
let engineSoundInterval;
let baseFrequency = 75;  // Base frequency for engine sound
function startEngine() {
    if( !isSound ) {
        return;
    }
    if (!engineRunning) {
        engineRunning = true;
        var frequency = baseFrequency;
        
        // Create a loop to continuously play the engine sound
        engineSoundInterval = setInterval(function() {
            $.sound({
                oType: "sawtooth",    // Sawtooth wave for a rough engine sound
                frequency: frequency + Math.random() * 50,  // Set frequency
                volume: 0.12,         // Set volume
                duration: 0.1 + Math.random() * 0.05,       // Short burst
                decay: 0.05,         // Moderate decay to keep it continuous
                attack: 0.02,        // Quick start
                release: 0.05        // Quick release to make it loop smoothly
            });

            // Gradually modulate the frequency to simulate acceleration
            frequency = baseFrequency + Math.random() * 10;
        }, 100);  // Loop delay
    }
}

// Function to stop the engine sound
function stopEngine() {
    if (engineRunning) {
        engineRunning = false;
        clearInterval(engineSoundInterval);  // Stop the engine sound loop
    }
}


function playExplosion() {
    if( !isSound ) {
        return;
    }
    // Play a noise burst for the explosion
    for( let i = 0; i < 5; i += 1) {
        $.sound({
            oType: "sawtooth", // Noise wave for an explosion-like effect
            frequency: 60 + i * 5,    // Low frequency for a deep explosion sound
            volume: 0.18,      // Loud volume
            duration: 0.1,    // Short burst for an impactful sound
            decay: 0.2,       // Fast decay to cut off the sound quickly
            attack: 0.01,     // Instant attack for immediate start
            release: 0.1,      // Quick release to make the sound sharp
            delay: i * 0.015
        });
    }
}

function playLongExplosion() {
    if( !isSound ) {
        return;
    }
    // Play a noise burst for the explosion
    $.sound({
        oType: "sawtooth",    // Noise wave for chaotic explosion effect
        frequency: 80,    // Low frequency for a deep explosion sound
        volume: 0.29,      // High volume for intensity
        duration: 0.5,    // Longer duration for drawn-out explosion
        decay: 0.8,       // Slower decay to stretch the explosion sound
        attack: 0.05,     // Slight attack delay for a bit of buildup
        release: 0.5      // Longer release for a trailing-off effect
    });
}