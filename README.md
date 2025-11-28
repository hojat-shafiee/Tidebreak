# Wave Collector - Game Off 2025

A vibrant 2D top-down arcade game where you collect waves of falling items to earn points while avoiding negative items.

## 🎮 Game Overview

**Genre:** 2D Top-Down Arcade  
**Theme:** WAVES - representing flowing motion, energy, and surges

### Core Mechanics

- Control a character from a top-down perspective
- Waves of items spawn continuously from the top and move downward
- Collect items to earn points while avoiding negative items
- Waves gradually increase in speed and density
- Avoid missing too many items or the game ends!

## 📊 Item System

Five distinct item categories, each with unique shapes, colors, and point values:

### Positive Items (Grant Points)
1. **Star** (Gold) - ⭐ 100 points
   - Premium item, highly valuable
   - Golden glow with distinct star shape

2. **Diamond** (Green) - 💎 75 points
   - High-value collection item
   - Faceted diamond shape

3. **Heart** (Pink) - ❤️ 50 points
   - Standard positive item
   - Heart shape with warm glow

### Negative Items (Lose Points)
4. **Spike** (Red) - 🔺 -30 points
   - Dangerous triangular hazard
   - Red triangle pointing upward

5. **Poison** (Purple) - ☠️ -50 points
   - Dangerous hazard, heavy penalty
   - Purple square with warning colors

## 🎯 Scoring System

- **Base Scoring:** Positive items award their base points
- **Combo Multiplier:** Collect positive items consecutively to build a combo
  - 1st positive item: 1x points
  - 2nd positive item: 2x points
  - 3rd positive item: 3x points
  - And so on...
- **Combo Reset:** Hitting negative items or missing items breaks your combo
- **Score Management:** Negative items can reduce your score (minimum 0)

## 🎮 Controls

### Keyboard
- **Arrow Keys Left/Right** - Move left and right
- **A/D Keys** - Alternative movement controls

### Mouse
- Click and drag left/right to move

### Touch
- Swipe or drag to move your character

## 🌊 Game Progression

- **Waves:** Each 15 seconds, the game increases difficulty
  - Item spawn rate increases by 20%
  - Item falling speed increases by 15%
- **Difficulty Display:** See your current wave number in the HUD
- **Game Over:** Triggered when you miss 5 items

## 📈 Statistics Tracked

During gameplay:
- **Score** - Your current total points
- **Combo** - Current consecutive positive collection streak
- **Wave** - Current difficulty level
- **Missed Items** - Shown as a health bar in the top-right

At game over:
- Final Score
- Wave Reached
- Total Items Collected
- Maximum Combo Achieved

## 🎨 Visual Design

- **Vector-Based Graphics:** All elements are drawn using HTML5 Canvas vector shapes
- **Minimalistic Style:** Clean, modern design with focus on clarity
- **Colorful Palette:** Each item type has a distinct, recognizable color
- **Smooth Animations:**
  - Wave background effects
  - Glow effects on items and player
  - Smooth player movement
  - Floating damage/score popups
- **Atmospheric Design:** Dark space-like background with blue accents

## 🔧 Technical Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Smooth Performance:** 60 FPS target with optimized rendering
- **Vector Graphics:** No raster sprites, pure HTML5 Canvas
- **Multiple Input Methods:** Keyboard, mouse, and touch support
- **Dynamic Wave System:** Difficulty scales smoothly over time

## 📦 Files

- `index.html` - Game structure and HUD elements
- `styles.css` - Visual styling and animations
- `game.js` - Core game logic and mechanics
- `README.md` - This file

## 🚀 How to Play

1. Open `index.html` in a modern web browser
2. Use your chosen control method to position your character
3. Collect positive items (Star, Diamond, Heart) to score points
4. Avoid negative items (Spike, Poison) to maintain your score
5. Build combos by collecting multiple positive items in a row
6. Survive as many waves as possible before missing 5 items
7. Try to achieve the highest score!

## 💡 Tips for High Scores

- Focus on collecting Gold Stars for maximum points
- Build combos by avoiding negative items
- Watch the spawn patterns and predict item positions
- The Poison items are dangerous—avoid them for large penalties
- As waves increase, stay vigilant for the faster-falling items
- Position yourself centrally to react to items across the full width

## 🎵 Sound Effects

The game includes audio feedback for:
- Item collection (varying by item type)
- Negative hits (warning sound)
- Wave progression (level-up sound)

## 📱 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Requires a browser with HTML5 Canvas and modern JavaScript support.

---

**Game Off 2025 Entry** - Wave Collector  
Developed with vanilla JavaScript, HTML5, and CSS3
