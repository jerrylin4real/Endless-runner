// A play scene with jump implemented
class Jump extends Phaser.Scene {
    constructor() {
        super('jumpScene');
        this.guiGenerated = false;  // change to true before submitting.

    }

    preload() {
        // set load path
        this.load.image('backgroundIMG', './assets/background.png');
        this.load.image('ground', './assets/ground.png');
        this.load.audio('bgm', './assets/bgm1.m4a');

        this.load.path = './assets/';
        this.load.atlas('platformer', 'kenny.png', 'kenny.json');
    }

    create() {
        // variables and settings

        this.ACCELERATION = 1500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1500;    // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 2; // change for double/triple/etc. jumps 🤾‍♀️
        this.JUMP_VELOCITY = -700;
        this.Y_GRAVITY = 2600;

        this.bgmPlayed = false;
        this.bgmCreated = false;
        this.gameOver = false;
        this.WORLD_COLLIDE = true;
        this.physicsDebug = true;
        this.initialTime = 0;

        this.BGcolor = '#223344';

        // setup dat.gui
        if (this.guiGenerated == false) {
            this.gui = new dat.GUI();
            let playerFolder = this.gui.addFolder('Player Parameters');
            playerFolder.add(this, 'ACCELERATION', 0, 2500).step(50);
            playerFolder.add(this, 'DRAG', 0, 2000).step(50);
            playerFolder.add(this, 'JUMP_VELOCITY', -2000, 0).step(50);
            playerFolder.add(this, 'MAX_JUMPS', 1, 5).step(1);
            playerFolder.open();

            let settingsFolder = this.gui.addFolder('Settings');
            settingsFolder.add(this, 'Y_GRAVITY', 0, 5000).step(50);
            settingsFolder.addColor(this, 'BGcolor');
            settingsFolder.add(this, 'WORLD_COLLIDE');
            this.guiGenerated = true; // prevent multiple gui on screen
        }

        // place tile sprite
        this.backgroundIMG = this.add.tileSprite(0, 0, 1338, 525, 'backgroundIMG').setOrigin(0, 0);

        // set bg color
        this.cameras.main.setBackgroundColor(this.BGcolor);

        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
        for (let y = game.config.height - 70; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, game.config.width, y);
        }

