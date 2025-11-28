# 🌊 Wave Collector - Visual Game Guide

## Game Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  SCORE      COMBO        WAVE      │    MISSED: 2/5 [████▓▓▓▓▓] │ │
│ │    420       3x           5        │                             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│                                                                       │
│                          ⭐ (falling)                                 │
│                                                                       │
│                    [Player: ◯ moving left]                           │
│                          💎  🔺                                       │
│                                                                       │
│                          ❤️   ☠️                                      │
│                                                                       │
│                          Game Canvas                                 │
│                          (800 × 600px)                               │
│                                                                       │
│                          (Items spawn here)                          │
│                                                                       │
│                      (Player moves here)                             │
│                                                                       │
│                  (Items are collected here)                          │
│                                                                       │
│               (Missed items fall to bottom)                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Item Reference Chart

### POSITIVE ITEMS (Collect These!)

```
⭐ STAR                    💎 DIAMOND                 ❤️ HEART
════════════════════════════════════════════════════════════════════
Color: Gold (#FFD700)     Color: Green (#00FF88)    Color: Pink (#FF1493)
Shape: 5-pointed star     Shape: Diamond facets     Shape: Heart outline
Points: 100               Points: 75                Points: 50
Multiplier: Yes (combo)   Multiplier: Yes (combo)   Multiplier: Yes (combo)
Rarity: Rare              Rarity: Uncommon          Rarity: Common
Sound: Ascending chime    Sound: Sparkle            Sound: Gentle bell
Value: Highest            Value: Medium             Value: Lowest positive
════════════════════════════════════════════════════════════════════
```

### NEGATIVE ITEMS (Avoid These!)

```
🔺 SPIKE                   ☠️ POISON
═════════════════════════════════════════════════════════════
Color: Red (#FF4444)      Color: Purple (#9933FF)
Shape: Triangle           Shape: Square
Points: -30               Points: -50
Effect: Reset combo       Effect: Reset combo
Rarity: Uncommon          Rarity: Rare
Sound: Warning buzz       Sound: Descending tones
Danger: Medium            Danger: High
═════════════════════════════════════════════════════════════
```

---

## Scoring Examples

### Building a Combo

```
Sequence: ⭐ → 💎 → ❤️ → ⭐ → 🔺

⭐ (Star):   100 × 1 = 100 points  [Combo: 1x]
💎 (Diamond): 75 × 2 = 150 points  [Combo: 2x]
❤️ (Heart):   50 × 3 = 150 points  [Combo: 3x]
⭐ (Star):   100 × 4 = 400 points  [Combo: 4x]
🔺 (Spike):   -30 points, COMBO RESET!

Total: 100 + 150 + 150 + 400 - 30 = 770 points
```

### Combo Reset Scenarios

```
Scenario 1: Missing Items
┌─────────────────────────────────────────┐
│ ⭐ Collected → ✓ (Combo 2x)              │
│ 💎 Collected → ✓ (Combo 3x)              │
│ ❄️ Missed    → ✗ COMBO RESET TO 1x!      │
│ ❤️ Collected → ✓ (Back to Combo 2x)      │
└─────────────────────────────────────────┘

Scenario 2: Hitting a Negative
┌─────────────────────────────────────────┐
│ ⭐ Collected → ✓ (Combo 2x)              │
│ 💎 Collected → ✓ (Combo 3x)              │
│ 🔺 Hit       → COMBO RESET TO 1x!        │
│ ❤️ Collected → ✓ (Back to Combo 2x)      │
└─────────────────────────────────────────┘
```

---

## Difficulty Progression

### Wave Curve Over Time

```
Wave 1 (0-15s):    Spawn Rate: 2/sec     Speed: 3 px/frame
Wave 2 (15-30s):   Spawn Rate: 2.4/sec   Speed: 3.45 px/frame    ↑
Wave 3 (30-45s):   Spawn Rate: 2.88/sec  Speed: 3.97 px/frame    ↑
Wave 4 (45-60s):   Spawn Rate: 3.46/sec  Speed: 4.56 px/frame    ↑
Wave 5 (60-75s):   Spawn Rate: 4.15/sec  Speed: 5.24 px/frame    ↑
```

