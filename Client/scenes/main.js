import { Scene } from 'phaser';

export default class Main extends Scene {
   
    constructor() {
        super({ key: 'main' });
    }

    init({ server }) {
        this.server = server;
    }

    create() {
        new Logo(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
        this.server.onConnect(error => {
            if (error) console.error(error);
            console.log('We are ready to work harder! 💪😎');
        });
    }

}