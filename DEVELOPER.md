# Wave Collector - Developer Guide

## For Contributors and Future Development

This guide explains the architecture and how to modify or extend Wave Collector.

## Project Structure Overview

### `index.html`
- Main HTML document
- Defines game container and canvas
- Creates HUD elements (score, combo, wave display)
- Game over modal
- Loads CSS and JavaScript files

### `styles.css`
- All visual styling
- Responsive design media queries
- Animations (@keyframes)
- HUD styling
- Modal styling
- Color scheme definitions

### `game.js` (Main Game Engine)
Contains several key classes:

#### `GameConfig` (Static Constants)
```javascript
GameConfig.CANVAS_WIDTH = 800;
GameConfig.CANVAS_HEIGHT = 600;
GameConfig.PLAYER_SIZE = 30;
GameConfig.ITEM_SIZE = 25;
GameConfig.BASE_SPAWN_RATE = 2; // items/sec
GameConfig.BASE_ITEM_SPEED = 3; // pixels/frame
GameConfig.WAVE_INCREASE_INTERVAL = 15000; // ms
GameConfig.MISSED_ITEMS_LIMIT = 5;
```

**To adjust game difficulty:**
- Increase `BASE_SPAWN_RATE` for more items
- Increase `BASE_ITEM_SPEED` for faster falling
- Decrease `WAVE_INCREASE_INTERVAL` for quicker waves
- Adjust `MISSED_ITEMS_LIMIT` for easier/harder game

#### `ItemType` Class
Defines item properties. Create new items:
```javascript
const ITEM_TYPES = {
    STAR: new ItemType(0, 'Star', '#FFD700', 'star', 100, false),
    // Format: new ItemType(id, name, color, shape, points, isNegative)
};
```

**Shapes available**: 'circle', 'square', 'triangle', 'star', 'diamond', 'heart'

#### `Item` Class
- Handles individual item logic
- `update()` - Moves item down
- `draw(ctx)` - Renders item to canvas
- Contains shape drawing methods

**To add new shapes:**
1. Add shape name to switch case in `Item.draw()`
2. Implement drawing logic
3. Reference in ITEM_TYPES

#### `Player` Class
- Player position and movement
- `update(keys)` - Processes input and movement
- `draw(ctx)` - Renders player
- `checkCollision(item)` - Collision detection

**To modify player:**
- Change `this.speed` for movement speed
- Modify drawing in `draw()` method
- Adjust collision radius in `checkCollision()`

#### `WaveManager` Class
- Tracks current wave number
- Manages difficulty increase timing
- Calculates spawn rate and item speed multipliers

**To customize waves:**
```javascript
// In WaveManager.update()
if (this.waveTimer >= GameConfig.WAVE_INCREASE_INTERVAL) {
    this.currentWave++;
    // Modify multiplier increases:
    this.itemSpeedMultiplier += 0.15; // Change 0.15
    this.spawnRateMultiplier += 0.2;  // Change 0.2
}
```

#### `Game` Class (Main Game Loop)
The core game engine coordinating everything:

**Key Methods:**
- `gameLoop()` - Main update/render loop
- `update(deltaTime)` - Update game state
- `draw()` - Render to canvas
- `spawnItems()` - Create new items
- `collectItem(item)` - Handle collection
- `endGame()` - Handle game over

**To add new features:**
1. Add variables to constructor
2. Update in `update()` method
3. Draw in `draw()` method
4. Handle interactions in appropriate method

### `audio.js` (Sound System)

#### `AudioManager` Class
Uses Web Audio API for dynamic sound generation:

**Methods for sound effects:**
- `playCollectSound(itemType)` - Item collection
- `playNegativeSound(itemType)` - Negative item hit
- `playMissSound()` - Item missed
- `playWaveUpSound()` - Wave increase
- `playGameOverSound()` - Game over

**To add new sounds:**
```javascript
playNewSound() {
    this.init();
    // Use playSound(frequency, duration, type, volume)
    this.playSound(440, 0.5, 'sine', 0.5); // A4 note, 0.5s
}
```

**Frequency guide:**
- 100-200 Hz: Deep bass/warning
- 200-400 Hz: Low tones
- 440 Hz: Middle A (standard)
- 800-1200 Hz: High tones
- 1200+ Hz: Very high/chime

## Modifying Game Behavior

### Adjust Difficulty Curve
Edit `GameConfig` and `WaveManager`:
```javascript
// More gradual increase
GameConfig.WAVE_INCREASE_INTERVAL = 20000; // 20 sec instead of 15
this.itemSpeedMultiplier += 0.1; // 10% instead of 15%
this.spawnRateMultiplier += 0.1; // 10% instead of 20%
```

