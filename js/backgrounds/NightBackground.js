/*
NightBackground.js
Tokyo City Night background Layers scrolls
*/

class NightBackground {

	constructor(scene) {
		this.scene = scene;
		this.gfxSky = scene.add.graphics().setDepth(0);
		this.gfxCity = scene.add.graphics().setDepth(1);
		this.gfxGround = scene.add.graphics().setDepth(2);
		this.gfxNeon = scene.add.graphics().setDepth(3);

		this.stars = this._generateStars();
		this.neonFlicker = [];
		this.buildings = this._generateBuildings();
		this.neonOffset = 0;

		this._drawSky();
		this._drawGround();
		this._setupFlicker();
	}

	/* Call Every Frame */
	update(scrollSpeed) {
		this.neonOffset = (this.neonOffset + scrollSpeed * 0.25) % C.WIDTH;
		this.gfxCity.clear();
		this.gfxNeon.clear();
		this._drawBuildings();
		this._drawNeonSigns();
		this._drawStreetGlow();
	}

	/* Stars */
	_generateStars() {
		const stars = [];
		for (let i = 0; i < 120; i++) {
			stars.push({
				x: Phaser.Math.Between(0, C.WIDTH),
				y: Phaser.Math.Between(0, C.HORIZON_Y * 0.85),
				size: Math.random() < 0.15 ? 2 : 1,
				alpha: Phaser.Math.FloatBetween(0.3, 1.0),
			});
		}
		return stars;
	}

	/* Sky */
	_drawSky() {
		const gfx = this.gfxSky;
		const strips = 32;
		const h = C.HORIZON_Y / strips;

		for (let i = 0; i < strips; i++) {
			const t = i / strips;

			const r = Math.round(Phaser.Math.Linear(0x02, 0x12, t));
			const g = Math.round(Phaser.Math.Linear(0x03, 0x08, t));
			const b = Math.round(Phaser.Math.Linear(0x12, 0x28, t));
			const color = (r << 16) | (g << 8) | b;

			gfx.fillStyle(color, 1);
			gfx.fillRect(0, i * h, C.WIDTH, h + 1);
		}

		/* Stars */
		this.stars.forEach(s => {
			gfx.fillStyle(0xffffff, s.alpha);
			gfx.fillRect(s.x, s.y, s.size, s.size);
		});

		/* City Glow */
		gfx.fillStyle(C.NIGHT.NEON_PINK, 0.06);
		gfx.fillRect(0, C.HORIZON_Y - 40, C.WIDTH, 40);
		gfx.fillStyle(C.NIGHT.NEON_CYAN, 0.04);
		gfx.fillRect(0, C.HORIZON_Y - 25, C.WIDTH, 25);
	}

	/* Ground */
	_drawGround() {
		const gfx = this.gfxGround;

		gfx.fillStyle(0x0a0c18, 1);
		gfx.fillRect(0, C.HORIZON_Y, C.WIDTH, C.HEIGHT - C.HORIZON_Y);
		gfx.lineStyle(1, C.NIGHT.NEON_CYAN, 0.04);
		for (let y = C.HORIZON_Y + 10; y < C.HEIGHT; y += 20) {
			gfx.moveTo(0, y);
			gfx.lineTo(C.WIDTH, y);
		}
		gfx.strokePath();
	}

	/* Buildings */
	_generateBuildings() {
		const buildings = [];

		/* Left */
		const leftDefs = [
			{ x: -10, w: 70, h: 180 },
			{ x: 55, w: 50, h: 120 },
			{ x: 100, w: 80, h: 210 },
			{ x: 175, w: 55, h: 150 },
			{ x: 225, w: 45, h: 90  },
			{ x: 265, w: 60, h: 130 },
		];

		/* Right */
		const rightDefs = [
			{ x: C.WIDTH - 60, w: 70, h: 180 },
			{ x: C.WIDTH - 110, w: 50, h: 120 },
			{ x: C.WIDTH - 190, w: 80, h: 210 },
			{ x: C.WIDTH - 245, w: 55, h: 150 },
			{ x: C.WIDTH - 295, w: 45, h: 90  },
			{ x: C.WIDTH - 355, w: 60, h: 130 },
		];

		[...leftDefs, ...rightDefs].forEach(def => {
			const windows = [];
			const baseY   = C.HORIZON_Y - def.h;
			for (let wy = baseY + 10; wy < C.HORIZON_Y - 10; wy += 16) {
				for (let wx = def.x + 8; wx < def.x + def.w - 8; wx += 14) {
					if (Math.random() < 0.5) {
						const col = Math.random() < 0.65
							? C.NIGHT.BUILDING_LIT
							: C.NIGHT.NEON_CYAN;
						windows.push({ x: wx, y: wy, col, on: Math.random() > 0.1 });
					}
				}
			}
			buildings.push({ ...def, windows });
		});

		return buildings;
	}

