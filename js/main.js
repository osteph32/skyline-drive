/*
main.js
Creates Phaser game instance and starts all scenes.
*/

const config = {
    type: Phaser.AUTO,
    width: C.WIDTH,
    height: C.HEIGHT,
    backgroundColor:  `#000000`,
    parent: document.body,

    /* No arcade physics. I decided to do all the movement manually */

    scene: [
        MenuScene, 
        /* DayScene, 
        NightScene */
    ],
};

const game = new Phaser.Game(config);