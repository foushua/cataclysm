import { Scene } from 'phaser';

export default class Menu extends Scene {
    constructor() {
        super({ key: 'menu' });
    }

    init() {
        this.playButton = null;
    }

    getCenterX(){
        return ( this.sys.canvas.width ) * 0.5
    }﻿
    
    getCenterY(){
        return ( this.sys.canvas.height ) * 0.5
    }﻿

    hover(){
        this.playButton.setStyle({fill:'#ff0'})
    }

    hoverReset(){
        this.playButton.setStyle({fill: '#fff'})
    }

    playGame(){
        console.log('click')
        this.scene.start('loading')
    }

    create(){
        this.playButton = this.add.text(this.getCenterX(), this.getCenterY()+100, 'Play', {   
            fill: '#fff',
            font: "70px Arial",
            align: "center"
        })
        .setInteractive()
        .on('pointerdown', () => this.playGame())
        .on('pointerover', () => this.hover())
        .on('pointerout', () => this.hoverReset())
    }

    update(){

    }
}