import { Scene } from 'phaser';

export default class Loading extends Scene {

    constructor() {
        super({ key: 'loading' });
    }

    preload() {

        // Load audio assets..
        this.load.audio('music:main', 'audios/musics/main.mp3');

        // Show loading..
        this.add.text(this.cameras.main.width - 15, 5, 'Loading..', {
            color: '#FFFFFF',
            fontSize: 28
        }).setOrigin(1, 0);

        // Switch scene when loading is complete..
        this.load.on('complete', () => {
            this.scene.start('main');
        });
    }

}