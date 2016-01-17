/*jslint nomen: true */
/*global
 K: true,
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
Scene.Credits = function (game) {
	"use strict";
	var thisObj, rsc,
		sCredits, ui,
		btnList;

	thisObj = this;
	btnList = {};
	g.thisObj = thisObj;

	this.AddItem = function (textkey, x, y) {
		var key, btn, label, ctrx;

		key = x + ',' + y;
		if (btnList[key]) {
			if (textkey === '') {
				btnList[key].kill();
				return;
			}
			btnList[key].revive();
			btnList[key].children[0].text = Ivx.Lang.Str(textkey);
			btnList[key].textkey = textkey;
			return;
		}

		ctrx = Math.floor(game.world.width / 2);

		btn = game.add.button(x, y,
			'button',
			function () { thisObj.AddItemSelect(btn); },
			this, 1, 0, 2, 1
			);
		btn.textkey = textkey;
		label = game.add.text(100, 20, Ivx.Lang.Str(textkey), K.StyleMenu);
		btn.addChild(label);
		btn.fixedToCamera = true;
		label.anchor.set(0.5);

		g.btn[textkey] = btn;
		btnList[key] = btn;
		
	};
	this.startGame = function () {
		game.state.start('Play');
	};
	this.menuResume = function (btn) {
		thisObj.AddItem('NewGame', 550, 50);
		thisObj.AddItem('Resume', 550, 390);
		thisObj.AddItem('', 50, 390);
	};
	this.AddItemSelect = function (btn) {
		switch (btn.textkey) {
		case 'Next':
			game.state.start('Resume');
			break;
		case 'Back':
			game.state.start('Splash');
			break;
		}
	};
	this.preload = function () {
		rsc = "rsc/media/";
		//game.load.image('credits', rsc + 'credits.png');
		game.load.image('redfish', rsc + 'redfish.png');
		game.load.image('bluefish', rsc + 'bluefish.png');
		
	};
	this.create = function () {
		var red, blue;
		btnList = {};
		Ivx.Lang.Init(game.cache.getText('lang'));
		game.add.sprite(0, 0, 'title');
		//sCredits = game.add.sprite(0, 0, 'credits');
		sCredits = game.add.sprite(0, 0, 'greenbg');
		//sCredits.kill();
		red = game.add.sprite(50, 50, 'redfish');
		blue = game.add.sprite(640, 50, 'bluefish');

		this.AddItem('Back', 50, 390);
		this.AddItem('Next', 550, 390);

		ui = new Ivx.UI(game);

		ui.Title('Credits');

		ui.TextCtr('Game Code and Artwork', 100, K.StyleH3);
		ui.TextCtr('Ivanix Mobile LLC', 140, K.StyleH3);

		ui.TextCtr('Sudoko Generator', 200, K.StyleH3);
		ui.TextCtr('David J. Rager', 240, K.StyleH3);

		ui.TextCtr('Powered By Phaser', 300, K.StyleH3);

		console.debug('created');
		game.renderDirty = true;
	};
	this.update = function () {
		game.renderOnPointerChange();
	};


};
