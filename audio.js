// ============================================================
// AUDIO MANAGER - Web Audio API Sound Generation
// ============================================================

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.masterVolume = 0.3;
    }

    init() {
        if (this.initialized) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playSound(frequency, duration, type = 'sine', volume = 0.5) {
        if (!this.initialized) return;

        try {
            const ctx = this.audioContext;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = type;
            osc.frequency.value = frequency;
            
            gain.gain.setValueAtTime(volume * this.masterVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    }

    playSoundSequence(frequencies, duration, delay = 0.1, volume = 0.5) {
        if (!this.initialized) return;

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playSound(freq, duration, 'sine', volume);
            }, delay * index * 1000);
        });
    }

    // Positive collection sound - ascending tones
    playCollectSound(itemType) {
        this.init();

        if (itemType === ITEM_TYPES.STAR) {
            // High, happy chime
            this.playSoundSequence([800, 1000, 1200], 0.15, 0.05, 0.6);
        } else if (itemType === ITEM_TYPES.DIAMOND) {
            // Sparkle sound
            this.playSoundSequence([600, 800, 600], 0.1, 0.03, 0.5);
        } else if (itemType === ITEM_TYPES.HEART) {
            // Gentle bell
            this.playSoundSequence([500, 750, 500], 0.12, 0.04, 0.4);
        }
    }

    // Negative hit sound - descending tones
    playNegativeSound(itemType) {
        this.init();

        if (itemType === ITEM_TYPES.SPIKE) {
            // Warning buzz
            this.playSound(200, 0.3, 'square', 0.5);
        } else if (itemType === ITEM_TYPES.POISON) {
            // Danger sound
            this.playSoundSequence([400, 300, 200], 0.2, 0.05, 0.6);
        }
    }

    // Missed item sound
    playMissSound() {
        this.init();
        this.playSound(150, 0.4, 'sine', 0.4);
    }

    // Wave progression sound
    playWaveUpSound() {
        this.init();
        this.playSoundSequence([400, 600, 800, 1000], 0.1, 0.08, 0.5);
    }

    // Game over sound
    playGameOverSound() {
        this.init();
        this.playSoundSequence([800, 600, 400, 200], 0.15, 0.1, 0.6);
    }

    // Background music-like ambient sound
    playAmbient() {
        if (!this.initialized) return;
        
        try {
            const ctx = this.audioContext;
            
            // Create a simple bass drone
            const bass = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bass.connect(bassGain);
            bassGain.connect(ctx.destination);
            
            bass.type = 'sine';
            bass.frequency.value = 110; // Low A
            bassGain.gain.setValueAtTime(0.1 * this.masterVolume, ctx.currentTime);
            
            bass.start();
            
            // Store reference to stop later if needed
            return { osc: bass, gain: bassGain };
        } catch (e) {
            console.log('Error playing ambient sound:', e);
        }
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Initialize audio on user interaction
document.addEventListener('click', () => {
    audioManager.init();
}, { once: true });

document.addEventListener('keydown', () => {
    audioManager.init();
}, { once: true });

document.addEventListener('touchstart', () => {
    audioManager.init();
}, { once: true });