        // message text
        this.add.text(game.config.width / 2, 30, `(M)enu; (R)estart; (H)ide dat.gui`, { font: '16px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        this.besttimeText = this.add.text(300, borderUISize + borderPadding + 10, 'Best Time: ' + this.formatTime(localStorage.getItem("NeonRunnerBestTime")));

        this.timeText = this.add.text(450, borderUISize + borderPadding + 10, 'Cur_Time: ' + this.formatTime(this.initialTime));

        // For each 1000 ms or 1 second, call ontimedEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.ontimedEvent, callbackScope: this, loop: true });

        // add some physics clouds
        this.cloud01 = this.physics.add.sprite(600, 460, 'platformer', 'enemy');
        this.cloud01.body.setAllowGravity(false).setVelocityX(-180);
        this.cloud02 = this.physics.add.sprite(200, 360, 'platformer', 'enemy');
        this.cloud02.body.setAllowGravity(false).setVelocityX(-300);
        this.cloud03 = this.physics.add.sprite(400, 200, 'platformer', 'enemy');
        this.cloud03.body.setAllowGravity(false).setVelocityX(-300);

        // make ground tiles group
        this.ground = this.add.group();
        for (let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'ground').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for (let i = tileSize * 2; i < game.config.width - tileSize * 13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize * 9, 'ground').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // set up character
        this.alien = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'platformer', 'stand').setScale(SCALE * 2);
        this.alien.setCollideWorldBounds(this.WORLD_COLLIDE);
        this.alien.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        // create animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'walk',
                start: 1,
                end: 6,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'stand01' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'jump' }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'stand',
            defaultTextureKey: 'platformer',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'stand',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
        });

        this.anims.create({
            key: 'dead',
            defaultTextureKey: 'platformer',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'dead',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
        });


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // add physics colliders
        this.physics.add.collider(this.alien, this.ground);
        this.physics.add.collider(this.alien, this.cloud01);
        this.physics.add.collider(this.alien, this.cloud02);
        this.physics.add.collider(this.alien, this.cloud03);


        // Define keys 
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // play background music 
        if (this.bgmPlayed == false) {
            if (this.bgmCreated) {
                this.bgm.resume();
                return;
            }
            this.bgm = this.sound.add('bgm', {
                mute: false,
                volume: 0.7,
                rate: 1,
                loop: true,
                delay: 0
            });
            this.bgmCreated = true;
            this.bgm.play();
        } else {
            // Resume bgm if bgm exists
            this.bgm.resume();
        }
    }

    update() {
        // allow dat.gui updates on some parameters
        this.physics.world.gravity.y = this.Y_GRAVITY;
        this.cameras.main.setBackgroundColor(this.BGcolor);
        this.alien.setCollideWorldBounds(this.WORLD_COLLIDE);

        // check keyboard input ...

        // press R to restart the game
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            console.log("game restarted");
            this.gameOver = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.pauseBGM();

            console.log("Loaded Menu Scene");
            this.scene.start("menuScene");
        }

        if (cursors.left.isDown) {
            this.alien.body.setAccelerationX(-this.ACCELERATION);
            this.alien.setFlip(true, false);
            // play(key [, ignoreIfPlaying] [, startFrame])
            this.alien.anims.play('walk', true);
        } else if (cursors.right.isDown) {
            this.alien.body.setAccelerationX(this.ACCELERATION);
            this.alien.resetFlip();
            this.alien.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.alien.body.setAccelerationX(0);
            this.alien.body.setDragX(this.DRAG);
            this.alien.anims.play('stand');
        }

        // check if alien is grounded
        this.alien.isGrounded = this.alien.body.touching.down;
        // if so, we have jumps to spare 
        if (this.alien.isGrounded) {
            this.jumps = this.MAX_JUMPS;
            this.jumping = false;
        } else {
            this.alien.anims.play('jump');
        }
        // allow steady velocity change up to a certain key down duration
        if (this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
            this.alien.body.velocity.y = this.JUMP_VELOCITY;
            this.jumping = true;
        }
        // finally, letting go of the UP key subtracts a jump
        if (this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
            this.jumps--;
            this.jumping = false;
        }


        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.cloud01, this.cloud01.width / 2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width / 2);
        this.physics.world.wrap(this.cloud03, this.cloud03.width / 2);

        this.backgroundIMG.tilePositionX += 4;  // update tile sprite

        if (this.gameOver) {
            if (this.initialTime > localStorage.getItem("NeonRunnerBestTime")) {
                localStorage.setItem("NeonRunnerBestTime", this.initialTime);
                this.besttimeText.setText('Best Time: ' + this.formatTime(localStorage.getItem("NeonRunnerBestTime")));
            }

            // pause bgm if it is created
            this.pauseBGM();

            // reinitialize time and restart game
            this.initialTime = 0;
            this.restartGameEvent = this.time.addEvent({ delay: 1000, callback: this.scene.restart(), callbackScope: this, loop: false });
        }
    }

    pauseBGM(bgm) {
        if (this.bgmCreated) {
            this.bgm.pause()
            this.bgmPlayed = false;
            console.log("Paused BGM");
        }
        return;
    }

    formatTime(seconds) {
        // Minutes
        var minutes = Math.floor(seconds / 60);
        // Seconds
        var partInSeconds = seconds % 60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, '0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }

    ontimedEvent() {
        if (!this.gameOver) {
            this.update();
            this.initialTime += 1;
            // console.log("initialTime: " + this.initialTime); // debug time 
            this.timeText.setText('Cur_Time: ' + this.formatTime(this.initialTime));
        }
        return;
    }

}