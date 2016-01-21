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
Scene.Resume = function (game) {
	"use strict";
	var thisObj, triggerFS, ui;

	thisObj = this;
	g.thisObj = thisObj;

	this.SelectBtn = function (btn) {
		ui.FullScreen();

		switch (btn.textkey) {
		case 'Back':
			game.state.start('Credits');
			break;
		case 'Resume':
			game.state.start('Main');
			break;
		case 'NewGame':
			//dbX.Set('resumeGame', 0);
			game.state.start('Levels');
			break;
		}
	};
	this.preload = function () {
	};
	this.create = function () {
		ui = new Ivx.UI(game);

		//ivanix todo: deprecate
		//Ivx.Lang.Init(game.cache.getText('lang'));
		
		game.add.sprite(0, 0, 'title');
		ui.Btn('NewGame', 550, 50);
		if (dbX.Get('resumeGame') === 1) {
			ui.Btn('Resume', 550, 390);
		}
		ui.Btn('Back', 50, 390);

		//ui.SelectBtn = function (btn) { thisObj.SelectBtn(btn); };
		ui.SelectBtn =  thisObj.SelectBtn;

		console.debug('created');
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
