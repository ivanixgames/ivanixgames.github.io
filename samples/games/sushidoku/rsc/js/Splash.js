/*jslint nomen: true */
/*global
 Ivx: true,
 Phaser: true,
 Scene: true,
 window: true,
 console: true,
 dbX: true,
 g: true
*/
g = {};
g.btn  = [];
Scene.Splash = function (game) {
	"use strict";
	var thisObj, rsc, triggerFS, ui;

	thisObj = this;
	g.thisObj = thisObj;

	this.SelectBtn = function (btn) {
		switch (btn.textkey) {
		case 'Enter':
			game.state.start('Credits');
			ui.FullScreen();
			break;
		}
	};

	this.preload = function () {
		rsc = "rsc/media/";
		game.load.image('greenbg', rsc + 'greenbg.png');

		game.load.image('title', rsc + 'title.png');
		game.load.spritesheet('button', rsc + 'button.png', 200, 50);
		game.load.text('lang', 'rsc/lang/en-US.json');
		
	};
	this.create = function () {
		Ivx.Lang.Init(game.cache.getText('lang'));
		ui = new Ivx.UI(game);
		ui.ForceLandscape();
		game.add.sprite(0, 0, 'title');

		ui.Btn('Enter', 550, 390);
		ui.SelectBtn = function (btn) {
			thisObj.SelectBtn(btn);
		};
		game.renderDirty = true;
		triggerFS = true;
	};
	this.update = function () {
		if (triggerFS) {
			triggerFS = false;
			game.renderDirty = true;
			ui.FullScreen();
		} else {
			game.renderOnPointerChange();
		}
	};


};
