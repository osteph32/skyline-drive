/*
NightScene.js
Tokyo city night
level with traffic.
*/

class NightScene extends Phaser.Scene {

	constructor() {
		super({ key: 'NightScene' });
	}

	create() {
		this.W = C.WIDTH;
		this.H = C.HEIGHT;

		/* State */
		this.distance = 0;
		this.colliding = false;
		this.penaltyTimer = 0;

        /* Scene Objects */
		this.bg = new NightBackground(this);
		this.road = new Road(this, C.NIGHT);
		this.road.gfx.setDepth(3);
		this.player = new PlayerCar(this);
		this.traffic = new TrafficCar(this, this.road);

		/* Traffic Spawn Timer */
		this.spawnTimer = this.time.addEvent({
			delay: C.TRAFFIC_SPAWN_INTERVAL,
			callback: () => { if (this.traffic) this._spawnTraffic(); },
			callbackScope: this,
			loop: true,
		});

		this.time.delayedCall(200,  () => { if (this.traffic) this.traffic.spawn(); });
		this.time.delayedCall(600,  () => { if (this.traffic) this.traffic.spawn(); });
		this.time.delayedCall(1000, () => { if (this.traffic) this.traffic.spawn(); });
		this.time.delayedCall(1400, () => { if (this.traffic) this.traffic.spawn(); });

		this._buildHUD();
		this._buildBackButton();
	}

	/* Spawn Traffic */
	_spawnTraffic() {
		this.traffic.spawn();
		if (Math.random() < 0.3) {
			this.time.delayedCall(
				Phaser.Math.Between(300, 600),
				() => this.traffic.spawn()
			);
		}
	}

	/* HUD */
	_buildHUD() {
		const style = {
			fontFamily: C.UI.FONT,
			fontSize: '13px',
			color: C.UI.TEXT_MAIN,
		};

		this.hudPanel = this.add.rectangle(
			C.WIDTH - 110, 14, 200, 52, 0x000000, 0.55
		).setDepth(10).setOrigin(0.5, 0);

		this.speedText = this.add.text(
			C.WIDTH - 18, 18,
			'SPEED  000 km/h',
			{ ...style, color: C.UI.TEXT_SCORE }
		).setOrigin(1, 0).setDepth(10);

		this.distText = this.add.text(
			C.WIDTH - 18, 36,
			'DIST   0.0 km',
			{ ...style, color: C.UI.TEXT_DIM }
		).setOrigin(1, 0).setDepth(10);

		/* Warning Text for Collision */
		this.warnText = this.add.text(
			C.WIDTH / 2, 60,
			'!! COLLISION !!',
			{
				fontFamily: C.UI.FONT,
				fontSize: '20px',
				color: C.UI.TEXT_WARN,
			}
		).setOrigin(0.5).setDepth(10).setAlpha(0);

	}

	/* Back Button */
	_buildBackButton() {
		const gfx = this.add.graphics().setDepth(10);
		const bx = 38;
		const by = 26;
		const bw = 70;
		const bh = 22;

		const drawNormal = () => {
			gfx.clear();
			gfx.fillStyle(0x000000, 0.6);
			gfx.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
			gfx.lineStyle(1, C.NIGHT.NEON_CYAN, 0.7);
			gfx.strokeRect(bx - bw / 2, by - bh / 2, bw, bh);
		};

		const drawHover = () => {
			gfx.clear();
			gfx.fillStyle(C.NIGHT.NEON_CYAN, 0.15);
			gfx.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
			gfx.lineStyle(1, C.NIGHT.NEON_CYAN, 1);
			gfx.strokeRect(bx - bw / 2, by - bh / 2, bw, bh);
		};

		drawNormal();

		this.add.text(bx, by, '← MENU', {
			fontFamily: C.UI.FONT,
			fontSize: '11px',
			color: C.UI.TEXT_DIM,
		}).setOrigin(0.5).setDepth(10);

		const zone = this.add.zone(bx, by, bw, bh)
			.setInteractive()
			.setDepth(11);

		zone.on('pointerover', drawHover);
		zone.on('pointerout', drawNormal);
		zone.on('pointerdown', () => {
			this.traffic.reset();
			this.spawnTimer.remove();
			this.scene.start('MenuScene');
		});
	}

	/* Collision Response */
	_handleCollision() {
		if (this.colliding) return;
		this.colliding = true;
		this.penaltyTimer = 90;

		this.player.flash();

		this.cameras.main.shake(220, 0.012);

		this.warnText.setAlpha(1);
		this.tweens.add({
			targets: this.warnText,
			alpha: 0,
			delay: 600,
			duration: 400,
			ease: 'Sine.easeIn',
		});
	}

	/* Update */
	update() {
		const speed = this.player.getSpeed();

		let effectiveSpeed = speed;
		if (this.penaltyTimer > 0) {
			this.penaltyTimer--;
			effectiveSpeed = Math.max(speed * 0.4, 3);
			if (this.penaltyTimer === 0) {
				this.colliding = false;
			}
		}

		this.bg.update(effectiveSpeed);
		this.road.update(effectiveSpeed);
		this.player.update();

		const hit = this.traffic.update(
			effectiveSpeed,
			this.player.getX(),
			this.player.getY()
		);

		if (hit) this._handleCollision();

		this.distance += effectiveSpeed * 0.001;

		/* Update HUD */
		const kmh = Math.round(effectiveSpeed * 18);
		this.speedText.setText(
			'SPEED  ' + String(kmh).padStart(3, '0') + ' km/h'
		);
		this.distText.setText(
			'DIST   ' + this.distance.toFixed(1) + ' km'
		);
	}
}