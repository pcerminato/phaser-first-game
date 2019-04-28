import 'phaser';

class LoadingScene extends Phaser.Scene {
    constructor() {
        super('loadingScene');
    }
    create() {
        this.add.text(20, 20, 'Loading game...');
        setTimeout(function () {
            // ahhh hardcoding :(        
            this.scene.start('firsLevelScene');
        }.bind(this), 2000);
    }
}

export default LoadingScene;