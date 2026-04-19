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

        this._buildKeys();
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
	const goLeft = this.keys.left.isDown || this.keys.a.isDown;
	const goRight = this.keys.right.isDown || this.keys.d.isDown;
	const accelerate = this.keys.up.isDown || this.keys.w.isDown;
	const brake = this.keys.down.isDown || this.keys.s.isDown;

	/* Steering */
	if (goLeft) {
		this.velX = Math.max(this.velX - 1.2, -C.PLAYER_SPEED);
	} else if (goRight) {
		this.velX = Math.min(this.velX + 1.2, C.PLAYER_SPEED);
	} else {
		this.velX *= 0.78;
	}

	/* Speed control */
	if (accelerate) {
		this.speed = Math.min(
			this.speed + C.ACCEL_RATE,
			C.MAX_SCROLL_SPEED
		);
	} else if (brake) {
		this.speed = Math.max(
			this.speed - C.DECEL_RATE,
			2
		);
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
	const ox = this.x - 18 * P;
	const oy = this.y - 14 * P;

	const px = (col, row, w, h, color, alpha = 1) => {
		gfx.fillStyle(color, alpha);
		gfx.fillRect(ox + col * P, oy + row * P, w * P, h * P);
	};

	/* Rear Wing */
	px(2, 0, 32, 2, C.CAR.BODY_DARK);
	px(3, 0, 30, 1, 0x2e3236);

	/* Roof */
	px(4, 2, 28, 4, C.CAR.WINDOW);
	px(5, 2, 26, 1, C.CAR.WINDOW_GLARE, 0.25);
	px(4, 2, 2, 4, C.CAR.BODY_DARK);
	px(30, 2, 2, 4, C.CAR.BODY_DARK);

	/* Trunk */
	px(2, 6, 32, 3, C.CAR.BODY);
	px(3, 6, 30, 1, C.CAR.BODY_LIGHT);

	/* Upper body crease */
	px(1, 9, 34, 2, C.CAR.BODY);
	px(2, 9, 32, 1, C.CAR.BODY_LIGHT);

	/* Tail Light Panel */
	px(0, 11, 36, 5, C.CAR.BODY_DARK);

	/* Left Tail Light */
	px(1, 11, 5, 5, C.CAR.BRAKE_LIGHT);
	px(2, 12, 3, 3, 0xff6600);

	px(6, 11, 1,  5, C.CAR.BODY_DARK);

	px(7, 11, 5, 5, C.CAR.BRAKE_LIGHT);
	px(8, 12, 3, 3, 0xff6600);

	px(12, 11, 2, 5, C.CAR.BODY_DARK);

	/* Right Tail Light */
	px(22, 11, 5, 5, C.CAR.BRAKE_LIGHT);
	px(23, 12, 3, 3, 0xff6600);

	px(27, 11, 2, 5, C.CAR.BODY_DARK);

	px(29, 11, 5, 5, C.CAR.BRAKE_LIGHT);
	px(30, 12, 3, 3, 0xff6600);

	px(34, 11, 1, 5, C.CAR.BODY_DARK);

	/* Center Panel */
	px(14, 11, 8, 5, C.CAR.BODY_DARK);

	/* Brake Light Glow */
	if (this.isBraking) {
		this.gfxGlow.fillStyle(0xff2200, 0.2);
		this.gfxGlow.fillRect(ox, oy + 10 * P, 36 * P, 8 * P);
		px(1, 11, 5, 5, 0xff4400);
		px(7, 11, 5, 5, 0xff4400);
		px(22, 11, 5, 5, 0xff4400);
		px(29, 11, 5, 5, 0xff4400);
	}

	/* Lower Bumper */
	px(0, 16, 36, 3, C.CAR.BUMPER);
	px(1, 16, 34, 1, 0x3a3e42);

	/* Bumper Lip */
	px(2, 18, 32, 2, 0x222628);

	/* Exhaust */
	px(6, 19, 4, 1, 0x1a1a1a);
	px(7, 19, 2, 1, 0x444444);
	px(26, 19, 4, 1, 0x1a1a1a);
	px(27, 19, 2, 1, 0x444444);

	/* License Plate */
	px(14, 17, 8, 2, C.CAR.PLATE);
	px(15, 17, 6, 2, C.CAR.PLATE_TEXT, 0.45);

	/* Wheel Arches */
	px(0, 13, 2, 6, C.CAR.BODY_DARK);
	px(34, 13, 2, 6, C.CAR.BODY_DARK);

	/* Wheels */
	px(-2, 14, 6, 6, C.CAR.WHEEL);
	px(32, 14, 6, 6, C.CAR.WHEEL);

	/* Rims */
	px(-1, 15, 4, 4, C.CAR.WHEEL_RIM);
	px(33, 15, 4, 4, C.CAR.WHEEL_RIM);
	px(0, 14, 2, 1, C.CAR.WHEEL_RIM);
	px(34, 14, 2, 1, C.CAR.WHEEL_RIM);
	px(0, 19, 2, 1, C.CAR.WHEEL_RIM);
	px(34, 19, 2, 1, C.CAR.WHEEL_RIM);

	/* Shadow */
	gfx.fillStyle(0x000000, 0.25);
	gfx.fillEllipse(this.x, this.y + 7 * P, 42 * P, 5 * P);

	/* Steering Lean */
	if (this.velX < -1) {
		px(1, 9, 5, 2, C.CAR.BODY_LIGHT, 0.4);
	} else if (this.velX > 1) {
		px(30, 9, 5, 2, C.CAR.BODY_LIGHT, 0.4);
	}
}

    /* Getters For Scene Use */
	getX() { return this.x; }
	getY() { return this.y; }
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