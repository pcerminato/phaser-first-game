import 'phaser';

class FirstLevelScene extends Phaser.Scene {
  constructor() {
    // This string as param in super() is the identifier for this class
    super('firsLevelScene');
    this.platforms;
    this.player;
    this.cursors;
    this.stars;
    this.score = 0;
    this.scoreText = 'Score: 0';
    this.gameOver = false;
  }
  preload() {
    this.load.image('sky', './static/sky.png');
    this.load.image('ground', './static/platform.png');
    this.load.image('star', './static/star.png');
    this.load.image('bomb', './static/bomb.png');
    this.load.spritesheet('dude', 
        './static/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }
  create() {

    this.add.image(400, 300, 'sky');

    // group of static physic objects
    this.platforms = this.physics.add.staticGroup();
    
    // creating static game objects and adding them to the group
    this.platforms
      .create(400, 568, 'ground')
      .setScale(2)
      .refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    //  created via the Physics Game Object Factory, with Dynamic Physics body by default
    this.player = this.physics.add.sprite(300, 500, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    /* Animations */
    this.anims.create({
      key: 'left',
      // uses frames 0, 1, 2 & 3
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3
      }),
      // runs at 10 frames per second
      frameRare: 10,
      // tells the animation to loop
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        ends: 8
      }),
      frameRare: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4}],
      frameRate: 20
    });

    //this.player.body.setGravityY(300);

    // It takes two objects and tests for collision and performs separation against them
    this.physics.add.collider(this.player, this.platforms);


    /* STARS */

    // groups by default are dynamic
    this.stars = this.physics.add.group({
      // By default, any children of the group will be a star
      key: 'star',
      // plus 11
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        // it will spread the stars: the 1st x=12, 2nd x=82, ...
        stepX: 70
      }
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, this.platforms);

    this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

    function collectStar(player, stars) {
      stars.disableBody(true, true);
      this.score = (this.score === 0) ? 2 : this.score * 2;
      this.scoreText.setText(`Score: ${this.score}`)
      
      // when every star has been collected, realise the bombs!
      if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate(function (star) {
          star.enableBody(true, star.x, 0, true, true);
        });
        const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    /** SCORE */
    this.scoreText = this.add.text(
      16, 
      16, 
      this.scoreText, 
      { fontSize: '32px', fill: '#000', fontFamily: 'Lucida Console' }
    );

    /** BOMBS */
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

    function hitBomb(player, bomb) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.gameOver = true;
    }

  }
  update() {
    // Movements!
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn', true);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}

export default FirstLevelScene;