### Change Scoring Values
Edit `ITEM_TYPES`:
```javascript
STAR: new ItemType(0, 'Star', '#FFD700', 'star', 150, false), // 150 instead of 100
```

### Add New Item Types
1. Define in `ITEM_TYPES`:
```javascript
TREASURE: new ItemType(5, 'Treasure', '#FFB6C1', 'circle', 200, false),
```

2. Add shape drawing if needed in `Item.draw()`

3. Add audio if needed in `audio.js`:
```javascript
else if (itemType === ITEM_TYPES.TREASURE) {
    this.playSoundSequence([1000, 1100, 1200], 0.15, 0.05, 0.7);
}
```

### Modify Player Movement
In `Player` class:
```javascript
this.speed = 10; // Increase from 8 for faster movement
```

Or adjust smoothing factor in `update()`:
```javascript
this.x += (this.targetX - this.x) * 0.20; // Increase from 0.15 for snappier response
```

### Change Colors
Edit hex color codes in:
- `ITEM_TYPES` - Item colors
- `styles.css` - HUD and UI colors
- `Player.draw()` - Player color

## Adding Features

### Add a Power-Up Item
1. Create ItemType in `ITEM_TYPES`
2. Make `isNegative = false` for positive effect
3. In `Game.collectItem()`, add special logic:
```javascript
if (item.type === ITEM_TYPES.POWERUP) {
    this.combo *= 2; // Double combo
    this.createPopupText(item.x, item.y, 'POWER UP!', false);
}
```

### Add a Lives System Instead of Missed Items
Replace `missedItems` logic:
```javascript
constructor() {
    this.lives = 3; // Instead of missedItems
}

// In update():
if (item.isOffScreen()) {
    if (!item.collected) {
        this.lives--;
        if (this.lives <= 0) {
            this.endGame();
        }
    }
}
```

### Add a Pause Feature
Add to `Game` class:
```javascript
constructor() {
    this.paused = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            this.paused = !this.paused;
        }
    });
}

update(deltaTime) {
    if (this.paused || this.gameOver) return;
    // ... rest of update
}
```

### Add Screen Shaking Effect
```javascript
draw() {
    let shakeX = 0, shakeY = 0;
    if (this.isShaking) {
        shakeX = (Math.random() - 0.5) * 10;
        shakeY = (Math.random() - 0.5) * 10;
    }
    this.ctx.translate(shakeX, shakeY);
    // ... rest of draw
}

triggerShake() {
    this.isShaking = true;
    setTimeout(() => { this.isShaking = false; }, 100);
}
```

## Testing & Debugging

### Enable Debug Mode
At end of `Game.draw()`, uncomment:
```javascript
this.drawDebugInfo();
```

### Check Console
Open browser DevTools (F12) to see:
- Any JavaScript errors
- Audio context logs
- Frame rate info (add custom logging)

### Test Different Scenarios
1. **Test collision detection**: Move around and verify item pickup
2. **Test audio**: Listen for different sounds
3. **Test difficulty**: Play past wave 5 to verify increases
4. **Test game over**: Let 5 items pass

## Performance Optimization

### If Game Is Slow:
1. Reduce draw calls in `draw()`
2. Implement object pooling for items
3. Reduce particle effects
4. Disable audio if needed

### If Memory Is High:
1. Limit items in scene (currently unlimited)
2. Clear old popups faster
3. Use single audio context

## Code Style

The project uses:
- Class-based OOP
- camelCase for variables/methods
- UPPER_CASE for constants
- Arrow functions
- Template literals for strings

## Common Modifications Checklist

- [ ] Adjust difficulty (GameConfig)
- [ ] Change item values (ITEM_TYPES)
- [ ] Modify colors (styles.css & game.js)
- [ ] Add/remove shapes (Item.draw())
- [ ] Adjust player speed (Player.update())
- [ ] Add new sound effects (audio.js)
- [ ] Change game over condition (Game.update())
- [ ] Modify HUD display (styles.css)

## Future Enhancement Ideas

1. **Particle Effects** - Add burst effects when collecting items
2. **Background Music** - Add looping background audio
3. **Settings Menu** - Add difficulty selector, sound toggle
4. **Different Levels** - Create level-based progression
5. **Leaderboard** - Add local storage score tracking
6. **Accessibility** - Add colorblind modes, larger fonts
7. **Tutorial** - Add onscreen instructions
8. **Mobile App** - Wrap in Cordova/Capacitor
9. **Multiplayer** - Add WebSocket support
10. **Analytics** - Track player behavior

## Resources

- [MDN Web Docs - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN Web Docs - Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Canvas Game Dev Tutorial](https://www.html5gamedev.com/)

## Submitting Changes

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit pull request with clear description

---

**Happy Developing!**
