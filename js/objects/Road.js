/*
Road.js
Draws and animates the road.
Uses perspective projection to create
the vanishing point effect. 
4 lanes: 2 player side, 2 oncoming, 
with a yellow center divider.
*/

class Road {
    
    constructor(scene, palette) {
        this.scene = scene;
        this.palette = palette;
        this.gfx = scene.add.graphics().setDepth(1);
        this.offset = 0;
        this.segments = 60;
    }

    /* Update Road Position (Every Frame) */
    update(scrollSpeed) {
        this.offset = (this.offset + scrollSpeed) % 80;
        this._draw();
    }

    /* Draw Road */
    _draw() {
        this.gfx.clear();
        this._drawRoadSurface();
        this._drawCenterDividers();
        this._drawLaneDashes();
        this._drawRoadEdges();
    }

    /* Road Surface */
    _drawRoadSurface() {
        const gfx = this.gfx;

        /* Alternate dark/light strips for depth illusion */
		for (let i = 0; i < this.segments; i++) {
			const t1 = i / this.segments;
			const t2 = (i + 1) / this.segments;

			const y1 = this._perspY(t1);
			const y2 = this._perspY(t2);
			const x1L = this._perspXLeft(t1);
			const x1R = this._perspXRight(t1);
			const x2L = this._perspXLeft(t2);
			const x2R = this._perspXRight(t2);

            /* Alternate strip colors for the scrolling effect */
			const stripeIndex = Math.floor(
				(i + Math.floor(this.offset / (80 / this.segments))) % 2
			);
			const col = stripeIndex === 0
				? this.palette.ROAD
				: this.palette.ROAD_DARK;

			gfx.fillStyle(col, 1);
			gfx.fillPoints([
				{ x: x1L, y: y1 },
				{ x: x1R, y: y1 },
				{ x: x2R, y: y2 },
				{ x: x2L, y: y2 },
			], true);
		}
	}

    /* Center Yellow Dividers */
    _drawCenterDividers() {
        const gfx = this.gfx;
        const dashes = 16;
        const dashLen = 80;

        for (let i = 0; i < dashes; i++) {
            const t1 = i / dashes;
            const t2 = (i + 0.4) / dashes;

            /* Animate scroll */
			const scrollT = (this.offset / 80) / dashes;
			const st1 = (t1 + scrollT) % 1;
			const st2 = (t2 + scrollT) % 1;

            if (st1 > st2) continue; /* Skip if dash is off-screen */

            const y1 = this._perspY(st1);
            const y2 = this._perspY(st2);
            const cx1 = this._perspXCenter(st1);
            const cx2 = this._perspXCenter(st2);
            const hw1 = this._perspW(st1, 3);
            const hw2 = this._perspW(st2, 3);

            gfx.fillStyle(this.palette.LANE_CENTER, 1);
            gfx.fillPoints([
                { x: cx1 - hw1, y: y1 },
                { x: cx1 + hw1, y: y1 },
                { x: cx2 + hw2, y: y2 },
                { x: cx2 - hw2, y: y2 },
            ], true);
        }
    }
    
    /* WhiteLane Dashes */
    _drawLaneDashes() {
        const gfx = this.gfx;
        const dashes = 16;
        
        const laneOffsets = [
            -0.5,
            0.5,
        ];

        laneOffsets.forEach(offset => {
            for (let i = 0; i < dashes; i++) {
                const t1 = i / dashes;
                const t2 = (i + 0.35) / dashes;

                const scrollT = (this.offset / 80) / dashes;
                const st1 = (t1 + scrollT) % 1;
                const st2 = (t2 + scrollT) % 1;
                
                if (st1 > st2) continue;
                
                const y1 = this._perspY(st1);
                const y2 = this._perspY(st2);
                const cx1 = this._perspXCenter(st1)
                const cx2 = this._perspXCenter(st2)
                const hw1 = this._perspW(st1, 2);
                const hw2 = this._perspW(st2, 2);

                const off1 = this._perspW(st1, C.ROAD_TOP_W * 0.22) * laneOff * 2;
                const off2 = this._perspW(st2, C.ROAD_TOP_W * 0.22) * laneOff * 2;

                gfx.fillStyle(this.palette.LANE_DASH, 0.85);
                gfx.fillPoints([
                    { x: cx1 + off1 - hw1, y: y1 },
                    { x: cx1 + off1 + hw1, y: y1 },
                    { x: cx2 + off2 + hw2, y: y2 },
                    { x: cx2 + off2 - hw2, y: y2 },
                ], true);
            }
        });
    }

    /* Road Edges */
    _drawRoadEdges() {
        const gfx = this.gfx;
        const strips = 20;

        for (let i = 0; i < strips; i++) {
            const t1 = i / strips;
            const t2 = (i + 1) / strips;
            
            const y1 = this._perspY(t1);
            const y2 = this._perspY(t2);
            const eW1 = this._perspW(t1, 18);
            const eW2 = this._perspW(t2, 18);
            const lx1 = this._perspXLeft(t1);
            const rx1 = this._perspXRight(t1);
            const lx2 = this._perspXLeft(t2);
            const rx2 = this._perspXRight(t2);

            const col = i % 2 === 0 ? 0xcc2200 : 0xffffff;
			gfx.fillStyle(col, 1);

			/* Left edge */
			gfx.fillPoints([
				{ x: lx1 - eW1, y: y1 },
				{ x: lx1, y: y1 },
				{ x: lx2, y: y2 },
				{ x: lx2 - eW2, y: y2 },
			], true);

			/* Right edge */
			gfx.fillPoints([
				{ x: rx1,       y: y1 },
				{ x: rx1 + eW1, y: y1 },
				{ x: rx2 + eW2, y: y2 },
				{ x: rx2,       y: y2 },
			], true);
		}
	}

    /* Perspective Projection Helpers */

    /* t = 0 is horizon, t = 1 is bottom of screen */
	_perspY(t) {
		return C.HORIZON_Y + (C.HEIGHT - C.HORIZON_Y) * t;
	}

	/* Half road width at depth t */
	_perspHalfW(t) {
		const topHalf    = C.ROAD_TOP_W / 2;
		const bottomHalf = C.ROAD_BOTTOM_W / 2;
		return topHalf + (bottomHalf - topHalf) * t;
	}

    /* Center X of road (straight ahead) */
	_perspXCenter(t) {
		return C.WIDTH / 2;
	}

	_perspXLeft(t) {
		return C.WIDTH / 2 - this._perspHalfW(t);
	}

	_perspXRight(t) {
		return C.WIDTH / 2 + this._perspHalfW(t);
	}

	/* Scale a world width w by perspective at depth t */
	_perspW(t, w) {
		const scale = this._perspHalfW(t) / (C.ROAD_BOTTOM_W / 2);
		return w * scale;
	}


    /* ─── LANE X POSITIONS FOR OBJECTS ──── */
	/* Returns screen X for a given lane 0-3 at the bottom of the screen */
	getLaneX(lane) {
		const laneW = C.ROAD_BOTTOM_W / C.ROAD_LANES;
		return (C.WIDTH / 2 - C.ROAD_BOTTOM_W / 2) + (lane + 0.5) * laneW;
	}

}