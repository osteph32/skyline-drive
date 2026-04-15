/* 
DayBackground.js
Mt. Fuji background. Layers scrolls 
at a different speed to create depth.
*/

class DayBackground {

	constructor(scene) {
		this.scene = scene;
		this.gfxSky = scene.add.graphics().setDepth(0);
		this.gfxFuji = scene.add.graphics().setDepth(1);
		this.gfxGrass = scene.add.graphics().setDepth(2);
		this.gfxTrees = scene.add.graphics().setDepth(3);

        this.treeOffsetL = 0;
        this.treeOffsetR = 0;

        this.clouds = this._generateClouds();

        this._drawStaticLayers();
    }


    /* Call Every Frame */
    update(scrollSpeed) {
        this.treeOffsetL = (this.treeOffsetL + scrollSpeed * 0.6) % 420;
        this.treeOffsetR = (this.treeOffsetR + scrollSpeed * 0.6) % 420;

        this.clouds.forEach(c => {
            c.x -= c.speed;
            if (c.x < -c.w) c.x = C.WIDTH + c.w;
        });

        this._drawDynamicLayers();
    }


    /* Static Layers (Drawn Once) */
	_drawStaticLayers() {
		this._drawSky();
		this._drawSun();
		this._drawFuji();
		this._drawGrass();
	}


	/* Dynamic Layers (Drawn Every Frame) */
	_drawDynamicLayers() {
		this.gfxTrees.clear();
		this._drawClouds();
		this._drawTrees();
	}


    /* Sky */
    _drawSky() {
        const gfx = this.gfxSky;
        const strips = 32;
        const h = C.HORIZON_Y / strips;

        for (let i = 0; i < strips; i++) {
            const t = i / strips;

            const r = Math.round(Phaser.Math.Linear(0x29, 0x87, t));
			const g = Math.round(Phaser.Math.Linear(0x8c, 0xce, t));
			const b = Math.round(Phaser.Math.Linear(0xe0, 0xf0, t));
			const color = (r << 16) | (g << 8) | b;

			gfx.fillStyle(color, 1);
			gfx.fillRect(0, i * h, C.WIDTH, h + 1);
		}
    }


    /* Sun */
    _drawSun() {
        const gfx = this.gfxSky;
        const cx = C.WIDTH * 0.72;
        const cy = C.HORIZON_Y * 0.38;

        /* Outer Glow */
		gfx.fillStyle(C.DAY.SUN, 0.12);
		gfx.fillCircle(cx, cy, 52);
		gfx.fillStyle(C.DAY.SUN, 0.2);
		gfx.fillCircle(cx, cy, 40);

		/* Sun Body */
		gfx.fillStyle(C.DAY.SUN, 1);
		gfx.fillCircle(cx, cy, 28);

		/* Sun Rays */
		gfx.fillStyle(C.DAY.SUN, 0.35);
		const rays = 12;
		for (let i = 0; i < rays; i++) {
			const angle = (i / rays) * Math.PI * 2;
			const rx = cx + Math.cos(angle) * 38;
			const ry = cy + Math.sin(angle) * 38;
			gfx.fillRect(rx - 1, ry - 1, 3, 10);
		}
	}


    /* MT Fuji */
	_drawFuji() {
		const gfx = this.gfxFuji;
		const cx = C.WIDTH / 2;
		const by = C.HORIZON_Y;

		gfx.fillStyle(C.DAY.FUJI_ROCK, 1);
		gfx.fillTriangle(
			cx - 220, by,
			cx + 220, by,
			cx, by - 195,
		);

		gfx.fillStyle(0x4a3838, 1);
		gfx.fillTriangle(
			cx - 160, by,
			cx + 160, by,
			cx, by - 195,
		);

		gfx.fillStyle(C.DAY.FUJI_SNOW, 1);
		gfx.fillTriangle(
			cx - 68, by - 128,
			cx + 68, by - 128,
			cx, by - 195,
		);

		const P = C.PX;
		const snowPx = (col, row, w, h) => {
			gfx.fillStyle(C.DAY.FUJI_SNOW, 1);
			gfx.fillRect(cx + col * P, by - 128 + row * P, w * P, h * P);
		};

		gfx.fillStyle(C.DAY.FUJI_ROCK, 0.6);
		gfx.fillRect(cx - 30, by - 148, 12, 8);
		gfx.fillRect(cx + 18, by - 138, 10, 6);
		gfx.fillRect(cx - 50, by - 132, 8,  5);

		gfx.fillStyle(0xffffff, 0.7);
		gfx.fillTriangle(
			cx - 20, by - 165,
			cx + 20, by - 165,
			cx, by - 195,
		);
	}


