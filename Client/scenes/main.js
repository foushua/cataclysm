import { Scene } from 'phaser';

export default class Main extends Scene {

    constructor() {
        super({ key: 'main' });
    }

    init() {
        this.maps = null;
        this.tiles = {};
        this.layers = {};
        this.player = null;
        this.cursors = null;
        this.traps = {};
        this.text = null;

        this.debug = null;

        this.effects = {}; // Effets des bonus
    }

    
    /**
     * This function is used to create world of your imagination.
     */
    createWorld() {
        this.maps = this.make.tilemap({ key: 'maps' });

        // Tiles et calque d'origine
        this.tiles.tiles = this.maps.addTilesetImage('tiles');
        this.layers.tiles = this.maps.createDynamicLayer('World', this.tiles.tiles, 0, 0);
        this.layers.tiles.setCollisionByExclusion([-1]); // The ;player will collide with this layer.
        
        // Tiles et calque de la mer
        this.tiles.sea = this.maps.addTilesetImage('sea');
        this.layers.sea = this.maps.createDynamicLayer('Sea', this.tiles.sea, 0, 0);
        
        // Tiles et calque plateformes
        this.tiles.platform = this.maps.addTilesetImage('plateformes'); 
        this.layers.platform = this.maps.createDynamicLayer('Plateformes', this.tiles.platform, 0, 0);
        this.layers.platform.setCollisionByExclusion([-1]); // The player will collide with this layer.


        // BONUS
        this.tiles.fishTiles = this.maps.addTilesetImage('fish');
        this.layers.fishLayer = this.maps.createDynamicLayer('Fish', this.tiles.fishTiles, 0, 0);

        this.layers.fishLayer.setTileIndexCallback(34, this.collectFish, this);
        // this.physics.add.overlap(this.player, this.layers.fishLayer);



        // Set the boundaries of our world.
        this.physics.world.bounds.width = this.layers.tiles.width;
        this.physics.world.bounds.height = this.layers.tiles.height;
    }

    /**
     * This function is used to create the player.
     * @param {String} id
     * @param {Object} position
     */
    createPlayer(id = null, position = { x: 400, y: 1420 }) {
        this.player = this.physics.add.sprite(position.x, position.y, 'player');
        this.player.setScale(1)
            .setSize(95,120)
            .setOffset(35,10)
            .setBounce(0) // our player will bounce from items
            .setCollideWorldBounds(true); // don't go out of the map

        // Register the id of the player.
        this.player.id = id;

        // Set the player alive
        this.player.alive = true;

        // The player collide with layers.
        this.physics.add.collider(this.layers.tiles, this.player);
        this.physics.add.collider(this.layers.platform, this.player);

        // Add player controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    /**
     * This function is used to apply all camera settings.
     */
    manageCamera() {
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.maps.widthInPixels, this.maps.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff'); 
    }

    /**
     * This function is used to register all animations.
     */
    registerAnimations() {
        this.anims.create({
            key: 'walk', frameRate: 60, repeat: -1,
            frames: this.anims.generateFrameNames('player', { prefix: 'Run_', start: 1, end: 30, zeroPad: 3 })
        });
    
        this.anims.create({
            key: 'idle', frameRate: 60, repeat: -1,
            frames: this.anims.generateFrameNames('player', { prefix: 'Idle_', start:1, end: 36, zeroPad:3 })
        });

        this.anims.create({
            key: 'jump', frameRate: 60, repeat: -1,
            frames: this.anims.generateFrameNames('player', { prefix: 'Jump_', start: 1, end: 36, zeroPad: 3})
        })
        
        this.anims.create({
            key: 'ded', frameRate: 10,
            frames: [{ key: 'player', frame: 'Ded' }]
        });
    }

    /**
     * This function is used to register and handle all spikes.
     */
    manageSpikes() {
        this.traps.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        let spikeObjects = this.maps.getObjectLayer('Traps')['objects'];
        spikeObjects.forEach(spikeObject => {
            // Add new spikes to our sprite group, change the start y position to meet the platform
            const spike = this.traps.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spikeTrap').setOrigin(0, 0);
            spike.setAlpha(0);
        });
        this.physics.add.collider(this.player, this.traps.spikes, this.killPlayer, null, this);
    }

    /**
     * This function is used to manage the death of a player
     */
    killPlayer (sprite, tile) {
        this.player.alive = false;
        this.physics.world.colliders.destroy();
        this.cameras.main.stopFollow();
        this.player.anims.play('ded', true);
        
        this.player.body.allowRotation = true;
        this.player.body.angularVelocity = 500;
        this.player.body.setVelocityX((Math.random() * 1000) - 500);
        this.player.body.setVelocityY(-200);
    
        this.player.setCollideWorldBounds(false);

        tile.setAlpha(1);
        setTimeout(() => {
            tile.setAlpha(0)
        }, 5000)

        // Player respawn
        setTimeout(() => {
            this.cameras.main.startFollow(this.player);
            this.player.alive = true;

            this.physics.add.collider(this.layers.tiles, this.player);
            this.physics.add.collider(this.player, this.traps.spikes, this.killPlayer, null, this);

            this.player.setCollideWorldBounds(true);
            this.player.setVelocity(0,0);
            this.player.body.angularVelocity = 0;
            this.player.setX(400);
            this.player.setY(1420);
            this.player.setRotation(0);
            this.player.anims.play('idle', true);
            this.player.body.allowRotation = false;
        }, 2000);
    }

    collectFish(sprite, tile){
        this.layers.fishLayer.removeTileAt(tile.x, tile.y);
        this.effects.speed = true;
        this.text.setText('poisson !!');
        rocket.play()
        setTimeout(function(){this.effects.speed=false, this.text.setText('')}, 2000)
        return false;
    }

    /**
     * These function is used to display all debug informations.
     */
    debugging() {
        return `Debugging Cataclysm (Phaser ${Phaser.VERSION})
        \nFramerate: ${Math.floor(this.game.loop.actualFps)}
        \nCoordinates: X:${Math.floor(this.player.x)} Y:${Math.floor(this.player.y)}`;
    }

    create() {

        this.createWorld();
        this.createPlayer();

        this.manageCamera();
        this.registerAnimations();
        // this.manageSpikes();

        if (process.env.NODE_ENV === 'development') {
            this.debug = this.add.text(20, 20, this.debugging(), {
                fontSize: '20px',
                fill: '#ff0',
                backgroundColor: '#000',
                padding: { x:10, y:10 }
            }).setScrollFactor(0);
        }
    } 

    update(time, delta) {  
        if (process.env.NODE_ENV === 'development') this.debug.setText(this.debugging());

        if (this.player.alive) {
            if (this.cursors.left.isDown)
            {
                this.player.body.setVelocityX(-500); // move left
                this.player.flipX= true; // flip the sprite to the left

                if (this.player.body.onFloor()){
                    this.player.anims.play('walk', true); // play walk animation
                }
            }
            else if (this.cursors.right.isDown)
            {
                this.player.body.setVelocityX(500); // move right
                this.player.flipX = false; // use the original sprite looking to the right

                if (this.player.body.onFloor()){
                    this.player.anims.play('walk', true); // play walk animatio
                }
            } else {
                this.player.body.setVelocityX(0);

                if (this.player.body.onFloor()){
                    this.player.anims.play('idle', true);
                }
            }  
            // jump 
            if (this.cursors.up.isDown && this.player.body.onFloor())
            {
                this.player.body.setVelocityY(-800); 
            }

            if (!this.player.body.onFloor()){

                this.player.anims.play('jump', true);
            }       
        }
    }

}