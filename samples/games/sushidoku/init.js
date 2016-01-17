/*global
 Phaser: true,
 Sudoku: true,
 Scene: true,
 console: true,
 window: true
*/

var game = new Phaser.Game(800, 480, Phaser.CANVAS, 'game');
	
game.state.add('Landscape', Scene.Landscape);
game.state.add('Splash', Scene.Splash);
game.state.add('Credits', Scene.Credits);
game.state.add('Resume', Scene.Resume);
game.state.add('Levels', Scene.Levels);
game.state.add('Main', Scene.Main);
game.state.start('Splash');

