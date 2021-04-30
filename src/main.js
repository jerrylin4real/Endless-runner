/*******************************************************************************************************************************
* main.js Header
*   collaborator names: Leland Jin(Programmer), Qingzhao Cao(Lakery - Character Artist), Qijun Lin (Jerry - Background Artist)
*   game title: Undecided Endless Runner
*   date completed: May 5, 2021
*  creative tilt justification:
********************************************************************************************************************************
*/
let config = {
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  scene: [Menu, Play]
}

var game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyW, keyS, keyA, keyD, keyQ, keyP, keyM, keyV;

// global variables/storages
localStorage.setItem("RocketPatrolTopScore", 0);
// localStorage.setItem("RocketPatrolSettings", {});

