import { Scene } from 'phaser';

export default class Main extends Scene {

    constructor() {
        super({ key: 'main' });
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'map.json');
        // tiles in spritesheet 
        this.load.spritesheet('tiles', 'images/tiles.png', {frameWidth: 70, frameHeight: 70});
        // simple coin image
        this.load.image('coin', 'images/coinGold.png');
        this.load.image('spikeTrap', 'images/spikeTrap.png');
        // player animations
        this.load.atlas('player', 'images/cat.png', 'cat.json');
    }

    init({ server }) {
        this.server = server;

        this.map;
        this.player;
        this.cursors;
        this.groundLayer;
        this.coinLayer;
        this.trapLayer;
        this.text;
        this.score = 0;
        this.alive = true;
    }

    create() {
        // load the map 
        this.map = this.make.tilemap({key: 'map'});
    
        let graphics = this.add.graphics();
        
        // tiles for the ground layer
        let groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
     
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;
    
        // create the player sprite    
        this.player = this.physics.add.sprite(200, 200, 'player'); 
        this.player.setScale(.3)
              .setSize(330,275)
              .setOffset(40,45)
              .setBounce(0) // our player will bounce from items
              .setCollideWorldBounds(true) // don't go out of the map
    
        this.physics.add.collider(this.groundLayer, this.player)
      
        // add palyer controls
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff'); 
    
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { prefix: 'Run_', start: 1, end: 24, zeroPad: 3 }),
            frameRate: 120,
            repeat: -1
        });
    
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'Idle'}],
            frameRate: 10,
        });
    
        // coin image used as tileset
        let coinTiles = this.map.addTilesetImage('coin');
        // add coins as tiles
        this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);
    
        this.coinLayer.setTileIndexCallback(17, this.collectCoin, this); // the coin id is 17
        // when the player overlaps with a tile with index 17, collectCoin will be called    
        this.physics.add.overlap(this.player, this.coinLayer);
    
        let spikeTiles = this.map.addTilesetImage('spikeTrap');
        this.trapLayer = this.map.createDynamicLayer('Traps', spikeTiles, 0, 0);
    
        this.trapLayer.setTileIndexCallback(18, this.killPlayer, this);
        this.physics.add.overlap(this.player, this.trapLayer);
        this.physics.add.collider(this.trapLayer, this.player)
    
        this.text = this.add.text(20, 570, `💰:0`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
    }

    update(time, delta) {    

        if (this.alive) {
            if (this.cursors.left.isDown)
            {
                this.player.body.setVelocityX(-500); // move left
                this.player.anims.play('walk', true); // play walk animation
                this.player.flipX= true; // flip the sprite to the left
            }
            else if (this.cursors.right.isDown)
            {
                this.player.body.setVelocityX(500); // move right
                this.player.anims.play('walk', true); // play walk animatio
                this.player.flipX = false; // use the original sprite looking to the right
            } else {
                this.player.body.setVelocityX(0);
                this.player.anims.play('idle', true);
            }  
            // jump 
            if (this.cursors.up.isDown && this.player.body.onFloor())
            {
                this.player.body.setVelocityY(-800);        
            }
        }
    }

    collectCoin(sprite, tile) {
        this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
        this.score ++; // increment the score
        this.text.setText(`💰:${this.score}`); // set the text to show the current score
        return false;
    }

    killPlayer (sprite, tile) {
        this.alive = false
        console.log('function call');
        this.physics.world.colliders.destroy();
        this.cameras.main.stopFollow();
        
        this.player.body.allowRotation = true
        this.player.body.angularVelocity = 1000
        this.player.body.setVelocityX((Math.random() * 1000)-500)
        this.player.body.setVelocityY(-200);  
    
        this.player.setCollideWorldBounds(false);
    
        return false;
    }
}