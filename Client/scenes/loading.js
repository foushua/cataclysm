import { Scene } from 'phaser';

export default class Loading extends Scene {

    constructor() {
        super({ key: 'loading' });
    }

    preload() {

        // Load audio assets..
        this.load.audio('music:main', 'audios/musics/main.mp3');

        // Load tilemap assets..
        this.load.tilemapTiledJSON('maps', 'map.json');
        
        // Load spritesheet assets..
        this.load.spritesheet('tiles', 'images/tiles.png', { frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('plateformes', 'images/plateformes.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('sea', 'images/sea.png', { frameWidth: 70, frameHeight: 70});
        
        // Load images assets
        this.load.image('coin', 'assets/coinGold.png');
        this.load.image('fish', 'assets/fish.png');
        this.load.image('choco', 'assets/choco.png');
        this.load.image('cucumber', 'assets/cucumber.png');
        this.load.image('bird', 'assets/bird.png')
        this.load.image('trampoline', 'assets/trampoline.png')
        this.load.image('spikeTrap', 'assets/spikeTrap.png');
        this.load.image('moving', 'assets/moving.png');
    

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