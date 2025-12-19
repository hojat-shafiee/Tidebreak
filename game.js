// ==================== CONFIGURATION ====================
const CONFIG = {
  PLAYER_SPEED: 7,
  INITIAL_FALL_SPEED: 2,
  MAX_FALL_SPEED: 8,
  WAVE_DURATION: 15000,
  SPAWN_RATE: 800,
  SPAWN_RATE_DECREASE: 50,
  COMBO_TIMEOUT: 2000,
  POWERUP_DURATION: 5000,
  ITEM_TRAIL_LENGTH: 5,
};

const ITEM_TYPES = {
  STAR: "star",
  DIAMOND: "diamond",
  HEART: "heart",
  SPIKE: "spike",
  POISON: "poison",
  MAGNET: "magnet",
  SLOWMO: "slowmo",
  SHIELD: "shield",
};

const ITEM_CONFIG = {
  [ITEM_TYPES.STAR]: { color: "#FFD700", points: 100, size: 30, emoji: "★" },
  [ITEM_TYPES.DIAMOND]: { color: "#00FFFF", points: 75, size: 28, emoji: "◆" },
  [ITEM_TYPES.HEART]: {
    color: "#FF69B4",
    points: 50,
    size: 26,
    emoji: "♥",
    heal: 1,
  },
  [ITEM_TYPES.SPIKE]: {
    color: "#FF4444",
    points: -30,
    size: 25,
    emoji: "▲",
    damage: 1,
  },
  [ITEM_TYPES.POISON]: { color: "#9400D3", points: -50, size: 24, emoji: "■" },
  [ITEM_TYPES.MAGNET]: {
    color: "#FFA500",
    points: 0,
    size: 30,
    emoji: "🧲",
    powerup: "magnet",
  },
  [ITEM_TYPES.SLOWMO]: {
    color: "#00CED1",
    points: 0,
    size: 30,
    emoji: "⏸",
    powerup: "slowmo",
  },
  [ITEM_TYPES.SHIELD]: {
    color: "#C0C0C0",
    points: 0,
    size: 30,
    emoji: "🛡️",
    powerup: "shield",
  },
};

// ==================== GAME STATE ====================
const game = {
  canvas: null,
  ctx: null,
  player: { x: 0, y: 0, width: 50, height: 50, targetX: 0 },
  items: [],
  particles: [],
  trails: [],
  score: 0,
  highScore: localStorage.getItem("tidebreak-highscore") || 0,
  wave: 1,
  health: 5,
  maxHealth: 5,
  combo: 0,
  comboTimer: 0,
  lastSpawn: 0,
  waveTimer: 0,
  gameOver: false,
  paused: false,
  powerups: {
    magnet: { active: false, timer: 0 },
    slowmo: { active: false, timer: 0 },
    shield: { active: false, timer: 0 },
  },
  fallSpeed: CONFIG.INITIAL_FALL_SPEED,
  spawnRate: CONFIG.SPAWN_RATE,
  itemsCollected: 0,
  maxCombo: 0,
  keys: {},
  mouseX: null,
  touchX: null,
};

// ==================== INITIALIZATION ====================
function init() {
  game.canvas = document.getElementById("gameCanvas");
  game.ctx = game.canvas.getContext("2d");
  resizeCanvas();

  // Input handlers
  setupControls();

  // Hide menu and start
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";

  // Update high score in menu
  document.getElementById("menuHighScore").textContent = game.highScore;

  resetGame();
  gameLoop();
}

function resizeCanvas() {
  // Fixed canvas size for itch.io - 800x600 is optimal for desktop and mobile
  game.canvas.width = 800;
  game.canvas.height = 600;
  game.player.y = game.canvas.height - 100;
}

function setupControls() {
  // Keyboard
  window.addEventListener("keydown", (e) => {
    game.keys[e.key.toLowerCase()] = true;
    if (e.key === "p" || e.key === "P") togglePause();
  });
  window.addEventListener("keyup", (e) => {
    game.keys[e.key.toLowerCase()] = false;
  });

  // Mouse
  game.canvas.addEventListener("mousemove", (e) => {
    const rect = game.canvas.getBoundingClientRect();
    game.mouseX = e.clientX - rect.left;
  });

  // Touch
  game.canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = game.canvas.getBoundingClientRect();
    game.touchX = e.touches[0].clientX - rect.left;
  });

  // Pause button
  document.getElementById("pauseBtn").addEventListener("click", togglePause);
  document.getElementById("resumeBtn").addEventListener("click", togglePause);
}

