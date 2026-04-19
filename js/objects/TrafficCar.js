/*
TrafficCar.js
NPC traffic cars for the night scene.
Oncoming cars stay in left 2 lanes and
slower same-direction traffic stays in
right 2 lanes. 
*/

class TrafficCar {

    constructor(scene, road) {
        this.scene = scene;
        this.road = road;
		this.gfx = scene.add.graphics().setDepth(4);
        this.carList = [];


        /* NPC Car Colors */
        this.palettes = [
            { body: 0xcc2200, dark: 0x881100, light: 0xee4422 }, /* Red */
		    { body: 0x1144cc, dark: 0x0a2a88, light: 0x2266ee }, /* Blue */
		    { body: 0xdddddd, dark: 0x999999, light: 0xffffff }, /* White */
		    { body: 0x222222, dark: 0x111111, light: 0x444444 }, /* Black */
			{ body: 0xcc8800, dark: 0x885500, light: 0xeeaa22 }, /* Yellow */
			{ body: 0x226622, dark: 0x114411, light: 0x338833 }, /* Green */
		];
    }


    /* Spawn a New Car */
    spawn() {
        const isOncoming = Math.random() < 0.45;
        const lane = isOncoming
            ? Phaser.Math.Between(0, 1) /* Left 2 Lanes */
            : Phaser.Math.Between(2, 3); /* Right 2 Lanes */

        const palette = this.palettes[
			Phaser.Math.Between(0, this.palettes.length - 1)
		];

        const speed = isOncoming
			? Phaser.Math.FloatBetween(C.TRAFFIC_MIN_SPEED, C.TRAFFIC_MAX_SPEED) * -1
			: Phaser.Math.FloatBetween(C.TRAFFIC_MIN_SPEED * 0.4, C.TRAFFIC_MAX_SPEED * 0.5);

        const startT = isOncoming ? 0.05 : 1.05;

        const entry = {
            lane,
            t: startT,
            speed: speed,
            isOncoming,
            palette,
            hit: false,
			screenX:    0,
			screenY:    0,
			screenW:    0,
			screenH:    0,
        };
		
		this.carList.push(entry);
    }


    /* Call Every Frame */
    update(playerScrollSpeed, playerX, playerY) {
		this.gfx.clear();

		for (let i = this.carList.length - 1; i >= 0; i--) {
			const c = this.carList[i];

			if (c.isOncoming) {
				c.t += 0.012 + playerScrollSpeed * 0.001;
			} else {
				c.t += (c.speed - playerScrollSpeed) * 0.001;
			}

			if (c.t > 1.35 || c.t < -0.1) {
				this.carList.splice(i, 1);
				continue;
			}

			if (c.t > 0 && c.t <= 1.0) {
				this._drawCar(c);
			}
		}

	return this._checkCollision(playerX, playerY);
}


    /* Draw One Traffic Car */
    _drawCar(c) {
		const gfx   = this.gfx;
		const t     = Phaser.Math.Clamp(c.t, 0, 1);
		const scale = Phaser.Math.Linear(0.15, 1.0, t);
		const P     = C.PX * scale;
		const col   = c.palette;

		const laneW = C.ROAD_BOTTOM_W / C.ROAD_LANES;
		const laneX = (C.WIDTH / 2 - C.ROAD_BOTTOM_W / 2)
		            + (c.lane + 0.5) * laneW;

		/* Perspective shift — lanes converge at center horizon */
		const perspX = Phaser.Math.Linear(C.WIDTH / 2, laneX, t);
		const screenY = this.road._perspY(t);

		const ox = perspX - 12 * P;
		const oy = screenY - 10 * P;

		const px = (col, row, w, h, color, alpha = 1) => {
			gfx.fillStyle(color, alpha);
			gfx.fillRect(ox + col * P, oy + row * P, w * P, h * P);
		};

		if (c.isOncoming) {
			
			/* Front view */
			px(2, 5, 20, 4, col.body);
			px(3, 5, 18, 2, col.light, 0.4);
			px(4, 2, 16, 4, C.CAR.WINDOW);
			px(5, 0, 14, 3, col.dark);
			
			/* Headlights */
			px(2, 5, 4, 3, 0xffffcc);
			px(18, 5, 4, 3, 0xffffcc);
			gfx.fillStyle(0xffffaa, 0.15);
			gfx.fillEllipse(ox + 4 * P,  oy + 6 * P, 14 * P, 10 * P);
			gfx.fillEllipse(ox + 20 * P, oy + 6 * P, 14 * P, 10 * P);
			
			/* Bumper */
			px(7, 8, 10, 2, col.dark);
			px(2, 9, 20, 2, col.dark);
			
			/* Wheels */
			px(0, 7, 4, 4, C.CAR.WHEEL);
			px(20, 7, 4, 4, C.CAR.WHEEL);
			px(1, 8, 2, 2, C.CAR.WHEEL_RIM);
			px(21, 8, 2, 2, C.CAR.WHEEL_RIM);
		
		} else {
			
			/* Rear View */
			px(5, 0, 14, 3, col.dark);
			px(5, 2, 14, 3, C.CAR.WINDOW);
			px(3, 5, 18, 3, col.body);
			px(4, 5, 16, 1, col.light, 0.35);
			px(3, 7, 18, 2, col.body);
			
			/* Tail Lights */
			px(2, 8, 4, 3, 0xff2200);
			px(18, 8, 4, 3, 0xff2200);
			
			/* Bumper */
			px(3, 11, 18, 2, col.dark);
			
			/* Wheels */
			px(0, 8, 4, 4, C.CAR.WHEEL);
			px(20, 8, 4, 4, C.CAR.WHEEL);
			px(1, 9, 2, 2, C.CAR.WHEEL_RIM);
			px(21, 9, 2, 2, C.CAR.WHEEL_RIM);
		}

		/* Sscreen Bounds for Collision */
		c.screenX = ox;
		c.screenY = oy;
		c.screenW = 24 * P;
		c.screenH = 14 * P;
	}

	/* Collision Detection */
	_checkCollision(playerX, playerY) {
		if (this.carList.length === 0) return false;

		const pW = 28 * C.PX;
		const pH = 16 * C.PX;
		const pL = playerX - pW / 2;
		const pR = playerX + pW / 2;
		const pT = playerY - pH;
		const pB = playerY + pH * 0.5;
		const shrink = C.PX * 3;

		for (const c of this.carList) {
			if (c.hit || c.screenW === 0 || c.t < 0.75) continue;

			const cL = c.screenX + shrink;
			const cR = c.screenX + c.screenW - shrink;
			const cT = c.screenY + shrink;
			const cB = c.screenY + c.screenH - shrink;

			if (pL < cR && pR > cL && pT < cB && pB > cT) {
				c.hit = true;
				return true;
			}
		}

		return false;
	}

	/* Clear All Cars */
	reset() {
		this.carList = [];
		this.gfx.clear();
	}
}