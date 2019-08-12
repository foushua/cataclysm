import { Scene } from 'phaser';

export default class Main extends Scene {
   
    constructor() {
        super({ key: 'main' });
    }

    init({ server }) {
        this.server = server;
    }

    create() {
        this.server.onConnect(error => {
            if (error) console.error(error);
            console.log('We are ready to work harder! 💪😎');
        });
    }

}