/*
PlayerCar.js
Draws the player's car (Nissan Skyline R32 GTR)
and movement isd handled here as well.
*/

class PlayerCar {

    constructor(scene) {
        this.scene = scene;
        this.x = C.WIDTH / 2;
        this.y = C.PLAYER_Y;
        this.velX = 0;
        this.speed = C.BASE_SCROLL_SPEED;
        this.isBraking = false;

        this.gfx = scene.add.graphics().setDepth(5);
        this.gfxGlow = scene.add.graphics().setDepth(4);

        this.buildKeys();
    }

    /* Input Setup */
    _buildKeys() {
        const kb = this.scene.input.keyboard;
        this.keys = { 
            left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            a: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            d: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            w: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            s: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        };
    }

    /* Update Car Position (Every Frame) */
    update() {
        this._handleInput();
        this._applyMovement();
        this._draw();
     }

    /* Handle Player Input */
    _handleInput() {
        const k = this.keys;
        const goLeft = k.left.isDown || k.a.isDown;
        const goRight = k.right.isDown || k.d.isDown;
        const goUp = k.up.isDown || k.w.isDown;
        const goDown = k.down.isDown || k.s.isDown;

        if (goLeft) {
            this.velX = Math.max(this.velX - 1.2, -C.PLAYER_SPEED);
        } else if (goRight) {
            this.velX = Math.max(this.velX + 1.2, -C.PLAYER_SPEED);
        } else {
            this.velX *= 0.78;
        }

        /* Speed Control */
        if (accelerate) {
            this.speed = Math.min(this.speed + C.ACCEL_RATE, C.MAX_SCROLL_SPEED);
        } else if (brake) {
            this.speed = Math.max(this.speed - C.DECEL_RATE, 2);
        } else {
            if (this.speed < C.BASE_SCROLL_SPEED) {
				this.speed += 0.1;
			} else if (this.speed > C.BASE_SCROLL_SPEED) {
				this.speed -= 0.15;
			}
        }

        this.isBraking = brake;
    }

    /* Apply Movement*/
    _applyMovement() {
        this.x += this.velX;
        this.x = Phaser.Math.Clamp(this.x, C.PLAYER_MIN_X, C.PLAYER_MAX_X);
    }

    /* Draw Car */
    _draw() {
        this.gfx.clear();
        this.gfxGlow.clear();

        const P = C.PX;
        const gfx = this.gfx;

        const ox = this.x - (15 * P);
        const oy = this.y - (12 * P);

        const px = (col, row, w, h, color, alpha = 1) => {
            gfx.fillStyle(color, alpha);
            gfx.fillRect(ox + col * P, oy + row * P, w * P, h * P);
        };

        /* Roof */
        px(5,  0,  20, 2,  C.CAR.BODY_DARK);
		px(6,  0,  18, 1,  C.CAR.BODY);

		/* Rear Window */
		px(6,  2,  18, 3,  C.CAR.WINDOW);
		px(7,  2,  6,  1,  C.CAR.WINDOW_GLARE, 0.4);
		px(17, 2,  4,  1,  C.CAR.WINDOW_GLARE, 0.3);

		/* C Pillars */
		px(5,  2,  2,  3,  C.CAR.BODY_DARK);
		px(23, 2,  2,  3,  C.CAR.BODY_DARK);

		/* Upper Body */
		px(3,  5,  24, 3,  C.CAR.BODY);
		px(4,  5,  22, 2,  C.CAR.BODY_LIGHT);

		/* Trunk Lid */
		px(4,  7,  22, 2,  C.CAR.BODY);
		px(5,  7,  20, 1,  C.CAR.BODY_LIGHT);

		/* Rear Tail Panel */
		px(2,  9,  26, 3,  C.CAR.BODY_DARK);

        /* Left Tail Lights */
		px(2,  9,  4,  3,  C.CAR.BRAKE_LIGHT);
		px(6,  9,  3,  3,  C.CAR.BODY_DARK);
		px(9,  9,  2,  3,  C.CAR.BRAKE_LIGHT);
		
        /* Right Tail Lights */
		px(19, 9,  2,  3,  C.CAR.BRAKE_LIGHT);
		px(21, 9,  3,  3,  C.CAR.BODY_DARK);
		px(24, 9,  4,  3,  C.CAR.BRAKE_LIGHT);

        /* Brake Light Glow Durimg Braking */
		if (this.isBraking) {
			this.gfxGlow.fillStyle(0xff2200, 0.18);
			this.gfxGlow.fillRect(ox - P * 2, oy + 8 * P, 34 * P, 8 * P);

			/* Brighter */
			gfx.fillStyle(0xff6600, 1);
			px(2,  9,  4,  3,  0xff4400);
			px(9,  9,  2,  3,  0xff4400);
			px(19, 9,  2,  3,  0xff4400);
			px(24, 9,  4,  3,  0xff4400);
		}

		/* Lower Bumper */
		px(3,  12, 24, 2,  C.CAR.BUMPER);
		px(4,  12, 22, 1,  0x3a3e42);

		/* Exhaust Tip */
		px(8,  13, 3,  1,  0x2a2e30);
		px(19, 13, 3,  1,  0x2a2e30);

        /* Licence Plate */
		px(11, 12, 8,  2,  C.CAR.PLATE);
		px(12, 13, 6,  1,  C.CAR.PLATE_TEXT, 0.5);

		/* Wheel Arches */
		px(0,  10, 7,  4,  C.CAR.BODY_DARK);
		px(23, 10, 7,  4,  C.CAR.BODY_DARK);

		/* Wheels */
		px(0,  11, 7,  4,  C.CAR.WHEEL);
		px(23, 11, 7,  4,  C.CAR.WHEEL);

		/* Rims */
		px(1,  12, 5,  2,  C.CAR.WHEEL_RIM);
		px(24, 12, 5,  2,  C.CAR.WHEEL_RIM);
		px(2,  11, 3,  1,  C.CAR.WHEEL_RIM);
		px(25, 11, 3,  1,  C.CAR.WHEEL_RIM);
		px(2,  14, 3,  1,  C.CAR.WHEEL_RIM);
		px(25, 14, 3,  1,  C.CAR.WHEEL_RIM);

        /* Body Shadow */
		gfx.fillStyle(0x000000, 0.22);
		gfx.fillEllipse(this.x, this.y + 6 * P, 28 * P, 4 * P);

        /* Steering Lean */
        if (this.velX < -1) {
			px(3, 5, 4, 2, C.CAR.BODY_LIGHT, 0.5);
		} else if (this.velX > 1) {
			px(23, 5, 4, 2, C.CAR.BODY_LIGHT, 0.5);
		}
    }

    /* Getters For Scene Use */
	getX()     { return this.x; }
	getY()     { return this.y; }
	getSpeed() { return this.speed; }

	/* Flash On Collision */
	flash() {
		let count = 0;
		const timer = this.scene.time.addEvent({
			delay: 80,
			callback: () => {
				this.gfx.setAlpha(this.gfx.alpha === 1 ? 0.2 : 1);
				count++;
				if (count >= 8) {
					this.gfx.setAlpha(1);
					timer.remove();
				}
			},
			loop: true,
		});
	}
}