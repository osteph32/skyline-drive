/*
MenuScene.js
Main menu scene for Skyline Drive game
with level selector. All art drawn with
Phaser's graphics API.
*/

class MenuScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'MenuScene' });
    }


    /* Create */
    create() {
            this.W = C.WIDTH;
            this.H = C.HEIGHT;

            this._drawBackground();
            this._drawCar();
            this._drawTitle();
            this._drawButtons();
            this._drawFooter();
    }


    /* Background */
    _drawBackground() {
	const gfx = this.add.graphics();

	/* Sky */
	gfx.fillStyle(0x05060f, 1);
	gfx.fillRect(0, 0, this.W, this.H * 0.55);
	gfx.fillStyle(0x1a0a2a, 1);
	gfx.fillRect(0, this.H * 0.38, this.W, this.H * 0.17);

	/* Ground */
	gfx.fillStyle(0x0a0c18, 1);
	gfx.fillRect(0, this.H * 0.55, this.W, this.H * 0.45);

	/* Road */
    gfx.fillStyle(0x1e2035, 1);
    gfx.fillPoints([
	    { x: this.W / 2 - 55, y: this.H * 0.55 },
	    { x: this.W / 2 + 55, y: this.H * 0.55 },
        { x: this.W, y: this.H },
        { x: 0, y: this.H },
    ], true);

    /* Center line */
    gfx.fillStyle(C.NIGHT.LANE_CENTER, 0.4);
    gfx.fillPoints([
	    { x: this.W / 2 - 3, y: this.H * 0.55 },
        { x: this.W / 2 + 3, y: this.H * 0.55 },
        { x: this.W / 2 + 18, y: this.H },
        { x: this.W / 2 - 18, y: this.H },
    ], true);

	/* Stars */
	for (let i = 0; i < 80; i++) {
		const x = Phaser.Math.Between(0, this.W);
		const y = Phaser.Math.Between(0, this.H * 0.5);
		const size = Math.random() < 0.2 ? 2 : 1;
		const alpha = Phaser.Math.FloatBetween(0.3, 1.0);
		gfx.fillStyle(0xffffff, alpha);
		gfx.fillRect(x, y, size, size);
	}

	/* Horizon */
	gfx.fillStyle(C.NIGHT.NEON_PINK, 0.07);
	gfx.fillRect(0, this.H * 0.52, this.W, 6);
	gfx.fillStyle(C.NIGHT.NEON_CYAN, 0.05);
	gfx.fillRect(0, this.H * 0.54, this.W, 4);

	this._drawSkyline(gfx);
}

    /* City Skyline */
    _drawSkyline(gfx) {
        const buidlings = [
            { x: 0,w: 60, h: 120 },
			{ x: 55, w: 45, h: 80  },
			{ x: 95, w: 70, h: 160 },
			{ x: 160, w: 40, h: 100 },
			{ x: 195, w: 55, h: 70  },
			{ x: 620, w: 55, h: 70  },
			{ x: 670, w: 40, h: 100 },
			{ x: 705, w: 70, h: 160 },
			{ x: 700, w: 45, h: 80  },
			{ x: 740, w: 60, h: 120 },
        ];

        const baseY = this.H * 0.55;

        buidlings.forEach(b => {
            gfx.fillStyle(0x12152a, 1);
            gfx.fillRect(b.x, baseY - b.h, b.w, b.h);

            /* Lit windows */
            for (let wy = baseY - b.h + 8; wy < baseY - 8; wy += 14) {
				for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += 12) {
					if (Math.random() < 0.45) {
						const col = Math.random() < 0.7
							? C.NIGHT.BUILDING_LIT
							: C.NIGHT.NEON_CYAN;
						gfx.fillStyle(col, 0.8);
						gfx.fillRect(wx, wy, 6, 6);
					}
				}
			}

            /* Neon Signs */
            if (Math.random() < 0.5) {
                const neons = [
                    C.NIGHT.NEON_PINK,
                    C.NIGHT.NEON_CYAN,
                    C.NIGHT.NEON_GREEN,
                ];
                const col = neons[Math.floor(Math.random() * neons.length)];
                gfx.fillStyle(col, 0.9);
                gfx.fillRect(b.x + 4, baseY - b.h - 10, b.w - 8, 8);
            }
        });
    }


    /* Pixel Art R32 */
    _drawCar() {
        const gfx = this.add.graphics();
        const P = C.PX;

        const ox = this.W / 2 - 15 * P;
        const oy = this.H - 210;

        const px = (col, row, w, h, color, alpha = 1) => {
            gfx.fillStyle(color, alpha);
            gfx.fillRect(ox + col * P, oy + row * P, w * P, h * P);
        };

        /* Body */
        px(2, 4, 26, 5, C.CAR.BODY);
		px(4, 2, 22, 4, C.CAR.BODY);
		px(6, 0, 18, 3, C.CAR.BODY_LIGHT);

		/* Roof */
		px(8, -3, 14, 4, C.CAR.BODY_DARK);

		/* Window */
		px(9, -2, 12, 3, C.CAR.WINDOW);
		px(10, -1, 4, 1, C.CAR.WINDOW_GLARE, 0.5);

		/* Bumper */
		px(3, 9, 24, 2, C.CAR.BUMPER);

		/* Brake lights */
		px(2, 5, 4, 3, C.CAR.BRAKE_LIGHT);
		px(24, 5, 4, 3, C.CAR.BRAKE_LIGHT);

        /* Wheels */
		px(1, 8, 6, 4, C.CAR.WHEEL);
		px(23, 8, 6, 4, C.CAR.WHEEL);
		px(2, 9, 4, 2, C.CAR.WHEEL_RIM);
		px(24, 9, 4, 2, C.CAR.WHEEL_RIM);

		/* Licence plate */
		px(11, 10, 8, 2, C.CAR.PLATE);
		px(12, 10, 6, 2, C.CAR.PLATE_TEXT, 0.4);

		/* Neon underglow for menu flair */
		gfx.fillStyle(C.NIGHT.NEON_CYAN, 0.18);
		gfx.fillRect(ox, oy + 12 * P, 30 * P, P * 2);
	}


    /* Title Text */
    _drawTitle() {
        this.add.text(this.W / 2 + 3, 53, 'SKYLINE DRIVE', {
            fontFamily: C.UI.FONT,
            fontSize: '42px',
            color: '#000000',
        }).setOrigin(0.5).setAlpha(0.6);

        this.add.text(this.W / 2, 50, 'SKYLINE DRIVE', {
            fontFamily: C.UI.FONT,
            fontSize: '42px',
            color: C.UI.TEXT_SCORE,
        }).setOrigin(0.5);

    }


    /* Buttons */
    _drawButtons() {
        this._makeButton(
            this.W / 2 - 130,
            this.H - 90,
            220,
            64,
            'DAY',
			'Mt. Fuji Backroads',
			C.DAY.SKY_TOP,
			'DayScene'
		);
        
        this._makeButton(
			this.W / 2 + 130,
			this.H - 90,
			220,
			64,
			'NIGHT',
			'Tokyo City Traffic',
			C.NIGHT.NEON_CYAN,
			'NightScene'
		);
    }


    _makeButton(cx, cy, w, h, label, sublabel, accentColor, sceneKey) {
        const gfx = this.add.graphics();

        /* Button Background */
        gfx.fillStyle(C.UI.PANEL_BG, 0.75);
        gfx.fillRect(cx - w / 2, cy - h / 2, w, h);

        /* Accent Border */
        gfx.lineStyle(2, accentColor, 1);
        gfx.strokeRect(cx - w / 2, cy - h / 2, w, h);

        /* Main */
        const txt = this.add.text(cx, cy - 10, label, {
            fontFamily: C.UI.FONT,
            fontSize: '22px',
            color: C.UI.TEXT_MAIN,
        }).setOrigin(0.5);

        /* Sub */
		this.add.text(cx, cy + 16, sublabel, {
			fontFamily: C.UI.FONT,
			fontSize:   '11px',
			color:      C.UI.TEXT_DIM,
		}).setOrigin(0.5);

        const zone = this.add.zone(cx, cy, w, h).setInteractive();

        /* Hover effect */
		zone.on('pointerover', () => {
			gfx.clear();
			gfx.fillStyle(accentColor, 0.15);
			gfx.fillRect(cx - w / 2, cy - h / 2, w, h);
			gfx.lineStyle(2, accentColor, 1);
			gfx.strokeRect(cx - w / 2, cy - h / 2, w, h);
			txt.setColor('#ffffff');
		});

		zone.on('pointerout', () => {
			gfx.clear();
			gfx.fillStyle(0x000000, 0.75);
			gfx.fillRect(cx - w / 2, cy - h / 2, w, h);
			gfx.lineStyle(2, accentColor, 1);
			gfx.strokeRect(cx - w / 2, cy - h / 2, w, h);
			txt.setColor(C.UI.TEXT_MAIN);
		});

        /* Click to start scene */
        zone.on('pointerdown', () => {
            this.scene.start(sceneKey);
        });
    }


    /* Footer */
    _drawFooter() {
        this.add.rectangle(this.W / 2, this.H - 14, 320, 22, 0x000000, 0.6)
            .setDepth(10);

        this.add.text(this.W / 2, this.H - 14, 'WASD or ARROW KEYS to drive', {
            fontFamily: C.UI.FONT,
            fontSize:   '12px',
            color:      '#aaaaaa',
        }).setOrigin(0.5).setDepth(11);
    }
}
