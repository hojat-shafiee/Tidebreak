# Wave Collector - Quick Start Guide

## Getting Started

### 1. Open the Game
Simply open `index.html` in your web browser. No build process or server required!

### 2. Basic Controls
- **Keyboard**: Use Arrow Keys (← →) or A/D keys to move
- **Mouse**: Click and drag to follow your cursor
- **Touch**: Swipe or drag on mobile devices

### 3. Game Objective
Collect items falling from the top of the screen to earn points. Avoid negative items and don't miss more than 5 items!

## Item Types & Values

### Positive Items (Collect These!)
| Item | Shape | Color | Base Points | Notes |
|------|-------|-------|-------------|-------|
| **Star** ⭐ | 5-pointed star | Gold | 100 | Highest value, best for combos |
| **Diamond** 💎 | Faceted shape | Green | 75 | Mid-tier valuable item |
| **Heart** ❤️ | Heart shape | Pink/Red | 50 | Standard positive item |

### Negative Items (Avoid These!)
| Item | Shape | Color | Point Loss | Notes |
|------|-------|-------|-----------|-------|
| **Spike** 🔺 | Triangle | Red | -30 | Warning hazard |
| **Poison** ☠️ | Square | Purple | -50 | Deadly penalty |

## Scoring Strategy

### Combo System
- Start with 1x multiplier
- Each positive item collected increases multiplier
- Hitting a negative item or missing items **breaks your combo**
- Example: Collecting 3 Stars in a row = 100 + 200 + 300 = 600 points!

### Tips for High Scores
1. **Build combos** - Focus on collecting positive items without hits
2. **Avoid penalties** - Negative items reset your combo
3. **React quickly** - Items fall faster as waves increase
4. **Predict spawns** - Watch the spawn patterns

## Game Difficulty

The game automatically increases difficulty every 15 seconds:
- Items spawn faster
- Items fall faster
- Check your Wave counter in the HUD to track progress

## Game Over Condition

You lose if you miss **5 items** (they fall off the bottom). When this happens:
- Final Score is displayed
- Wave you reached
- Total items collected
- Your best combo achieved
- Click **RESTART GAME** to try again

## HUD Information

**Top-Left Corner:**
- **SCORE**: Your current points total
- **COMBO**: Current multiplier (1x, 2x, 3x, etc.)
- **WAVE**: Current difficulty level

**Top-Right Corner:**
- **MISSED**: Health bar showing how many items you can still miss

## Advanced Tips

### Positioning
- Stay near the center of the screen to react to items anywhere
- Move to follow item patterns
- Anticipate where clusters will appear

### Wave Pressure
- Early waves (1-5): Focus on building high combos
- Mid waves (6-10): Balance combo building with safety
- Late waves (10+): Survival mode - just collect what you can

### Audio Feedback
- Different sounds for each item type
- Wave progression chime signals difficulty increase
- Collect sounds are higher-pitched for positive items
- Miss sounds are low-pitched warnings

## Browser Compatibility

The game works best on:
- Chrome/Chromium
- Firefox
- Safari
- Edge

Requires a modern browser with HTML5 Canvas support.

## Files Explained

| File | Purpose |
|------|---------|
| `index.html` | Game structure and UI |
| `styles.css` | Styling and animations |
| `game.js` | Core game logic and mechanics |
| `audio.js` | Sound effect generation |
| `README.md` | Full documentation |

## Troubleshooting

**Game won't start?**
- Refresh the page (F5)
- Try a different browser
- Check browser console for errors (F12)

**No sound?**
- Click or press a key to activate audio context
- Check browser audio settings
- Sound works on user interaction (security feature)

**Game feels slow/laggy?**
- Close other browser tabs
- Reduce browser zoom (Ctrl + minus)
- Try a different browser
- Check if hardware acceleration is enabled

## Game Off 2025

Wave Collector is an entry for Game Off 2025 with the theme "WAVES".

The game visualizes waves through:
- Continuous flow of items from top to bottom
- Energy surges as difficulty increases
- Visual wave effects in the background
- Ocean/water color scheme (blues and teals)

---

**Ready to play? Open `index.html` and start collecting!**