function togglePause() {
  if (game.gameOver) return;
  game.paused = !game.paused;
  document.getElementById("pauseModal").style.display = game.paused
    ? "block"
    : "none";
}

// ==================== GAME LOGIC ====================
function resetGame() {
  game.items = [];
  game.particles = [];
  game.trails = [];
  game.score = 0;
  game.wave = 1;
  game.health = game.maxHealth;
  game.combo = 0;
  game.comboTimer = 0;
  game.waveTimer = 0;
  game.gameOver = false;
  game.paused = false;
  game.itemsCollected = 0;
  game.maxCombo = 0;
  game.fallSpeed = CONFIG.INITIAL_FALL_SPEED;
  game.spawnRate = CONFIG.SPAWN_RATE;

  // Reset power-ups
  Object.keys(game.powerups).forEach((key) => {
    game.powerups[key].active = false;
    game.powerups[key].timer = 0;
  });

  updateHUD();
  document.getElementById("gameOverModal").style.display = "none";
}

function spawnItem() {
  const now = Date.now();
  if (now - game.lastSpawn < game.spawnRate) return;

  game.lastSpawn = now;

  // Weighted random spawn
  const weights = [
    { type: ITEM_TYPES.STAR, weight: 10 },
    { type: ITEM_TYPES.DIAMOND, weight: 20 },
    { type: ITEM_TYPES.HEART, weight: 15 },
    { type: ITEM_TYPES.SPIKE, weight: 25 },
    { type: ITEM_TYPES.POISON, weight: 15 },
    { type: ITEM_TYPES.MAGNET, weight: 5 },
    { type: ITEM_TYPES.SLOWMO, weight: 5 },
    { type: ITEM_TYPES.SHIELD, weight: 5 },
  ];

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;

  let selectedType = ITEM_TYPES.STAR;
  for (const item of weights) {
    random -= item.weight;
    if (random <= 0) {
      selectedType = item.type;
      break;
    }
  }

  const config = ITEM_CONFIG[selectedType];
  game.items.push({
    x: Math.random() * (game.canvas.width - config.size),
    y: -config.size,
    type: selectedType,
    config: config,
    trail: [],
  });
}

function updatePlayer() {
  // Get target position
  let targetX = game.player.x;

  if (game.keys["arrowleft"] || game.keys["a"]) {
    targetX -= CONFIG.PLAYER_SPEED * 5;
  }
  if (game.keys["arrowright"] || game.keys["d"]) {
    targetX += CONFIG.PLAYER_SPEED * 5;
  }
  if (game.mouseX !== null) {
    targetX = game.mouseX - game.player.width / 2;
  }
  if (game.touchX !== null) {
    targetX = game.touchX - game.player.width / 2;
  }

  // Apply magnet power-up
  if (game.powerups.magnet.active) {
    // Attract nearby items
    game.items.forEach((item) => {
      const dx =
        game.player.x + game.player.width / 2 - (item.x + item.config.size / 2);
      const dy =
        game.player.y +
        game.player.height / 2 -
        (item.y + item.config.size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = ((150 - distance) / 150) * 0.3;
        item.x += dx * force;
      }
    });
  }

  // Smooth movement
  game.player.x += (targetX - game.player.x) * 0.2;

  // Clamp to canvas
  game.player.x = Math.max(
    0,
    Math.min(game.canvas.width - game.player.width, game.player.x)
  );
}

function updateItems(deltaTime) {
  const speedMultiplier = game.powerups.slowmo.active ? 0.3 : 1;

  game.items.forEach((item, index) => {
    // Update trail
    item.trail.push({
      x: item.x + item.config.size / 2,
      y: item.y + item.config.size / 2,
    });
    if (item.trail.length > CONFIG.ITEM_TRAIL_LENGTH) {
      item.trail.shift();
    }

    // Move item
    item.y += game.fallSpeed * speedMultiplier;

    // Check collision with player
    if (checkCollision(item, game.player)) {
      collectItem(item, index);
    }

    // Remove if off-screen
    if (item.y > game.canvas.height) {
      game.items.splice(index, 1);
      if (item.type !== ITEM_TYPES.POISON) {
        game.health--;
        game.combo = 0;
        createParticles(
          item.x + item.config.size / 2,
          item.y + item.config.size / 2,
          "#ff4444",
          5
        );
        audioManager.playMissSound();
        updateHUD();
      }
    }
  });
}

function checkCollision(item, player) {
  return (
    item.x < player.x + player.width &&
    item.x + item.config.size > player.x &&
    item.y < player.y + player.height &&
    item.y + item.config.size > player.y
  );
}

