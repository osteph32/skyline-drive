/*
DayScene.js
The Mt. Fuji backroads
level with no traffic.
*/

class DayScene extends Phaser.Scene {

	constructor() {
		super({ key: 'DayScene' });
	}

	create() {
		this.W = C.WIDTH;
		this.H = C.HEIGHT;

		this.distance = 0;
		this.isGameOver = false;

		this.bg = new DayBackground(this);
		this.road = new Road(this, C.DAY);
		this.road.gfx.setDepth(3);
		this.player = new PlayerCar(this);

		this._buildHUD();
		this._buildBackButton();
	}


	/* HUD */
	_buildHUD() {
		const style = {
			fontFamily: C.UI.FONT,
			fontSize: '15px',
			color: C.UI.TEXT_MAIN,
		};

		this.hudPanel = this.add.rectangle(
			C.WIDTH - 110, 14, 200, 36, 0x000000, 0.5
		).setDepth(10).setOrigin(0.5, 0);

		this.speedText = this.add.text(
			C.WIDTH - 18, 18,
			'SPEED  000 km/h',
			{ ...style, fontSize: '13px', color: C.UI.TEXT_SCORE }
		).setOrigin(1, 0).setDepth(10);

		this.distText = this.add.text(
			C.WIDTH - 18, 36,
			'DIST   0.0 km',
			{ ...style, fontSize: '13px', color: C.UI.TEXT_DIM }
		).setOrigin(1, 0).setDepth(10);

	}

	/* Back Button */
	_buildBackButton() {
		const gfx = this.add.graphics().setDepth(10);
		const bx = 38;
		const by = 26;
		const bw = 70;
		const bh = 22;

		gfx.fillStyle(0x000000, 0.6);
		gfx.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
		gfx.lineStyle(1, C.DAY.SKY_TOP, 0.7);
		gfx.strokeRect(bx - bw / 2, by - bh / 2, bw, bh);

		this.add.text(bx, by, '← MENU', {
			fontFamily: C.UI.FONT,
			fontSize: '11px',
			color: C.UI.TEXT_DIM,
		}).setOrigin(0.5).setDepth(10);

		const zone = this.add.zone(bx, by, bw, bh)
			.setInteractive()
			.setDepth(11);

		zone.on('pointerover', () => {
			gfx.clear();
			gfx.fillStyle(C.DAY.SKY_TOP, 0.2);
			gfx.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
			gfx.lineStyle(1, C.DAY.SKY_TOP, 1);
			gfx.strokeRect(bx - bw / 2, by - bh / 2, bw, bh);
		});

		zone.on('pointerout', () => {
			gfx.clear();
			gfx.fillStyle(0x000000, 0.6);
			gfx.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
			gfx.lineStyle(1, C.DAY.SKY_TOP, 0.7);
			gfx.strokeRect(bx - bw / 2, by - bh / 2, bw, bh);
		});

		zone.on('pointerdown', () => {
			this.scene.start('MenuScene');
		});
	}

	/* Update */
	update() {
		if (this.isGameOver) return;

		const speed = this.player.getSpeed();

		this.bg.update(speed);
		this.road.update(speed);
		this.player.update();
        
		this.distance += speed * 0.001;

		/* Update HUD */
		const kmh = Math.round(speed * 18);
		this.speedText.setText('SPEED  ' + String(kmh).padStart(3, '0') + ' km/h');
		this.distText.setText( 'DIST   ' + this.distance.toFixed(1) + ' km');
	}
}