// Legacy code for reference only
// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, timeBonusValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // pixels per frame, 4
        this.timeBonus = timeBonusValue;
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if (this.x <= 0 - this.width) {
            this.reset();
        }

    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}