function collectItem(item, index) {
  const config = item.config;

  // Handle power-ups
  if (config.powerup) {
    activatePowerUp(config.powerup);
    createParticles(
      item.x + item.config.size / 2,
      item.y + item.config.size / 2,
      config.color,
      20
    );
    game.items.splice(index, 1);
    audioManager.playCollectSound(item.type);
    return;
  }

  // Calculate points with combo
  let points = config.points;
  if (points > 0) {
    game.combo++;
    game.comboTimer = CONFIG.COMBO_TIMEOUT;
    game.maxCombo = Math.max(game.maxCombo, game.combo);
    points *= game.combo;
    game.itemsCollected++;

    // Flash combo indicator
    const multiplierEl = document.getElementById("multiplierValue");
    multiplierEl.classList.add("combo-active");
    setTimeout(() => multiplierEl.classList.remove("combo-active"), 500);
  } else {
    // Negative item
    if (game.powerups.shield.active) {
      // Shield absorbs one hit
      game.powerups.shield.active = false;
      createParticles(
        item.x + item.config.size / 2,
        item.y + item.config.size / 2,
        "#C0C0C0",
        15
      );
      game.items.splice(index, 1);
      return;
    }

    game.combo = 0;
    if (config.damage) {
      game.health -= config.damage;
      screenShake();
    }
  }

  // Apply health changes
  if (config.heal) {
    game.health = Math.min(game.maxHealth, game.health + config.heal);
  }

  // Update score
  game.score += points;
  if (game.score > game.highScore) {
    game.highScore = game.score;
    localStorage.setItem("tidebreak-highscore", game.highScore);
  }

  // Visual feedback
  createParticles(
    item.x + item.config.size / 2,
    item.y + item.config.size / 2,
    config.color,
    points > 0 ? 10 : 5
  );

  // Remove item
  game.items.splice(index, 1);

  // Sound
  if (points > 0) {
    audioManager.playCollectSound(item.type);
  } else {
    audioManager.playNegativeSound(item.type);
  }

  updateHUD();
}

function activatePowerUp(type) {
  game.powerups[type].active = true;
  game.powerups[type].timer = CONFIG.POWERUP_DURATION;

  // Show indicator
  const indicator = document.getElementById("powerupIndicator");
  const names = { magnet: "MAGNET", slowmo: "SLOW MOTION", shield: "SHIELD" };
  indicator.textContent = `${names[type]} ACTIVATED!`;
  indicator.classList.add("active");

  setTimeout(() => indicator.classList.remove("active"), 2000);
}

function updatePowerUps(deltaTime) {
  Object.keys(game.powerups).forEach((key) => {
    const powerup = game.powerups[key];
    if (powerup.active) {
      powerup.timer -= deltaTime;
      if (powerup.timer <= 0) {
        powerup.active = false;
      }
    }
  });
}

function updateCombo(deltaTime) {
  if (game.combo > 0) {
    game.comboTimer -= deltaTime;
    if (game.comboTimer <= 0) {
      game.combo = 0;
      updateHUD();
    }
  }
}

function updateWave(deltaTime) {
  game.waveTimer += deltaTime;
  if (game.waveTimer >= CONFIG.WAVE_DURATION) {
    game.waveTimer = 0;
    game.wave++;
    game.fallSpeed = Math.min(game.fallSpeed + 0.5, CONFIG.MAX_FALL_SPEED);
    game.spawnRate = Math.max(game.spawnRate - CONFIG.SPAWN_RATE_DECREASE, 200);
    audioManager.playWaveUpSound();
    createParticles(
      game.canvas.width / 2,
      game.canvas.height / 2,
      "#00FFFF",
      30
    );
  }
}

function createParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 2 + Math.random() * 3;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color,
      size: 3 + Math.random() * 3,
    });
  }
}

function updateParticles() {
  game.particles = game.particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    p.size *= 0.96;
    return p.life > 0;
  });
}

function screenShake() {
  document.body.classList.add("screen-shake");
  setTimeout(() => document.body.classList.remove("screen-shake"), 300);
}