### Item Falling Speed vs Wave

```
Canvas Height: 600 pixels

Wave 1: 3 px/frame   → ~200 frames to fall (~3.3 seconds at 60 FPS)
Wave 2: 3.45 px/fr   → ~174 frames (~2.9 seconds)
Wave 3: 3.97 px/fr   → ~151 frames (~2.5 seconds)
Wave 4: 4.56 px/fr   → ~132 frames (~2.2 seconds)
Wave 5: 5.24 px/fr   → ~114 frames (~1.9 seconds)

As difficulty increases, you have less time to react!
```

---

## Control Reference

### Keyboard Controls

```
   UP          (Not used)
    ↑
    │
← | | →        Arrow Keys or A/D to move left and right
LEFT RIGHT

Keys Supported:
  • ArrowLeft  / A  → Move Left
  • ArrowRight / D  → Move Right
```

### Mouse Controls

```
Before:           During Click & Drag:    Result:
     ↓                  ↓                    ↓
   ┌───┐             ┌───┐              ┌───────┐
   │ ◯ │────────────→│ ◯ │──────────────│   ◯   │
   └───┘ (click)     └───┘ (drag)       └───────┘
                                      (follows cursor)
```

### Touch Controls

```
  Swipe Left         Swipe Right       Touch & Drag
      ↙                  ↖                  │
   ╭──╮              ╭──╮              ╭──────────╮
   │  │──────────→   │  │←──────────   │          │
   ╰──╯              ╰──╯              ╰──────────╯
                                       (follows touch)
```

---

## HUD Display Breakdown

### Top-Left: Score Display
```
┌────────────────┐
│ SCORE          │  ← Label
│  12,540        │  ← Current Score (increases with collections)
└────────────────┘
```

### Top-Center: Combo Display
```
┌────────────────┐
│ COMBO          │  ← Label
│  4x            │  ← Multiplier (1x to 10x+)
└────────────────┘
```

### Top-Right (First): Wave Display
```
┌────────────────┐
│ WAVE           │  ← Label
│  3             │  ← Current Wave (increases every 15 sec)
└────────────────┘
```

### Top-Right (Second): Missed Indicator
```
MISSED: 2/5
─────────────────────────────────────
[████████░░░░░░░░░░]  ← Health bar
                       ← 5 allowed misses total
```

---

## Game Over Screen

```
┌──────────────────────────────────────┐
│                                      │
│          ╔════════════════╗          │
│          ║  GAME OVER     ║          │
│          ╚════════════════╝          │
│                                      │
│         FINAL SCORE                  │
│         ┌──────────────┐             │
│         │   25,840     │             │
│         └──────────────┘             │
│                                      │
│        Wave Reached:      7          │
│        Items Collected:    94        │
│        Max Combo:        12x         │
│                                      │
│      ╔────────────────────╗          │
│      │  RESTART GAME      │          │
│      ╚────────────────────╝          │
│                                      │
└──────────────────────────────────────┘
```

---

## Color Palette Reference

```
PRIMARY GAME COLORS:
════════════════════════════════════

Item Colors:
  ⭐ Star:      #FFD700  (Gold / Bright)
  💎 Diamond:   #00FF88  (Green / Lime)
  ❤️ Heart:     #FF1493  (Pink / Hot Pink)
  🔺 Spike:     #FF4444  (Red / Danger)
  ☠️ Poison:    #9933FF  (Purple / Mystical)

UI Colors:
  Player:       #64c8ff  (Cyan / Tech Blue)
  HUD Text:     #64c8ff  (Cyan accent)
  Combo Mult:   #ffa500  (Orange highlight)
  Wave Display: #ff6ec7  (Magenta)

Background:
  Primary:      #0f1b3c  (Dark Navy)
  Secondary:    #1a2f5a  (Deep Blue)
  Accent:       #0a0e27  (Darkest)

Effects:
  Glow:         rgba(100, 200, 255, 0.3)
  Shadow:       rgba(0, 0, 0, 0.5)
```

