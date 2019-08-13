import '@babel/polyfill';
import Phaser from 'phaser';

// Loading all scenes..
import { Loading, Main } from './scenes';

class Game extends Phaser.Game {

    constructor() {
        super({
            title: "Cataclysm",
            type: Phaser.AUTO,
            width: window.innerWidth * Math.round(window.devicePixelRatio), height: window.innerHeight * Math.round(window.devicePixelRatio),
            scene: [Loading, Main],
            disableContextMenu: true,
            enableDebug: process.env.NODE_ENV === 'development',
            input: { keyboard: true, mouse: true, touch: false, gamepad: false },
            physics: { default: 'arcade', arcade: { debug: process.env.NODE_ENV === 'development', gravity: { y: 1200 } }},
            scale: {
                mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT ,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });
    }

}

window.addEventListener('load', () => {
   new Game();
});