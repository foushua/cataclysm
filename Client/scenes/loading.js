import { Scene } from 'phaser';

export default class Loading extends Scene {

    constructor() {
        super({ key: 'loading' });
    }

    preload() {

        // Load audio assets..
        this.load.audio('music:default', 'audios/musics/default.mp3');
        this.load.audio('effect:jump', 'audios/effects/jump.mp3');
        this.load.audio('effect:meow',  'audios/effects/meow.mp3');
        this.load.audio('effect:knife', 'audios/effects/knife.mp3');
        this.load.audio('effect:death', 'audios/effects/death.mp3');
        this.load.audio('effect:rocket', 'audios/effects/rocket.mp3');
        this.load.audio('effect:scream', 'audios/effects/fear.mp3');
        this.load.audio('effect:vomit', 'audios/effects/vomit.mp3');
        this.load.audio('effect:flute', 'audios/effects/flute.mp3');
        this.load.audio('effect:twang', 'audios/effects/twang.mp3');

        // Load tilemap assets..
        this.load.tilemapTiledJSON('maps', 'map.json');
        
        // Load spritesheet assets..
        this.load.spritesheet('tiles', 'images/tiles.png', { frameWidth: 70, frameHeight: 70});
        
        // Load images assets
        this.load.image('spikeTrap', 'images/spikesTrap.png');

        // Load atlas assets
        this.load.atlas('player', 'images/cat.png', 'cat.json');

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