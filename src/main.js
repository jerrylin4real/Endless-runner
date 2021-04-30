/*******************************************************************************************************************************
* main.js Header
*   collaborator names: Leland Jin(Programmer), Qingzhao Cao(Lakery-Character Artist), Qijun Lin (Jerry - Artist/programmer)
*   game title: Undecided Endless Runner
*   date completed: May 5, 2021
*   creative tilt justification:
********************************************************************************************************************************
*/

// be stricc
'use strict';

// Global Bariables
let cursors;
const SCALE = 0.5;
const tileSize = 35;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyW, keyS, keyA, keyD, keyQ, keyP, keyM, keyV;

// global variables/storages
localStorage.setItem("RocketPatrolTopScore", 0);
//localStorage.setItem("RocketPatrolTopScore", 0);

// localStorage.setItem("RocketPatrolSettings", {});


// main game object
let config = {
  type: Phaser.WEBGL,
  width: 840,
  height: 525,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        x: 0,
        y: 0
      }
    }
  },
  scene: [Menu, Play, Jump]
};

// Legacy config
let configOld = {
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  scene: [Menu, Play]
}


var game = new Phaser.Game(config);
// var oldgame = new Phaser.Game(configOld);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;




