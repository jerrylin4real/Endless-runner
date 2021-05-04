class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio
    // this.load.audio('sfx_select', './assets/blip_select12.wav');

    // load image
    this.load.image('menu_background', 'assets/MENUS.png');

  }

  create() {
    // menu text configuration
    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }
    // Create background img
    this.add.image(410, 250, 'menu_background');
    // show menu text
    menuConfig.backgroundColor = 'yellow';
    menuConfig.color = '#000';

    // Legacy add text was intergrated into background
    //this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding - 20, 'Press ↑ to Play', menuConfig).setOrigin(0.5);

    // define keys
    keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
    

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(keyP)) {

      //this.sound.play('sfx_select');
      this.scene.start("jumpScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyC)) {
      this.scene.start("creditScene");
      console.log("credit restarted");
  }


  }
}