# Skyline Drive

<p align="center">
    <img src="https://img.shields.io/badge/built_with-Phaser_3-8b0000?style=for-the-badge" alt="Phaser 3">
    <img src="https://img.shields.io/badge/language-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/assets-zero-00b4d8?style=for-the-badge" alt="Zero Assets">
    <img src="https://img.shields.io/badge/levels-2-ff006e?style=for-the-badge" alt="2 Levels">
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT">
</p>

<p align="center">
    <img src="https://img.shields.io/badge/GitHub_Pages-live-brightgreen?style=flat-square&logo=github" alt="Live">
    <img src="https://img.shields.io/github/last-commit/osteph32/skyline-drive?style=flat-square" alt="Last Commit">
    <img src="https://img.shields.io/github/repo-size/osteph32/skyline-drive?style=flat-square" alt="Repo Size">
</p>

<p align="center">
    A pixel art driving game built with Phaser 3 and vanilla JavaScript.<br>
    Cruise the Mt. Fuji backroads by day or cut up in Tokyo traffic at night<br>
    all behind the wheel of a Nissan Skyline R32 GTR.
</p>

<p align="center">
    <a href="https://osteph32.github.io/skyline-drive">
        <img src="https://img.shields.io/badge/▶_PLAY_NOW-osteph32.github.io/skyline--drive-0a0a0a?style=for-the-badge" alt="Play Now">
    </a>
</p>

---

## Controls

<p align="center">

| Key | Action |
|:---:|:---|
| `W` / `↑` | Accelerate |
| `S` / `↓` | Brake |
| `A` / `←` | Steer Left |
| `D` / `→` | Steer Right |

</p>

---

## Levels

+---------------------------------------------------------------+
|  LEVEL SELECT                                                 |
+---------------------------------------------------------------+
|                                                               |
|  ☀  Day — MT. Fuji Backroads                                  |
|     Difficulty : Easy                                         |
|     Traffic    : None                                         |
|                                                               |
|  ☽  Night - Tokyo City                                        |
|     Difficulty : Hard                                         |
|     Traffic    : Oncoming + same direction NPC cars           |
|                                                               |
+---------------------------------------------------------------+

---

## Tech Stack

+---------------------------+----------------------------------------+
|  Framework                |  Phaser 3.60                           |
+---------------------------+----------------------------------------+
|  Language                 |  Vanilla JavaScript (ES6 Classes)      |
+---------------------------+----------------------------------------+
|  Rendering                |  HTML5 Canvas / Phaser Graphics API    |
+---------------------------+----------------------------------------+
|  Physics                  |  Manual (no Phaser physics engine)     |
+---------------------------+----------------------------------------+
|  Assets                   |  None                                  |
+---------------------------+----------------------------------------+
|  Hosting                  |  GitHub Pages                          |
+---------------------------+----------------------------------------+

---

## File Structure

skyline-drive/
    index.html                  ← loads Phaser + entry point
    js/
        main.js                 ← Phaser config, boots the game
        constants.js            ← colors, lane positions, speeds, pixel sizes
        scenes/
            MenuScene.js        ← main menu, level select
            DayScene.js         ← Mt. Fuji backroads logic
            NightScene.js       ← Tokyo night + traffic logic
        objects/
            PlayerCar.js        ← R32 GTR pixel art + movement
            Road.js             ← pseudo-3D scrolling road, 4 lanes
            TrafficCar.js       ← NPC cars (night only)
        backgrounds/
            DayBackground.js    ← sky, Fuji, cherry blossoms, grass
            NightBackground.js  ← city skyline, neon signs, stars

---

## Run Locally

No install needed. Just clone and open:

```bash
git clone https://github.com/osteph32/skyline-drive.git
cd skyline-drive
```

Then open `index.html` in your browser. That's it.

> 💡 Tip: Use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
> VS Code extension for auto-reload while developing.
> Right click `index.html` → **Open with Live Server**.

---

## Features

- 3D perspective road with scrolling lane markings
- Two levels with unique backgrounds
- Parallax depth layers like sky, mountains, trees, and buildings scroll at different speeds
- R32 GTR car
- Traffic system with oncoming and same direction NPC cars
- Collision detection with screen shake and speed penalty
- Speed and distance HUD

---

## Author

**Oliver Stephenson**
[linkedin.com/in/ostephenson32](https://linkedin.com/in/ostephenson32) ·
[github.com/osteph32](https://github.com/osteph32)