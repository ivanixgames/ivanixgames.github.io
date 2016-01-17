/*jslint nomen: true */
/*global
 Ivx: true,
 K: true,
 Phaser: true,
 Scene: true,
 window: true,
 console: true,
 dbX: true,
 g: true
*/
g = {};
g.btn  = [];
Scene.Levels = function (game) {
	"use strict";
	var thisObj, triggerFS, compLevel, maxLevel, menu, ui;

	thisObj = this;
	g.thisObj = thisObj;

	this.SelectItem = function (btn) {

		ui.FullScreen();
		if (btn.num < maxLevel) {
			dbX.Set('selectLevel', btn.num);
			dbX.Set('resumeGame', 0);
			game.state.start('Main');
		}

	};
	this.AddItem = function (num) {
		var key, btn, label, x, y, xf, yf, mod;

		mod = 3;
		xf = 200;
		yf = 100;
	
		x = 120 + ((num - 1) % mod) * xf;
		y = 70 + Math.floor((num - 1) / mod) * yf;

		if (num < maxLevel) {
			btn = game.add.button(x, y,
				'levelbtn',
				function () { thisObj.SelectItem(btn); },
				this, 1, 0, 2, 1
				);
			label = game.add.text(50, 50, num, K.StyleLevel);
		} else {
			btn = game.add.button(x, y,
				'levelbtn',
				function () { thisObj.SelectItem(btn); },
				this, 3, 3, 3, 3
				);
			label = game.add.text(50, 50, num, K.StyleLevelBlocked);
		}
		btn.num = num;
		btn.addChild(label);
		btn.fixedToCamera = true;
		label.anchor.set(0.5);

		
	};
	this.preload = function () {
		var rsc;
		rsc = "rsc/media/";
		game.load.spritesheet('levelbtn', rsc + 'levelbtn.png', 150, 100);

	};
	this.create = function () {
		var i;
		console.debug('created');
		menu = new Ivx.Menu(game);
		ui = new Ivx.UI(game);

		//ivanix todo: deprecate
		//Ivx.Lang.Init(game.cache.getText('lang'));
		
		compLevel = dbX.Get('compLevel');
		if (compLevel === null) {
			compLevel = 0;
			dbX.Set('compLevel', compLevel);
		}
		maxLevel = compLevel + 2;

		game.add.sprite(0, 0, 'greenbg');

		for (i = 1; i < 10; i += 1) {
			thisObj.AddItem(i);
		}

		menu.AddItem('Back', 50, 390);
		menu.SelectItem = function (btn) {
			game.state.start('Resume');
		};
		ui.Title('SelectLevel');

		game.renderDirty = true;
		triggerFS = true;
	};
	this.update = function () {
		game.renderOnPointerChange();
	};

};
