class Jump extends Phaser.Scene {
    constructor() {
        super('jumpScene');
        this.guiGenerated = false;  // change to true before submitting.
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        this.load.atlas('platformer_atlas', 'kenny_sheet.png', 'kenny_sheet.json');
    }

    create() {
        // variables and settings
        this.ACCELERATION = 1500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 2; // change for double/triple/etc. jumps 🤾‍♀️
        this.JUMP_VELOCITY = -700;
        this.Y_GRAVITY = 2600;
        this.WORLD_COLLIDE = true;
        this.physicsDebug = true;
        this.BGcolor = '#223344';

        // setup dat.gui
        if (this.guiGenerated == false) {
            this.gui = new dat.GUI();
            let playerFolder = this.gui.addFolder('Player Parameters');
            playerFolder.add(this, 'ACCELERATION', 0, 2500).step(50);
            playerFolder.add(this, 'DRAG', 0, 1000).step(50);
            playerFolder.add(this, 'JUMP_VELOCITY', -2000, 0).step(50);
            playerFolder.add(this, 'MAX_JUMPS', 1, 5).step(1);
            playerFolder.open();

            let settingsFolder = this.gui.addFolder('Settings');
            settingsFolder.add(this, 'Y_GRAVITY', 0, 5000).step(50);
            settingsFolder.addColor(this, 'BGcolor');
            settingsFolder.add(this, 'WORLD_COLLIDE');
            this.guiGenerated = true; // prevent multiple gui on screen
        }

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

        // add some physics clouds
        this.cloud01 = this.physics.add.sprite(600, 100, 'platformer_atlas', 'cloud_1');
        this.cloud01.body.setAllowGravity(false).setVelocityX(25);
        this.cloud02 = this.physics.add.sprite(200, 200, 'platformer_atlas', 'cloud_2');
        this.cloud02.body.setAllowGravity(false).setVelocityX(45);

        // make ground tiles group
        this.ground = this.add.group();
        for (let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for (let i = tileSize * 2; i < game.config.width - tileSize * 13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize * 9, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // set up my alien son 👽
        this.alien = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'platformer_atlas', 'front').setScale(SCALE);
        this.alien.setCollideWorldBounds(this.WORLD_COLLIDE);
        this.alien.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        // create animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_atlas', {
                prefix: 'walk',
                start: 1,
                end: 11,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            defaultTextureKey: 'platformer_atlas',
            frames: [
                { frame: 'front' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'platformer_atlas',
            frames: [
                { frame: 'jump' }
            ],
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.alien, this.ground);

        // Define keys 
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    }

    update() {
        // allow dat.gui updates on some parameters
        this.physics.world.gravity.y = this.Y_GRAVITY;
        this.cameras.main.setBackgroundColor(this.BGcolor);
        this.alien.setCollideWorldBounds(this.WORLD_COLLIDE);

        // check keyboard input

        // press R to restart the game
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            // After 2000 ms or 2 second, call onEvent
            console.log("game restarting");
            this.restartGameEvent = this.time.addEvent({ delay: 3000, callback: this.scene.restart(), callbackScope: this, loop: false });
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            // After 2000 ms or 2 second, call onEvent
            console.log("Loading Menu Scene");
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
            this.alien.anims.play('idle');
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
    }
}