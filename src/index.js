import 'phaser';
import FirstLevelScene from './scenes/firstLevelScene';
import LoadingScene from './scenes/loadingScene';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: [LoadingScene, FirstLevelScene]
};

new Phaser.Game(config);