	/* Grass Fields */
	_drawGrass() {
		const gfx = this.gfxGrass;

		gfx.fillStyle(C.DAY.GRASS, 1);
		gfx.fillRect(0, C.HORIZON_Y, C.WIDTH, 28);

		gfx.fillStyle(C.DAY.GRASS_DARK, 1);
		gfx.fillRect(0, C.HORIZON_Y, C.WIDTH, 10);

		gfx.fillStyle(C.DAY.GRASS, 1);
		gfx.fillRect(0, C.HORIZON_Y + 28, C.WIDTH, C.HEIGHT);

		gfx.fillStyle(C.DAY.GRASS_DARK, 0.4);
		for (let y = C.HORIZON_Y + 30; y < C.HEIGHT; y += 18) {
			gfx.fillRect(0, y, C.WIDTH, 6);
		}
	}


	/* Clouds */
	_generateClouds() {
		const clouds = [];
		for (let i = 0; i < 5; i++) {
			clouds.push({
				x: Phaser.Math.Between(0, C.WIDTH),
				y: Phaser.Math.Between(18, C.HORIZON_Y * 0.55),
				w: Phaser.Math.Between(60, 130),
				h: Phaser.Math.Between(14, 28),
				speed: Phaser.Math.FloatBetween(0.08, 0.22),
			});
		}
		return clouds;
	}

	_drawClouds() {
		const gfx = this.gfxTrees;
		this.clouds.forEach(c => {
			gfx.fillStyle(0xffffff, 0.88);
			gfx.fillEllipse(c.x, c.y, c.w, c.h);
			gfx.fillStyle(0xffffff, 0.7);
			gfx.fillEllipse(c.x - c.w * 0.25, c.y + 4, c.w * 0.5, c.h * 0.75);
			gfx.fillEllipse(c.x + c.w * 0.2,  c.y + 2, c.w * 0.45, c.h * 0.8);
		});
	}


	/* Cherry Blossom Tress */
	_drawTrees() {
		const gfx = this.gfxTrees;

		/* Left Trees */
		const leftPositions = [0, 95, 190, 285, 380];
		leftPositions.forEach(baseX => {
			const x = 30 + ((baseX - this.treeOffsetL + 420) % 420);
			this._drawTree(gfx, x, C.HORIZON_Y + 14, 0.9);
		});

		/* Right Trees */
		const rightPositions = [0, 95, 190, 285, 380];
		rightPositions.forEach(baseX => {
			const x = C.WIDTH - 30 - ((baseX - this.treeOffsetR + 420) % 420);
			this._drawTree(gfx, x, C.HORIZON_Y + 14, 0.9);
		});

        /* Smaller Trees in Distance */
		for (let i = 0; i < 8; i++) {
			const x = ((i * 110 + this.treeOffsetL * 0.3) % C.WIDTH);
			if (x > 180 && x < C.WIDTH - 180) continue; /* gap in center for road */
			this._drawTree(gfx, x, C.HORIZON_Y + 4, 0.45);
		}
	}

	_drawTree(gfx, x, baseY, scale) {
		const P = C.PX * scale;
		const tw = Math.round(10 * scale);
		const th = Math.round(16 * scale);

		gfx.fillStyle(C.DAY.TREE_TRUNK, 1);
		gfx.fillRect(x - P, baseY, P * 2, th * P * 0.6);

		const layers = [
			{ dy: 0, w: 11, col: C.DAY.BLOSSOM_DARK },
			{ dy: -3, w: 13, col: C.DAY.BLOSSOM      },
			{ dy: -6, w: 11, col: C.DAY.BLOSSOM      },
			{ dy: -9, w: 8, col: C.DAY.BLOSSOM_DARK },
			{ dy: -12, w: 5, col: C.DAY.BLOSSOM      },
		];

		layers.forEach(l => {
			const bw = l.w * P;
			const bh = 4 * P;
			gfx.fillStyle(l.col, 1);
			gfx.fillEllipse(x, baseY + l.dy * scale, bw, bh);
		});

		gfx.fillStyle(0xfce4ec, 0.55);
		gfx.fillEllipse(x - 2 * P, baseY - 6 * scale, 5 * P, 3 * P);
	}
}