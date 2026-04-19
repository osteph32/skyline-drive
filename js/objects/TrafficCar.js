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
        this.car = [];
        this.gfx = scene.add.graphics().setDepth(4);


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
		console.log('spawn called, cars before:', this.cars.length);
        const isOncoming = Math.random() < 0.45;
        const lane = isOncoming
            ? Phaser.Math.Between(0, 1) /* Left 2 Lanes */
            : Phaser.Math.Between(2, 3); /* Right 2 Lanes */

        const palette = Phaser.Utils.Array.GetRandom(this.palettes);
        const speed = isOncoming
            ? Phaser.Math.Between(C.TRAFFIC_MIN_SPEED, C.TRAFFIC_MAX_SPEED) * -1
            : Phaser.Math.Between(C.TRAFFIC_MIN_SPEED * 0.4, C.TRAFFIC_MAX_SPEED * 0.5);

        const startT = isOncoming ? 0.05 : 1.05;

        this.car.push({
            lane,
            t: startT,
            speed: speed,
            isOncoming,
            palette,
            hit: false
        });
		console.log('cars after spawn:', this.cars.length, this.cars);
    }


    /* Call Every Frame */
    update(playerScrollSpeed, playerX, playerY) {
		if (!Array.isArray(this.cars)) this.cars = [];
		console.log('update: car count:', this.cars.length);
		this.gfx.clear();

		for (let i = this.cars.length - 1; i >= 0; i--) {
			const c = this.cars[i];

			if (c.isOncoming) {
				c.t += 0.012 + playerScrollSpeed * 0.001;
			} else {
				c.t += (c.speed - playerScrollSpeed) * 0.001;
			}

			if (c.t > 1.3 || c.t < -0.05) {
				this.cars.splice(i, 1);
				continue;
			}

			this._drawCar(c);
		}

	return this._checkCollision(playerX, playerY);
}


    /* Draw One Traffic Car */
    _drawCar(car) {
        const gfx = this.gfx;
        const t = Phaser.Math.Clamp(car.t, 0, 1);

        const screenY = this.road._perspY(t);
        const laneW = C.ROAD_BOTTOM_W / C.ROAD_LANES;
        const laneX = (C.WIDTH / 2 - C.ROAD_BOTTOM_W / 2) + (car.lane + 0.5) * laneW;

        const scale = Phaser.Math.Linear(0.15, 1.0, t);
        const P = C.PX * scale;
        const col = car.palette;

        const ox = laneX - 12 * P;
        const oy = screenY - 10 * P;

        const px = (c, r, w, h, color, alpha = 1) => {
            gfx.fillStyle(color, alpha);
			gfx.fillRect(ox + c * P, oy + r * P, w * P, h * P);
		};

        
        if (car.isOncoming) {

            /* Oncoming Car Front View */
			/* Hood */
			px(2, 5, 20, 4,  ol.body);
			px(3, 5, 18, 2, col.light, 0.4);

			/* Windshield */
			px(4, 2, 16, 4, C.CAR.WINDOW);
			px(5, 2, 5, 1, C.CAR.WINDOW_GLARE, 0.35);

			/* Roof */
			px(5, 0, 14, 3, col.dark);

			/* Headlights */
			px(2,  5, 4, 3, 0xffffcc);
			px(18, 5, 4, 3, 0xffffcc);

			/* Headlight Glow */
			gfx.fillStyle(0xffffaa, 0.18);
			gfx.fillEllipse(ox + 4 * P, oy + 6 * P, 14 * P, 10 * P);
			gfx.fillEllipse(ox + 20 * P, oy + 6 * P, 14 * P, 10 * P);

			/* Grille */
			px(7, 8, 10, 2, col.dark);
			px(8, 8, 8, 1, 0x333333);

			/* Bumper */
			px(2, 9, 20, 2, col.dark);

			/* Wheels */
			px(0, 7, 4, 4, C.CAR.WHEEL);
			px(20, 7, 4, 4, C.CAR.WHEEL);
			px(1, 8, 2, 2, C.CAR.WHEEL_RIM);
			px(21, 8, 2, 2, C.CAR.WHEEL_RIM);

		} else {

            /* Same Direction Car Rear View */
			/* Roof */
			px(5, 0, 14, 3, col.dark);

			/* Rear Window */
			px(5, 2, 14, 3, C.CAR.WINDOW);
			px(6, 2, 4, 1, C.CAR.WINDOW_GLARE, 0.3);

			/* Upper Body */
			px(3, 5, 18, 3, col.body);
			px(4, 5, 16, 1, col.light, 0.35);

			/* Trunk */
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

		/* Screen Bounds for Collision */
		car.screenX = ox;
		car.screenY = oy;
		car.screenW = 24 * P;
		car.screenH = 14 * P;
	}

	/* Collision Detection */
	_checkCollision(playerX, playerY) {
	if (!Array.isArray(this.cars) || this.cars.length === 0) return false;

	const pW = 28 * C.PX;
	const pH = 16 * C.PX;
	const pL = playerX - pW / 2;
	const pR = playerX + pW / 2;
	const pT = playerY - pH;
	const pB = playerY + pH * 0.5;

	const shrink = C.PX * 3;

	for (const car of this.cars) {
		if (!car.screenW) continue;
		if (car.hit)      continue;
		if (car.t < 0.75) continue;

		const cL = car.screenX + shrink;
		const cR = car.screenX + car.screenW - shrink;
		const cT = car.screenY + shrink;
		const cB = car.screenY + car.screenH - shrink;

		if (pL < cR && pR > cL && pT < cB && pB > cT) {
			car.hit = true;
			return true;
		}
	}

	return false;
}

	/* Clear All Cars */
	reset() {
		this.cars = [];
		this.gfx.clear();
	}
}