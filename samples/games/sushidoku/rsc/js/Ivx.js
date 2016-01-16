/*global
	g: true, K: true,
	KTYPE: true,
	Phaser: true,
	ivx: true,
	xprint: true,
	window: true,
	document: true;
	console: true
*/
g = {};
/*ivanix todo: remove g.btn
 */
g.btn  = [];

var Ivx = Ivx || {};
Ivx.lang = Ivx.lang || [];
Ivx.Lang = {
	Init: function (jtext) {
		//"use strict";
		Ivx.lang = JSON.parse(jtext);
	},
	Str: function (textkey) {
		"use strict";
		if (Ivx.lang[textkey]) {
			return Ivx.lang[textkey];
		}
		return textkey;
	}
};
Ivx.inherit = function (sub, xsuper) {
	"use strict";
	var newSubPrototype = Object.create(xsuper.prototype);
	newSubPrototype.constructor = sub;
	sub.prototype = newSubPrototype;
};
Ivx.Menu = function (game) {
	"use strict";
	var thisObj, rsc, btnList;

	thisObj = this;
	btnList = {};
	g.thisObj = thisObj;
		

	this.SelectItem = function (btn) {
		//override
	};
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
			function () { thisObj.SelectItem(btn); },
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

};
Ivx.UI = function (game) {
	"use strict";
	var thisObj, rsc, btnList;

	thisObj = this;
	this.game = game;
	btnList = {};
		
	this.Title = function (str) {
		var bg, fgText;
			
		fgText = thisObj.game.add.text(400, 40, '', K.StyleH2);
		fgText.anchor.set(0.5, 0.5);
		fgText.fixedToCamera = true;
		fgText.text = Ivx.Lang.Str(str);
		thisObj.displayText = fgText;
		game.renderDirty = true;

	};
	this.TextCtr = function (str, y, style) {
		var bg, fgText;
			
		fgText = thisObj.game.add.text(400, y, '', style);
		fgText.anchor.set(0.5, 0.5);
		fgText.fixedToCamera = true;
		fgText.text = Ivx.Lang.Str(str);
		thisObj.displayText = fgText;
		game.renderDirty = true;

	};
	this.SelectBtn = function (btn) {
		//override
	};
	this.Btn = function (textkey, x, y) {
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
			function () { thisObj.SelectBtn(btn); },
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
	this.FullScreenTO = function () {

		game.scale.refresh();
		game.renderDirty = true;
	};
	this.FullScreen = function () {
		game.scale.startFullScreen();
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.scale.setExactFit();
			
		window.setTimeout(function () { thisObj.FullScreenTO(); }, 100);
	};
	this.LeftLandscape = function () {
		console.debug('LeftLandscape');
		document.getElementById('owrap').style.display = 'block';
	};
	this.EnteredLandscape = function () {
		console.debug('EnteredLandscape');
		document.getElementById('owrap').style.display = 'none';

	};
	this.ForceLandscape = function () {
		game.scale.forceLandscape = true;
		game.scale.enterIncorrectOrientation.add(thisObj.LeftLandscape, this);
		game.scale.leaveIncorrectOrientation.add(thisObj.EnteredLandscape, this);
	};

};