	_drawBuildings() {
		const gfx = this.gfxCity;

		this.buildings.forEach(b => {
			const baseY = C.HORIZON_Y - b.h;

			gfx.fillStyle(C.NIGHT.BUILDING, 1);
			gfx.fillRect(b.x, baseY, b.w, b.h);
			gfx.lineStyle(1, 0x1e2340, 1);
			gfx.strokeRect(b.x, baseY, b.w, b.h);

			b.windows.forEach(w => {
				if (w.on) {
					gfx.fillStyle(w.col, 0.85);
					gfx.fillRect(w.x, w.y, 7, 8);
				}
			});

			if (b.h > 160) {
				gfx.fillStyle(0x888888, 1);
				gfx.fillRect(b.x + b.w / 2 - 1, baseY - 18, 2, 18);
				gfx.fillStyle(C.NIGHT.NEON_PINK, 0.9);
				gfx.fillRect(b.x + b.w / 2 - 2, baseY - 20, 4, 4);
			}
		});
	}

	/*  Neon Signs */
	_drawNeonSigns() {
		const gfx   = this.gfxNeon;
		const signs = [
			{ x: 30, y: C.HORIZON_Y - 95, w: 52, h: 22, col: C.NIGHT.NEON_PINK,  label: 'NISSAN'  },
			{ x: 110, y: C.HORIZON_Y - 140, w: 44, h: 18, col: C.NIGHT.NEON_CYAN,  label: 'NISMO'   },
			{ x: 175, y: C.HORIZON_Y - 100, w: 58, h: 20, col: C.NIGHT.NEON_GREEN, label: 'TOKYO'   },
			{ x: C.WIDTH - 85, y: C.HORIZON_Y - 95, w: 52, h: 22, col: C.NIGHT.NEON_CYAN,  label: 'GTR'},
			{ x: C.WIDTH - 160, y: C.HORIZON_Y - 140, w: 48, h: 18, col: C.NIGHT.NEON_PINK,  label: 'R32'     },
			{ x: C.WIDTH - 235, y: C.HORIZON_Y - 105, w: 56, h: 20, col: C.NIGHT.NEON_GREEN, label: 'DRIVE'   },
		];

		signs.forEach((s, i) => {
			const flicker = this.neonFlicker[i] || 1;

			gfx.fillStyle(0x000000, 0.7);
			gfx.fillRect(s.x - s.w / 2, s.y - s.h / 2, s.w, s.h);
			gfx.lineStyle(2, s.col, 0.9 * flicker);
			gfx.strokeRect(s.x - s.w / 2, s.y - s.h / 2, s.w, s.h);

			gfx.fillStyle(s.col, 0.07 * flicker);
			gfx.fillRect(
				s.x - s.w / 2 - 6,
				s.y - s.h / 2 - 6,
				s.w + 12,
				s.h + 12
			);

			const txt = this.scene.add.text(s.x, s.y, s.label, {
				fontFamily: C.UI.FONT,
				fontSize: '10px',
				color: Phaser.Display.Color.IntegerToColor(s.col).rgba,
			}).setOrigin(0.5).setDepth(4).setAlpha(flicker);

			/* Redrawn Text Each Update */
			this.scene.time.delayedCall(16, () => txt.destroy());
		});
	}

	/*  Street Glow Reflections */
	_drawStreetGlow() {
		const gfx = this.gfxNeon;

		/* Glow pools On Wet Road */
		gfx.fillStyle(C.NIGHT.NEON_PINK, 0.04);
		gfx.fillRect(0, C.HORIZON_Y, 220, C.HEIGHT - C.HORIZON_Y);

		gfx.fillStyle(C.NIGHT.NEON_CYAN, 0.04);
		gfx.fillRect(C.WIDTH - 220, C.HORIZON_Y, 220, C.HEIGHT - C.HORIZON_Y);

		/* Headlights Glow*/
		gfx.fillStyle(0xffffff, 0.03);
		gfx.fillTriangle(
			C.WIDTH / 2 - 40, C.HEIGHT,
			C.WIDTH / 2 + 40, C.HEIGHT,
			C.WIDTH / 2, C.HORIZON_Y + 20,
		);
	}

	/*  Neon Flicker Setup  */
	_setupFlicker() {
		this.scene.time.addEvent({
			delay: 180,
			callback: () => {
				const i = Phaser.Math.Between(0, 5);
				this.neonFlicker[i] = Math.random() < 0.12 ? 0.3 : 1;
			},
			loop: true,
		});
	}
}