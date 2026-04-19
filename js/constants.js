/*
constants.js
Edit here to change colors, layout, and more
*/

const C = {

    WIDTH: 800,
    HEIGHT: 480,

    /* Road */
    HORIZON_Y: 200,
    ROAD_BOTTOM_W: 780,
    ROAD_TOP_W: 110,
    ROAD_LANES: 4,

    /* Player */
    PLAYER_START_LANE: 1,
    PLAYER_Y: 300,
    PLAYER_SPEED: 4,
    PLAYER_MAX_X: 530,
    PLAYER_MIN_X: 270,

    /* Scroll */
    BASE_SCROLL_SPEED: 5,
    MAX_SCROLL_SPEED: 12,
    ACCEL_RATE: 0.08,
    DECEL_RATE: 0.2,

    /* Traffic (night only) */
    TRAFFIC_SPAWN_INTERVAL: 1800,
    TRAFFIC_MIN_SPEED: 3,
    TRAFFIC_MAX_SPEED: 7,

    PX: 3,

    /* Day Color Palette */
    DAY: {
        SKY_TOP:      0x5bc8f5,
		SKY_BOTTOM:   0xa8e6f0,
		SUN:          0xffe84d,
		FUJI_SNOW:    0xffffff,
		FUJI_ROCK:    0x3a3030,
		GRASS:        0x5db85d,
		GRASS_DARK:   0x3d8c3d,
		ROAD:         0x8a8a8a,
		ROAD_DARK:    0x6e6e6e,
		LANE_DASH:    0xffffff,
		LANE_CENTER:  0xf5c518,
		TREE_TRUNK:   0x7a5c3a,
		BLOSSOM:      0xf9a8c9,
		BLOSSOM_DARK: 0xe87aab,
    },

    /* Night Color Palette */
    NIGHT: {
        SKY:          0x05060f,
		STAR:         0xffffff,
		BUILDING:     0x12152a,
		BUILDING_LIT: 0xf5c518,
		NEON_PINK:    0xff2d78,
		NEON_CYAN:    0x00f0ff,
		NEON_GREEN:   0x39ff14,
		ROAD:         0x3a3d52,
		ROAD_DARK:    0x2a2c3e,
		LANE_DASH:    0xffffff,
		LANE_CENTER:  0xffaa00,
		HEADLIGHT:    0xfff5cc,
    },

    /* R32 GTR Color Palette */
    CAR: {
        BODY:         0x5a5f63,
		BODY_DARK:    0x3c4044,
		BODY_LIGHT:   0x7a8084,
		WINDOW:       0x1a2a3a,
		WINDOW_GLARE: 0x4a6a8a,
		BUMPER:       0x2a2e30,
		WHEEL:        0x1a1a1a,
		WHEEL_RIM:    0xaaaaaa,
		BRAKE_LIGHT:  0xff2200,
		PLATE:        0xffffff,
		PLATE_TEXT:   0x111111,
    },


    UI: {
        FONT:       '"Courier New", monospace',
		TEXT_MAIN:  '#ffffff',
		TEXT_DIM:   '#888888',
		TEXT_SCORE: '#00f0ff',
		TEXT_WARN:  '#ff2d78',
		PANEL_BG:   'rgba(0,0,0,0.55)',
    },
};