// ==================== RENDERING ====================
function render() {
  // Clear canvas
  game.ctx.fillStyle = "rgba(0, 20, 40, 0.1)";
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

  // Render item trails
  game.items.forEach((item) => {
    if (item.trail.length > 1) {
      game.ctx.strokeStyle = item.config.color + "40";
      game.ctx.lineWidth = 3;
      game.ctx.beginPath();
      item.trail.forEach((point, i) => {
        if (i === 0) game.ctx.moveTo(point.x, point.y);
        else game.ctx.lineTo(point.x, point.y);
      });
      game.ctx.stroke();
    }
  });

  // Render items
  game.items.forEach((item) => {
    // Glow effect
    const gradient = game.ctx.createRadialGradient(
      item.x + item.config.size / 2,
      item.y + item.config.size / 2,
      0,
      item.x + item.config.size / 2,
      item.y + item.config.size / 2,
      item.config.size
    );
    gradient.addColorStop(0, item.config.color + "ff");
    gradient.addColorStop(1, item.config.color + "00");

    game.ctx.fillStyle = gradient;
    game.ctx.fillRect(
      item.x - 5,
      item.y - 5,
      item.config.size + 10,
      item.config.size + 10
    );

    // Item itself
    game.ctx.fillStyle = item.config.color;
    game.ctx.font = `${item.config.size}px Arial`;
    game.ctx.textAlign = "center";
    game.ctx.textBaseline = "middle";
    game.ctx.fillText(
      item.config.emoji,
      item.x + item.config.size / 2,
      item.y + item.config.size / 2
    );
  });

  // Render player
  const playerColor = game.powerups.shield.active ? "#C0C0C0" : "#4169E1";
  const glowSize = game.powerups.shield.active ? 15 : 8;

  // Player glow
  const gradient = game.ctx.createRadialGradient(
    game.player.x + game.player.width / 2,
    game.player.y + game.player.height / 2,
    0,
    game.player.x + game.player.width / 2,
    game.player.y + game.player.height / 2,
    glowSize
  );
  gradient.addColorStop(0, playerColor + "ff");
  gradient.addColorStop(1, playerColor + "00");
  game.ctx.fillStyle = gradient;
  game.ctx.fillRect(
    game.player.x - glowSize,
    game.player.y - glowSize,
    game.player.width + glowSize * 2,
    game.player.height + glowSize * 2
  );

  // Player
  game.ctx.fillStyle = playerColor;
  game.ctx.fillRect(
    game.player.x,
    game.player.y,
    game.player.width,
    game.player.height
  );
  game.ctx.strokeStyle = "#fff";
  game.ctx.lineWidth = 2;
  game.ctx.strokeRect(
    game.player.x,
    game.player.y,
    game.player.width,
    game.player.height
  );

  // Player emoji
  game.ctx.font = "30px Arial";
  game.ctx.textAlign = "center";
  game.ctx.textBaseline = "middle";
  game.ctx.fillText(
    "🚢",
    game.player.x + game.player.width / 2,
    game.player.y + game.player.height / 2
  );

  // Render particles
  game.particles.forEach((p) => {
    game.ctx.globalAlpha = p.life;
    game.ctx.fillStyle = p.color;
    game.ctx.beginPath();
    game.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    game.ctx.fill();
  });
  game.ctx.globalAlpha = 1;
}

// ==================== HUD & UI ====================
function updateHUD() {
  document.getElementById("scoreValue").textContent = game.score;
  document.getElementById("multiplierValue").textContent = game.combo + "x";
  document.getElementById("waveValue").textContent = game.wave;

  // Update health bar
  const healthPercent = (game.health / game.maxHealth) * 100;
  document.getElementById("healthFill").style.width = healthPercent + "%";

  // Check game over
  if (game.health <= 0 && !game.gameOver) {
    gameOver();
  }
}

function gameOver() {
  game.gameOver = true;
  document.getElementById("finalScore").textContent = game.score;
  document.getElementById("finalWave").textContent = game.wave;
  document.getElementById("finalItems").textContent = game.itemsCollected;
  document.getElementById("finalCombo").textContent = game.maxCombo;
  document.getElementById("highScoreDisplay").textContent = game.highScore;
  document.getElementById("gameOverModal").style.display = "block";
  audioManager.playGameOverSound();
}

// ==================== GAME LOOP ====================
let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (!game.paused && !game.gameOver) {
    updatePlayer();
    updateItems(deltaTime);
    updateParticles();
    updatePowerUps(deltaTime);
    updateCombo(deltaTime);
    updateWave(deltaTime);
    spawnItem();
    render();
  }

  requestAnimationFrame(gameLoop);
}

// ==================== EVENT LISTENERS ====================
document.getElementById("startBtn").addEventListener("click", init);
document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
});

// Add CSS variables for particles
document.documentElement.style.setProperty("--tx", "0px");
document.documentElement.style.setProperty("--ty", "0px");