---

## Animation Guide

### Player Movement
```
Frame 0:  ◯
Frame 1:  ◯
Frame 2:   ◯
Frame 3:    ◯
Frame 4:     ◯  (smooth easing, not instant jump)
```

### Item Collection Popup
```
Frame 0:  [+100]        (full opacity, yellow)
Frame 1:  [+100]↑       (moving up, fading)
Frame 2:    [+100]↑     (continuing up)
Frame 3:      ↑         (transparent, invisible)
```

### Wave Background Effect
```
      ╱╲╱╲╱╲╱╲╱╲       (animated wave lines)
     ╱  ╱  ╱  ╱  ╱     (moving downward continuously)
    ╱  ╱  ╱  ╱  ╱
   ╱  ╱  ╱  ╱  ╱
```

---

## Performance Indicators

### Frame Rate Target
```
60 FPS = Smooth Gameplay
50-60 FPS = Playable
<50 FPS = Lag (try closing other apps)
```

### Input Latency
```
<50ms = Imperceptible (target)
50-100ms = Slight delay (playable)
>100ms = Noticeable lag (reduce background apps)
```

---

## Typical Game Session

### Duration: 5-10 minutes

```
Minute 0-2:   Early Waves (1-8)
              • Slow, manageable pace
              • Easy to build combos
              • Good for learning

Minute 2-5:   Mid Waves (8-15)
              • Faster items and spawns
              • Harder to maintain combo
              • Requires focus

Minute 5-8:   Late Waves (15+)
              • Very fast and dense
              • Constant pressure
              • Survival mode

Typical end:  Most players lose at waves 10-20
```

---

## Accessibility Features

### Visual
- High contrast colors for item types
- Large, readable HUD text
- Clear glow effects
- Distinct shapes for color-blind modes

### Audio
- Different tones for different sounds
- Optional sound (can be muted)
- No critical audio-only feedback

### Input
- Multiple control schemes
- No timing-based QTE sequences
- Pausable gameplay (with modification)

### Difficulty
- Gradual progression
- No difficulty spike
- Manageable at all levels

---

## Statistics Table

```
┌──────────────────────────┬──────────────┬──────────────┐
│ Metric                   │ Starting     │ Wave 10      │
├──────────────────────────┼──────────────┼──────────────┤
│ Items/Second             │ 2.0          │ 5.2          │
│ Item Fall Speed          │ 3 px/frame   │ 5.4 px/frame │
│ Fall Time (600px)        │ 3.3 sec      │ 1.9 sec      │
│ Spawn Density            │ Low          │ Very High    │
│ Difficulty Rating        │ ★☆☆☆☆        │ ★★★★★        │
└──────────────────────────┴──────────────┴──────────────┘
```

---

## Quick Reference Card

```
GAME CONTROLS:
  ← / A  :  Move Left
  → / D  :  Move Right
  🖱 Drag :  Follow Mouse
  👆 Swipe : Mobile Control

ITEM VALUES:
  ⭐ = +100 × Combo
  💎 = +75 × Combo
  ❤️ = +50 × Combo
  🔺 = -30 (Reset Combo)
  ☠️ = -50 (Reset Combo)

GAME RULES:
  • Collect items (left/right movement)
  • Build combos with positive items
  • Negative items break your combo
  • Miss 5 items = Game Over
  • Waves increase every 15 seconds

WINNING STRATEGY:
  1. Stay in the center
  2. Collect ⭐ and 💎 for high scores
  3. Avoid 🔺 and ☠️
  4. Build long combos
  5. React quickly to waves
```

---

## Button Guide

```
┌────────────────────────┐
│  RESTART GAME BUTTON   │  (appears after game over)
│   (Click to restart)   │
└────────────────────────┘
```

---

This visual guide complements the text documentation. Refer to other documentation for detailed gameplay mechanics and strategies!

🌊 **Enjoy Wave Collector!** 🌊
