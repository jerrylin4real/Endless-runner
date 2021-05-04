class Credit extends Phaser.Scene {
  constructor() {
    super("creditScene");
  }

  preload() {

    // load image
    //this.load.image('credit_background', 'assets/credit_background.png');

  }

  create() {

    // Define keys 
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    //this.backgroundIMG = this.add.tileSprite(0, 0, 1338, 525, 'backgroundIMG').setOrigin(0, 0);

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(keyM)) {
      console.log("Loaded Menu Scene");
      this.scene.start("menuScene");
    }
  }
}