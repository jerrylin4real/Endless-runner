// Character prefab
class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        // this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame
    }

    update() {

        // left/right movement
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
        // up/down movement
        
        if (keyUP.isDown && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }else if (keyDOWN.isDown && this.y <= game.config.height - borderUISize - this.height) {
            this.y += this.moveSpeed;
        }

        /* fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }
        // if fired, move up 
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        */
        /* reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
        */
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding - 10;
    }
}