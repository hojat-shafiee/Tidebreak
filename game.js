// ============================================================
// WAVE COLLECTOR - Game Off 2025
// A 2D top-down arcade game with wave-based mechanics
// ============================================================

class GameConfig {
    static CANVAS_WIDTH = 800;
    static CANVAS_HEIGHT = 600;
    static PLAYER_SIZE = 30;
    static ITEM_SIZE = 25;
    static BASE_SPAWN_RATE = 1; // items per second initially (reduced from 2)
    static BASE_ITEM_SPEED = 2; // pixels per frame (reduced from 3)
    static WAVE_INCREASE_INTERVAL = 15000; // ms
    static MISSED_ITEMS_LIMIT = 5;
}

class ItemType {
    constructor(id, name, color, shape, points, isNegative = false) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.shape = shape; // 'circle', 'square', 'triangle', 'star', 'diamond'
        this.points = points;
        this.isNegative = isNegative;
    }
}

// Item categories
const ITEM_TYPES = {
    STAR: new ItemType(0, 'Star', '#FFD700', 'star', 100, false),
    DIAMOND: new ItemType(1, 'Diamond', '#00FF88', 'diamond', 75, false),
    HEART: new ItemType(2, 'Heart', '#FF1493', 'heart', 50, false),
    SPIKE: new ItemType(3, 'Spike', '#FF4444', 'triangle', -30, true),
    POISON: new ItemType(4, 'Poison', '#9933FF', 'square', -50, true),
};

class Item {
    constructor(x, y, type, speed) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.speed = speed;
        this.collected = false;
    }

    update() {
        this.y += this.speed;
    }

    isOffScreen() {
        return this.y > GameConfig.CANVAS_HEIGHT;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw glow effect
        ctx.shadowColor = this.type.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        switch (this.type.shape) {
            case 'circle':
                ctx.fillStyle = this.type.color;
                ctx.beginPath();
                ctx.arc(0, 0, GameConfig.ITEM_SIZE / 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'square':
                ctx.fillStyle = this.type.color;
                ctx.fillRect(-GameConfig.ITEM_SIZE / 2, -GameConfig.ITEM_SIZE / 2, GameConfig.ITEM_SIZE, GameConfig.ITEM_SIZE);
                break;

            case 'triangle':
                ctx.fillStyle = this.type.color;
                ctx.beginPath();
                ctx.moveTo(0, -GameConfig.ITEM_SIZE / 2);
                ctx.lineTo(GameConfig.ITEM_SIZE / 2, GameConfig.ITEM_SIZE / 2);
                ctx.lineTo(-GameConfig.ITEM_SIZE / 2, GameConfig.ITEM_SIZE / 2);
                ctx.fill();
                break;

            case 'star':
                this.drawStar(ctx, 0, 0, 5, GameConfig.ITEM_SIZE / 2, GameConfig.ITEM_SIZE / 4, this.type.color);
                break;

            case 'diamond':
                ctx.fillStyle = this.type.color;
                ctx.beginPath();
                ctx.moveTo(0, -GameConfig.ITEM_SIZE / 2);
                ctx.lineTo(GameConfig.ITEM_SIZE / 2, 0);
                ctx.lineTo(0, GameConfig.ITEM_SIZE / 2);
                ctx.lineTo(-GameConfig.ITEM_SIZE / 2, 0);
                ctx.fill();
                break;

            case 'heart':
                this.drawHeart(ctx, 0, 0, GameConfig.ITEM_SIZE / 2, this.type.color);
                break;
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    drawHeart(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y + size / 2);
        ctx.bezierCurveTo(x - size, y - size / 3, x - size / 2, y - size, x - size / 4, y - size);
        ctx.bezierCurveTo(x, y - size / 2, x + size / 4, y - size, x + size / 2, y - size);
        ctx.bezierCurveTo(x + size, y - size / 3, x, y + size / 2, x, y + size / 2);
        ctx.fill();
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GameConfig.PLAYER_SIZE;
        this.height = GameConfig.PLAYER_SIZE;
        this.velocityX = 0;
        this.targetX = x;
        this.speed = 8;
    }

    update(keys) {
        // Smooth movement to target position
        if (keys['ArrowLeft'] || keys['a']) {
            this.targetX = Math.max(this.width / 2, this.targetX - this.speed);
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.targetX = Math.min(GameConfig.CANVAS_WIDTH - this.width / 2, this.targetX + this.speed);
        }

        // Smoothly move towards target
        this.x += (this.targetX - this.x) * 0.15;

        // Clamp position
        this.x = Math.max(this.width / 2, Math.min(GameConfig.CANVAS_WIDTH - this.width / 2, this.x));
    }

    draw(ctx) {
        ctx.save();

        // Draw glow
        ctx.shadowColor = '#64c8ff';
        ctx.shadowBlur = 20;

        // Draw player circle
        ctx.fillStyle = '#64c8ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw inner ring
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2,
        };
    }

    checkCollision(item) {
        const dist = Math.hypot(item.x - this.x, item.y - this.y);
        return dist < (this.width / 2 + GameConfig.ITEM_SIZE / 2);
    }
}

