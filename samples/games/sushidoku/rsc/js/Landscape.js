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
Scene.Landscape = function (game) {
	"use strict";
	var thisObj;

	thisObj = this;

	this.DisplayField = function (labelStr, lx, vx) {
		var grp;
		grp = {};
		grp.label = game.add.text(lx, 0, '', K.StyleField);
		grp.label.anchor.set(1, 0);
		grp.label.fixedToCamera = true;
		grp.label.text = Ivx.Lang.Str(labelStr);
		return grp;
	};
	this.SelectItem = function (btn) {
		switch (btn.textkey) {
		case 'OK':
			game.state.start(thisObj.callerScence);
			break;
		}
	};

	this.preload = function () {
		
	};
	this.create = function () {
		game.add.sprite(0, 0, 'greenbg');

		thisObj.DisplayText('PleaseRotateLandscape');
		game.renderDirty = true;
	};
	this.update = function () {
		game.renderOnPointerChange();
	};


};
