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
        this.audios = { music: {}, effect: {} };

        this.debug = null;
    }

    
    /**
     * This function is used to create world of your imagination.
     */
    createWorld() {
        this.maps = this.make.tilemap({ key: 'maps' });
        this.tiles.map = this.maps.addTilesetImage('tiles');
        this.layers.map = this.maps.createDynamicLayer('World', this.tiles.map, 0, 0);
        
         // The player will collide with this layer.
        this.layers.map.setCollisionByExclusion([-1]);

        // Set the boundaries of our world.
        this.physics.world.bounds.width = this.layers.map.width;
        this.physics.world.bounds.height = this.layers.map.height;
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
        this.physics.add.collider(this.layers.map, this.player);

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
     * This function is used to register all audios.
     */
    registerAudios() {
        this.audios.effect.jump = this.sound.add('effect:jump', { volume: .5 });
        this.audios.effect.meow = this.sound.add('effect:meow', { volume: .2 });
        this.audios.effect.knife = this.sound.add('effect:knife', { volume: 1 });
        this.audios.effect.catDeath = this.sound.add('effect:death', { volume: .9 });
        this.audios.effect.rocket = this.sound.add('effect:rocket', { volume: 1 });
        this.audios.effect.scream = this.sound.add('effect:scream', { volume: .4 });
        this.audios.effect.vomit  = this.sound.add('effect:vomit', { volume: 1 });
        this.audios.effect.flute  = this.sound.add('effect:flute', { volume: .2 });
        this.audios.effect.twang  = this.sound.add('effect:twang', { volume: 1 });

        this.audios.music.default = this.sound.add('music:default', { volume: .2 });
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

            this.physics.add.collider(this.layers.map, this.player);
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
        this.registerAudios();

        this.createPlayer();
        this.manageCamera();

        this.registerAnimations();
        this.manageSpikes();

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