class WaveManager {
    constructor() {
        this.currentWave = 1;
        this.waveTimer = 0;
        this.spawnTimer = 0;
        this.itemSpeedMultiplier = 1;
        this.spawnRateMultiplier = 1;
    }

    update(deltaTime) {
        this.waveTimer += deltaTime;

        // Increase difficulty every WAVE_INCREASE_INTERVAL ms
        if (this.waveTimer >= GameConfig.WAVE_INCREASE_INTERVAL) {
            this.currentWave++;
            this.waveTimer = 0;
            this.itemSpeedMultiplier += 0.15;
            this.spawnRateMultiplier += 0.2;
        }
    }

    getCurrentSpawnRate() {
        return GameConfig.BASE_SPAWN_RATE * this.spawnRateMultiplier;
    }

    getCurrentItemSpeed() {
        return GameConfig.BASE_ITEM_SPEED * this.itemSpeedMultiplier;
    }

    getWaveNumber() {
        return this.currentWave;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GameConfig.CANVAS_WIDTH;
        this.canvas.height = GameConfig.CANVAS_HEIGHT;

        this.player = new Player(GameConfig.CANVAS_WIDTH / 2, GameConfig.CANVAS_HEIGHT - 60);
        this.items = [];
        this.waveManager = new WaveManager();

        this.score = 0;
        this.combo = 1;
        this.maxCombo = 1;
        this.missedItems = 0;
        this.collectedItems = 0;
        this.gameOver = false;
        this.lastFrameTime = Date.now();
        this.spawnBuffer = 0;

        this.keys = {};

        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Touch controls for mobile
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            if (touchStartX === 0) return;
            const touchX = e.touches[0].clientX;
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = (touchX - rect.left) / rect.width * GameConfig.CANVAS_WIDTH;
            this.player.targetX = canvasX;
        });

        document.addEventListener('touchend', () => {
            touchStartX = 0;
        });

        // Mouse controls
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = (e.clientX - rect.left) / rect.width * GameConfig.CANVAS_WIDTH;
            this.player.targetX = canvasX;
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            location.reload();
        });
    }

    spawnItems() {
        const spawnRate = this.waveManager.getCurrentSpawnRate();
        this.spawnBuffer += spawnRate / 60; // Convert to per-frame

        while (this.spawnBuffer >= 1) {
            const randomType = Object.values(ITEM_TYPES)[Math.floor(Math.random() * Object.keys(ITEM_TYPES).length)];
            const x = Math.random() * (GameConfig.CANVAS_WIDTH - GameConfig.ITEM_SIZE) + GameConfig.ITEM_SIZE / 2;
            const y = -GameConfig.ITEM_SIZE;
            const speed = this.waveManager.getCurrentItemSpeed();
            this.items.push(new Item(x, y, randomType, speed));
            this.spawnBuffer--;
        }
    }

    update(deltaTime) {
        if (this.gameOver) return;

        this.player.update(this.keys);
        this.waveManager.update(deltaTime);
        
        // Check if wave increased
        const prevWave = this.waveManager.currentWave;
        this.waveManager.update(deltaTime);
        if (this.waveManager.currentWave > prevWave) {
            audioManager.playWaveUpSound();
        }
        
        this.spawnItems();

        // Update items
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update();

            // Check collision with player
            if (this.player.checkCollision(item)) {
                this.collectItem(item);
                this.items.splice(i, 1);
                continue;
            }

            // Check if missed
            if (item.isOffScreen()) {
                if (!item.collected) {
                    // Only decrease health if it's NOT poison
                    if (item.type !== ITEM_TYPES.POISON) {
                        this.missedItems++;
                        this.combo = 1;
                        audioManager.playMissSound();
                        if (this.missedItems >= GameConfig.MISSED_ITEMS_LIMIT) {
                            this.endGame();
                        }
                    }
                }
                this.items.splice(i, 1);
            }
        }
    }

    collectItem(item) {
        item.collected = true;
        this.collectedItems++;

        if (item.type.isNegative) {
            this.score += item.type.points;
            this.combo = 1;
            this.createPopupText(item.x, item.y, item.type.points, true);
            audioManager.playNegativeSound(item.type);

            // Poison decreases health only when collected, not when missed
            if (item.type === ITEM_TYPES.POISON) {
                this.missedItems++;
                this.createPopupText(item.x, item.y - 20, 'HEALTH -1', true);
                if (this.missedItems >= GameConfig.MISSED_ITEMS_LIMIT) {
                    this.endGame();
                }
            }
        } else {
            const earnedPoints = item.type.points * this.combo;
            this.score += earnedPoints;
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            this.createPopupText(item.x, item.y, `+${earnedPoints}`, false);
            audioManager.playCollectSound(item.type);

            // Hearts restore one missed item (health)
            if (item.type === ITEM_TYPES.HEART && this.missedItems > 0) {
                this.missedItems--;
                this.createPopupText(item.x, item.y - 20, 'HEALTH +1', false);
            }
        }

        this.score = Math.max(0, this.score);
        this.updateUI();
    }

    createPopupText(x, y, text, isNegative) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = (x * window.innerWidth / GameConfig.CANVAS_WIDTH) + 'px';
        popup.style.top = (y * window.innerHeight / GameConfig.CANVAS_HEIGHT) + 'px';
        popup.style.color = isNegative ? '#ff4444' : '#00ff88';
        popup.style.fontSize = '20px';
        popup.style.fontWeight = 'bold';
        popup.style.pointerEvents = 'none';
        popup.style.textShadow = '0 0 10px ' + (isNegative ? 'rgba(255, 68, 68, 0.5)' : 'rgba(0, 255, 136, 0.5)');
        popup.textContent = text;

        document.body.appendChild(popup);

        let opacity = 1;
        const interval = setInterval(() => {
            opacity -= 0.05;
            y -= 2;
            popup.style.opacity = opacity;
            popup.style.transform = `translateY(-${GameConfig.CANVAS_HEIGHT - y}px)`;

            if (opacity <= 0) {
                clearInterval(interval);
                popup.remove();
            }
        }, 30);
    }

    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('multiplierValue').textContent = this.combo + 'x';
        document.getElementById('waveValue').textContent = this.waveManager.getWaveNumber();
    }

    endGame() {
        this.gameOver = true;
        audioManager.playGameOverSound();
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalWave').textContent = this.waveManager.getWaveNumber();
        document.getElementById('finalItems').textContent = this.collectedItems;
        document.getElementById('finalCombo').textContent = this.maxCombo + 'x';
        document.getElementById('gameOverModal').classList.add('show');
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(15, 27, 60, 0.3)';
        this.ctx.fillRect(0, 0, GameConfig.CANVAS_WIDTH, GameConfig.CANVAS_HEIGHT);

        // Draw wave effect
        this.drawWaveBackground();

        // Draw items
        this.items.forEach(item => item.draw(this.ctx));

        // Draw player
        this.player.draw(this.ctx);

        // Draw missed items indicator
        this.drawMissedIndicator();

        // Draw debug info if needed
        // this.drawDebugInfo();
    }

    drawWaveBackground() {
        const waveTime = Date.now() / 1000;
        const waveHeight = 3;
        const waveFrequency = 0.01;

        for (let y = 0; y < GameConfig.CANVAS_HEIGHT; y += 30) {
            const offset = Math.sin(waveTime + y * waveFrequency) * waveHeight;
            this.ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 - y / GameConfig.CANVAS_HEIGHT * 0.08})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + offset);
            this.ctx.lineTo(GameConfig.CANVAS_WIDTH, y + offset);
            this.ctx.stroke();
        }
    }

    drawMissedIndicator() {
        const barWidth = 200;
        const barHeight = 10;
        const barX = GameConfig.CANVAS_WIDTH - barWidth - 20;
        const barY = 20;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health bar
        const filledWidth = barWidth * (1 - this.missedItems / GameConfig.MISSED_ITEMS_LIMIT);
        const healthColor = this.missedItems / GameConfig.MISSED_ITEMS_LIMIT > 0.7 ? '#ff4444' : '#00ff88';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(barX, barY, filledWidth, barHeight);

        // Border
        this.ctx.strokeStyle = healthColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Label
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`MISSED: ${this.missedItems}/${GameConfig.MISSED_ITEMS_LIMIT}`, barX + barWidth / 2, barY - 5);
    }

    gameLoop() {
        const currentTime = Date.now();
        const deltaTime = Math.min(currentTime - this.lastFrameTime, 50); // Cap at 50ms
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
