import { Scene } from 'phaser';
import Geckos from '@geckos.io/client';

export default class Loading extends Scene {

    constructor() {
        super({ key: 'loading' });
        this.server = Geckos();
    }

    preload() {

        // Show loading..
        this.add.text(this.cameras.main.width - 15, 5, 'Loading..', {
            color: '#FFFFFF',
            fontSize: 28
        }).setOrigin(1, 0);

        // Switch scene when loading is complete..
        this.load.on('complete', () => {
            this.scene.start('main', { server: this.server });
        });
    }

}