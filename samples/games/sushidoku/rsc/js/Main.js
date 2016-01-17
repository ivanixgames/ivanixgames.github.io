/*global
 console: true, g: true,
 dbFloat: true,
 dbMatrix: true,
 dbX: true,
 window: true,
 Ivx: true,
 K: true,
 Phaser: true,
 Scene: true,
 Sudoku: true
*/
Ivx.SushiSprite = function (school) {
	"use strict";
	var thisObj;
	thisObj = this;

	this.school = school;
	this.game = school.game;
	Phaser.Group.call(this, this.game);
	this.isox = -100;
	this.isoy = -50;
	this.ticker = 0;
	this.speed = 4;
	this.spdiv = 6;
	this.tilew = 128;
	this.tileh = 64;
	this.dir = 0;
	this.setXY = function (x, y) {
		this.fixedToCamera = false;
		this.x = x;
		this.y = y;
		this.fixedToCamera = true;
		this.game.renderDirty  = true;
	};
	this.fixToLayer = function (layer) {
		var px, py;
		
		px = (this.isox / this.tilew);
		py = (this.isoy / this.tileh);
		this.projx = (px - py) * this.tilew / 2;
		this.projy = (px + py) * this.tileh / 2;

		this.setXY(layer.projx + this.projx, layer.projy - 590 + this.projy);
	};
	this.floatSouthEast = function () {
		if (this.isox > 1500) {
			this.dir = 1;
			this.spdiv *= 2;
			return;
		}
		this.isox += this.speed;
	};
	this.floatSouthWest = function () {
		if (this.isoy > 750) {
			this.dir = 2;
			this.spdiv = this.spdiv / 2;
			return;
		}
		this.isoy += this.speed;
	};
	this.floatNorthWest = function () {
		if (this.isox < -100) {
			this.dir = 3;
			this.spdiv *= 2;
			return;
		}
		this.isox -= this.speed;
	};
	this.floatNorthEast = function () {
		if (this.isoy < -50) {
			this.dir = 0;
			this.spdiv = this.spdiv / 2;
			return;
		}
		this.isoy -= this.speed;
	};
	this.reset = function () {
		thisObj.color = K.TileGreen;
		thisObj.spriteTop.loadTexture('board', K.TileFloatTop + thisObj.color);
		thisObj.spriteSushi.kill();
		thisObj.spriteActive.kill();
	};
	this.kill = function () {
		thisObj.spriteSushi.kill();
		thisObj.spriteTop.kill();
		//ivanix todo: if spriteActive visible, deactive first global.
		thisObj.spriteActive.kill();
	};
	this.revive = function () {
		thisObj.spriteTop.revive();
		thisObj.spriteSushi.revive();
		thisObj.spriteActive.revive();
		thisObj.spriteActive.visible = false;
	};
	this.updateHealth = function () {
/*
K.TileWhite = 0;
K.TileYellow = 1;
K.TileGreen = 2;
K.TileCyan = 3;
K.TileAqua = 4;
K.TilePink = 5;
K.TileRed = 6;
K.TileOrange = 7;
*/
/*
		if (thisObj.ticker < K.SushiHealthTick) 
*/

		if (thisObj.ticker < thisObj.school.healthtick) {
			return;
		}
		thisObj.ticker = 0;
		if (thisObj.isox < -100) {
			return;
		}
		switch (thisObj.color) {
		case K.TileWhite:
			thisObj.color = K.TileAqua;
			break;
		case K.TileAqua:
			thisObj.color = K.TileYellow;
			break;
		case K.TileYellow:
			thisObj.color = K.TileOrange;
			break;
		case K.TileOrange:
			thisObj.color = K.TileRed;
			thisObj.spriteSushi.kill();
			thisObj.spriteActive.kill();
			thisObj.school.scene.LifeUpdate(-1);
			break;
		case K.TileGreen:
			thisObj.color = K.TileAqua;
			//ivanix todo:  revive with new random sushi
			thisObj.ticker = Math.floor(Math.random() * 1000);
			thisObj.sushi = Math.floor(Math.random() * 9);
			thisObj.spriteSushi.loadTexture('sushi', thisObj.sushi);
			thisObj.revive();
			break;
		}
		thisObj.spriteTop.loadTexture('board', K.TileFloatTop + thisObj.color);
	};
	this.updateCoords = function () {
		this.ticker += 1;
		if (this.ticker % this.spdiv !== 0) {
			return;
		}
		switch (this.dir) {
		case 0:
			this.floatSouthEast();
			break;
		case 1:
			this.floatSouthWest();
			break;
		case 2:
			this.floatNorthWest();
			break;
		case 3:
			this.floatNorthEast();
			break;
		}
		this.game.renderDirty =  true;
		this.updateHealth();
		
	};
	this.selectActive = function (sprite, event) {
		var scene;
		thisObj.school.scene.SwitchActive(thisObj, true);
	};
	this.buildComposite = function (sushi, color) {

		//sushi = Math.floor(Math.random() * 9);
		this.sushi = sushi;
		this.color = color;
		
		this.spriteActive  = this.create(0, 0, 'board', K.TileFloatActive);
		this.spriteActive.visible = false;

		this.spriteSushi = this.create(0, 0, 'sushi', sushi);
		this.spriteSushi.inputEnabled = true;
		this.spriteSushi.events.onInputUp.add(thisObj.selectActive, this);

		this.spriteTop  = this.create(0, 0, 'board', K.TileFloatTop + color);
		this.fixedToCamera = false;
		this.isox -= this.school.sushiArr.length * 305;
		this.ticker = Math.floor(Math.random() * 1000);
	};
};
Ivx.inherit(Ivx.SushiSprite, Phaser.Group);
Ivx.SushiSchool = function (scene, layerBoard, level) {
	"use strict";
	var thisObj, group, calc;
	thisObj = this;

	this.scene = scene;
	this.game = scene.game;
	this.layerBoard = layerBoard;
	this.sushiArr = [];
	this.sushiLast = null;
	this.level = level;

	calc = (K.SushiHealthTick * (K.MaxLevel - this.level));
	this.healthtick = K.SushiHealthMin + calc;


	this.SetSpeed = function (grp) {
		var spdiv, speed, vdelay;
		//ivanix todo: calc speed and spdiv based on level and device
		//  some device not powerfull for fast smooth.

		vdelay = 2 + Math.floor((K.MaxLevel - this.level) / 2);
		grp.spdiv = (1 + (grp.dir % 2)) * vdelay;
		grp.speed = 2 + Math.floor(this.level / 4);
		
	};
	this.Update = function () {
		var i;
		for (i = 0; i < this.sushiArr.length; i += 1) {
			this.sushiArr[i].updateCoords();
			this.sushiArr[i].fixToLayer(g.layerBoard);
		}
	};
//ivanix: wip
	this.Save = function () {
		var i, piece;
		for (i = 0; i < this.sushiArr.length; i += 1) {
			piece = this.sushiArr[i];
			
			dbFloat.Set(i,
				piece.sushi,
				piece.color,
				piece.isox,
				piece.isoy,
				piece.ticker,
				piece.dir,
				piece.spdiv
				);

		}
	};
	this.Load = function () {
		var i, rec, grp, dead;
		dead = 0;
		for (i = 0; i < this.sushiArr.length; i += 1) {
			rec = dbFloat.Get(i);
			grp = this.sushiArr[i];
			grp.sushi = rec.sushi;
			grp.color = rec.color;
			grp.isox = rec.isox;
			grp.isoy = rec.isoy;
			grp.ticker = rec.ticker;
			grp.dir = rec.dir;
			//grp.spdiv = rec.spdiv;
			thisObj.SetSpeed(grp);

			grp.spriteSushi.loadTexture('sushi', grp.sushi);
			grp.spriteTop.loadTexture('board', K.TileFloatTop + grp.color);
			if (grp.color === K.TileGreen) {
				grp.spriteSushi.kill();
				grp.spriteActive.kill();
			}
			if (grp.color === K.TileRed) {
				grp.spriteSushi.kill();
				grp.spriteActive.kill();
				dead += 1;
			}
		}
		return dead;
	};
	this.Pos = function (idx, isox, isoy, dir, vdelay) {
		var grp;
		grp = this.sushiArr[idx];
		grp.isox = isox;
		grp.isoy = isoy;
		grp.dir = dir;
		//grp.spdiv = spdiv;
		//grp.spdiv = (1 + (dir % 2)) * vdelay;
		thisObj.SetSpeed(grp);
	};
	this.InitPos = function (vdelay) {
		this.Pos(0, 932, 752, 2, vdelay);
		this.Pos(1, 1233, 752, 2, vdelay);
		this.Pos(2, 1502, 734, 1, vdelay);
		this.Pos(3, 1501, 582, 1, vdelay);
		this.Pos(4, 1502, 430, 1, vdelay);
		this.Pos(5, 1501, 278, 1, vdelay);
		this.Pos(6, 1502, 124, 1, vdelay);
		this.Pos(7, 1501, -28, 1, vdelay);
		this.Pos(8, 1246, -52, 0, vdelay);
		this.Pos(9, 941, -52, 0,  vdelay);
		this.Pos(10, 634, -52, 0, vdelay);
		this.Pos(11, 333, -52, 0, vdelay);
		this.Pos(12, 24, -52, 0,  vdelay);

		this.Pos(13, -101, 34, 3,  vdelay);
		this.Pos(14, -102, 188, 3, vdelay);
		this.Pos(15, -101, 340, 3, vdelay);
		this.Pos(16, -102, 492, 3, vdelay);
		this.Pos(17, -101, 646, 3, vdelay);

		this.Pos(18, -12, 752, 2, vdelay);
		this.Pos(19, 293, 752, 2, vdelay);
		this.Pos(20, 596, 752, 2, vdelay);

	};
	this.Init = function () {
		var sushi, color, i;

		for (i = 0; i < K.SushiMax; i += 1) {
			group = new Ivx.SushiSprite(thisObj);
			//sushi = Math.floor(Math.random() * 9);
			sushi = i % 9;
			//color = Math.floor(Math.random() * 8);
			color = K.TileWhite;
			//group.buildComposite(sushi, color, K.TileFloatActive, K.TileFloatTop);
			group.buildComposite(sushi, color);
			this.sushiArr.push(group);
		}
		this.sushiLast = group;
		this.InitPos(6);
	};
	this.Init();

};
Scene.Main = function (game) {
	"use strict";
	var thisObj, map, marker, cursors, step,
		activeHudTile, activeBoardTile,
		layerHud, layerHudActive, layerHudLayout, layerHudBg,
		layerBoard, layerBoardActive, layerBoardDish,
		layerBoardLayout, layerTable,
		layerFloat1, layerFloat2, layerFloat3, layerFloat4,
		groupHudMenu, groupHudRemove,
		scalex, scaley,
		mx, my, ct, rsc,
		eventSelect, eventBoardDrag, eventHudDrag,
		mapName, boardName,

		lifeGrp,
		levelGrp,

		scoreGrp,
		openCells,

		firstClick,
		music,
		sfx,
		hintcells;

	thisObj = this;
	g.thisScene = thisObj;
	g.game = game;


	this.preload =  function () {
		thisObj.Init();
		thisObj.Preload();
	};
	this.create =  function () {
		thisObj.Create();
	};
	this.update = function () {
		thisObj.Update();
	};
	this.render = function () {
		thisObj.Render();
	};
	this.paused = function () {
		console.debug('Scene.Main: Pausing');
		thisObj.Save();
	};
	this.shutdown = function () {
		console.debug('Scene.Main: Shutdown');
		thisObj.Save();
		music.stop();
	};
	this.Save = function () {
		console.debug('Scene.Main: Saving');
		dbX.Set('resumeGame', 1);
		thisObj.SavePuzzle();
		thisObj.school.Save();
	};

	this.DisplayField = function (labelStr, lx, vx, value) {
		var grp;
		grp = {};
		grp.value = value;
		grp.label = game.add.text(lx, 0, '', K.StyleField);
		grp.label.anchor.set(1, 0);
		grp.label.fixedToCamera = true;
		grp.label.text = Ivx.Lang.Str(labelStr);

		grp.field = game.add.text(vx, 0, '', K.StyleField);
		grp.field.anchor.set(1, 0);
		grp.field.fixedToCamera = true;
		grp.field.text = value;
		return grp;
	};

	this.HasHint =  function (x, y) {
		if (hintcells[x + ',' + y]) {
			return true;
		}
		return false;
	};
	this.MarkHint = function (x, y) {
		hintcells[x + ',' + y] = true;
	};

	this.Preload = function () {

		game.load.tilemap('map',
			mapName + '.json?nc=23423', null,
			Phaser.Tilemap.TILED_JSON
			);
		game.load.spritesheet('board', rsc + 'board.png?', 128, 96);
		game.load.spritesheet('sushi', rsc + 'sushi.png?', 128, 96);
		game.load.image('bg', rsc + 'bg.png');
		game.load.audio(
			'music',
			rsc + 'audio/music.m4a'
		);
			// rsc + 'audio/music.mp3',
			// rsc + 'audio/music.ogg'
			// rsc + 'audio/music.m4a'
		game.load.audio(
			'sfx',
			rsc + 'audio/sfx1.mp3',
			rsc + 'audio/sfx1.ogg'
		);
			//rsc + 'audio/music.m4a'
			//rsc + 'audio/music.m4a'
			//rsc + 'audio/music.wav',
			//rsc + 'audio/music.ogg',
	
	};

	this.OnPointerDownBoard = function (dx, dy) {
		game.renderDirty = true;
		if (mx !== null) {
			game.camera.x += mx - dx;
			game.camera.y += my - dy;
			eventBoardDrag = true;
		} else {
			eventSelect = true;
		}
		if (mx !== null || my !== null) {
			if (mx !== dx || my !== dy) {
				eventSelect = false;
			}
		}
		
		mx = dx;
		my = dy;

	};
	this.OnPointerDownHud = function (dx, dy) {
		game.renderDirty = true;
		if (mx !== null) {
			eventHudDrag = true;
		} else {
			eventSelect = true;
		}
		mx = dx;
		my = dy;

	};
	this.BlinkNotAllowedEnd = function (col, row) {
		console.debug('BlinkNotAllowedEnd');
		map.putTile(K.TileBlank, col, row, layerBoardActive);
		game.renderDirty = true;
	};
	this.BlinkNotAllowed = function (col, row, tileOffset) {
		var bgtile, idx;
		console.debug('BlinkNotAllowed');
		bgtile = map.getTile(col, row, layerBoardLayout);
		idx = bgtile.index + tileOffset;
		map.putTile(idx, col, row, layerBoardActive);
		window.setTimeout(function () { thisObj.BlinkNotAllowedEnd(col, row); }, K.BlinkTO);
	};
	this.EmptyCell = function (row, col) {
		thisObj.DrawTileBlank(row, col);
		thisObj.puzzle.setVal(row, col, 0);
	};
	this.FillCell = function (idx, row, col) {
		var val, cval, rc;
		val = idx % 10;
		cval = thisObj.puzzle.getVal(row, col);
/*
		if (val === cval) {
			console.debug('Conflict Found: Same Value');
			thisObj.BlinkNotAllowed(col, row, K.TileConflict);
			return false;
		}
*/
		if (cval !== 0) {
			console.debug('Conflict Found: Cell Not Blank');
			thisObj.BlinkNotAllowed(col, row, K.TileConflict);
			return false;
		}
		console.debug('FillCell: idx: ' + idx + '  val: ' + val);
		if (thisObj.puzzle.checkVal(row, col, val)) {
			dbMatrix.Set(row, col, val, 0);
			thisObj.DrawTileNormal(row, col, val);
			rc = thisObj.puzzle.setVal(row, col, val);
			thisObj.ScoreUpdate(1);
			//thisObj.OpenCellUpdate(1);
			thisObj.StatsUpdate(rc);
			return true;
		} else {
			console.debug('Conflict Found');
			thisObj.BlinkNotAllowed(col, row, K.TileConflict);
			return false;
		}
		
	};
	this.OnTileSelectBoard = function (tx, ty) {
		var row, col, num, idx;


		activeBoardTile = map.getTile(tx, ty, layerBoard);
		//ivanix debug
		g.activeBoardTile = activeBoardTile;
		g.activeHudTile = activeHudTile;
		//note: activeBoardTile can be  (undefined || null)
		if (activeBoardTile) {
			if (thisObj.HasHint(tx, ty)) {
				thisObj.BlinkNotAllowed(tx, ty, K.TileConflictHint);
			} else {
				//note: try to add piece to puzzle
				//todo: check if activeHudTile is 'remove'
				if (thisObj.activeGroup === null) {
					return;
				}
				if (thisObj.activeSushi) {
					num = thisObj.activeGroup.spriteSushi.frame;
					idx = 1 + num +  K.TileSushi;
					if (thisObj.FillCell(idx, ty, tx)) {
						thisObj.activeGroup.reset();
						thisObj.SwitchActive(null, false);
					}
				} else {
					if (activeBoardTile.index !== K.TileBlank) {
						//note: Remove sushi from selected tile
						//      Decrement score
						console.debug('removing tile');
						console.debug('activeBoardTile.index: ' + activeBoardTile.index);
						console.debug('K.TileBlank: ' + K.TileBlank);
						thisObj.EmptyCell(ty, tx);
						// thisObj.OpenCellUpdate(-1);
						sfx.play('tileremove');
						thisObj.ScoreUpdate(-10);
						thisObj.SwitchActive(null, false);
					}
				}
			}
		}
	};

	this.UpdateBoardEvent = function (px, py) {
		var layer, offx, offy, tileW, tileH,
			pwx, pwy,
			ax, ay, dx, dy,
			gx, gy,
			hx, hy,
			voffx, voffy,
			scrollX, scrollY,
			isx, isy, tx, ty;

		layer = layerBoard;

		offx = layer.iso.offsetX;
		offy = layer.iso.offsetY;

		tileW = map.tileWidth;
		tileH = map.tileHeight;
	    
		voffx = Math.floor(offx + (tileW / 2));
		voffy = Math.floor(offy + K.TileH - (tileW / 2));

		pwx = game.input.activePointer.worldX;
		pwy = game.input.activePointer.worldY;

		ax = px;
		ay = py - voffy;

		dx =  (tileW / tileH) * ay + ax - offx;
		dy =  ay - (tileH / tileW) * (ax - offx);
	
		isx = Math.floor(dx - tileW / 2) + layer.scrollX;
		isy = Math.floor(dy + tileH / 2) + layer.scrollY;
		
	    tx = layer.getTileX(isx);
	    ty = layer.getTileY(isy);
	
		if (game.input.activePointer.isDown) {
			thisObj.OnPointerDownBoard(dx, dy);
	    } else {
			eventBoardDrag = false;
			if (eventSelect) {
				game.renderDirty = true;
//ivanix: debug 
/*
				console.debug('eventSelect: '
					+ ' (scrollX,scrollY): (' + layer.scrollX + ',' + layer.scrollY + ')'
					+ ' (offx,offy): (' + offx + ',' + offy + ')'
					+ ' (voffx,voffy): (' + voffx + ',' + voffy + ')'
					+ ' (px,py): (' + px + ',' + py + ')'
					+ ' (pwx,pwy): (' + pwx + ',' + pwy + ')'
					+ ' (ax,ay): (' + ax + ',' + ay + ')'
					+ ' (dx,dy): (' + dx + ',' + dy + ')'
					+ ' (isx,isy): (' + isx + ',' + isy + ') '
					+ ' (tx,ty): (' + tx + ',' + ty + ')'
					);
*/
				if (isx < 0 || isy < 0 || isx > K.MaxIsoX || isy > K.MaxIsoY) {
					console.debug('eventSelect: out of bounds');
				} else {
					thisObj.OnTileSelectBoard(tx, ty);
				}

			}
			mx = null;
			my = null;
			eventSelect = false;
		}
		game.renderOnPointerChange();
	
	};
	this.Update = function () {
		var	px, py, ix, iy;
		if (thisObj.wait === true) {
			return;
		}

		
		px = Math.floor(game.input.activePointer.x);
		py = Math.floor(game.input.activePointer.y);

		if (game.input.activePointer.isDown) {
			if (firstClick) {
				console.debug('Update: px,py:(' + px + ',' + py + ')');
				firstClick = false;
			}
		} else {
			if (game.input.activePointer.isUp && !firstClick) {
				console.debug('PointerUp and !firstClick');
			}
			firstClick = true;
		}
		
		thisObj.UpdateBoardEvent(px, py);

		thisObj.school.Update();
		game.renderOnPointerChange();
	
	};
	this.Render = function () {
	};
	this.DrawTileBlank = function (row, col) {
		map.putTile(K.TileBlank, col, row, layerBoard);
		map.putTile(K.TileBlank, col, row, layerBoardDish);
	};
	this.DrawTileHint = function (row, col, num) {
		var idx, gtile;
		idx = num +  K.TileSushi;
		map.putTile(idx, col, row, layerBoard);
		gtile = map.getTile(col, row, layerBoardLayout);
		if (gtile && gtile.index) {
			map.putTile(gtile.index + K.TileHint, col, row, layerBoardDish);
		}
		thisObj.MarkHint(col, row);
	};
	this.DrawTileNormal = function (row, col, num) {
		var idx, gtile;
		idx = num +  K.TileSushi;
		map.putTile(idx, col, row, layerBoard);

		gtile = map.getTile(col, row, layerBoardLayout);
		if (gtile && gtile.index) {
			map.putTile(gtile.index + K.TileDish, col, row, layerBoardDish);
		}
	};
	this.DrawTile = function (row, col, num, hint) {
		var idx, gtile;
		if (num === 0) {
			thisObj.DrawTileBlank(row, col);
		} else {
			if (hint) {
				thisObj.DrawTileHint(row, col, num);
			} else {
				thisObj.DrawTileNormal(row, col, num);
			}
		}
	};
	this.LoadPuzzle = function () {
		var puzzle;
		puzzle = thisObj.puzzle;
		puzzle.matrix = dbX.Get('matrix');
		puzzle.hints = dbX.Get('hints');
		puzzle.openrows  = dbX.Get('openrows');
		puzzle.opencols  = dbX.Get('opencols');
		puzzle.opensqr  = dbX.Get('opensqr');
		puzzle.opencells  = dbX.Get('opencells');
	/*
		var col, row, rec, s, matrix, i;
		for (row = 0; row < 9; row += 1) {
			for (col = 0; col < 9; col += 1) {
				rec = dbMatrix.Get(row, col);
				i = (row * 9) + col;
				thisObj.puzzle.matrix[i] = rec.value;
				thisObj.puzzle.hints[i] = rec.hint;
			}
		}
	*/
		thisObj.FinishPuzzle();
	};
	this.SavePuzzle = function () {
		var puzzle;
		puzzle = thisObj.puzzle;
		dbX.Set('matrix', puzzle.matrix);
		dbX.Set('hints', puzzle.hints);
		dbX.Set('openrows', puzzle.openrows);
		dbX.Set('opencols', puzzle.opencols);
		dbX.Set('opensqr', puzzle.opensqr);
		dbX.Set('opencells', puzzle.opencells);

/*
		var i, col, row, matrix, hints;
		matrix = thisObj.puzzle.matrix;
		hints = thisObj.puzzle.hints;
		
		for (i = 0; i < matrix.length; i += 1) {
			col = i % 9;
			row = Math.floor(i / 9);
			dbMatrix.Set(row, col, matrix[i], hints[i]);
		}
*/
	};
	this.NewPuzzle = function () {
		var level;
		level = dbX.Get('selectLevel');
		dbX.Set('resumeLevel', level);
		thisObj.puzzle.xdone = function () {thisObj.FinishNewPuzzle(); };
		thisObj.puzzle.newGame(level);
	};
	this.CreatePuzzle = function () {
		thisObj.puzzle = new Sudoku();
		thisObj.puzzle.hints = [];
		g.puzzle = thisObj.puzzle;
		thisObj.TextDisplay('Please Wait');
		thisObj.wait = true;

		if (dbX.Get('resumeGame') === 1) {
			thisObj.LoadPuzzle();
			//note: LoadPuzzle calls FinishPuzzle();
		} else {
			thisObj.NewPuzzle();
			//note: NewPuzzle calls FinishPuzzle();
		}
	};
	this.FinishNewPuzzle = function () {
		var i, matrix;
	/*
		matrix = thisObj.puzzle.matrix;
		for (i = 0; i < matrix.length; i += 1) {
			thisObj.puzzle.hints[i] = matrix[i] && 1;
		}
	*/
		thisObj.FinishPuzzle();
		thisObj.puzzle.statInit();
	};
	this.FinishPuzzle = function () {
		thisObj.TextHide();
		thisObj.CreateDone();
	};
	this.DrawPuzzle = function () {
		var i, col, row, matrix, hints, oc;
		oc = 0;
		matrix = thisObj.puzzle.matrix;
		hints =  thisObj.puzzle.hints;
		for (i = 0; i < matrix.length; i += 1) {
			if (matrix[i] === 0) {
				oc += 1;
			}
			col = i % 9;
			row = Math.floor(i / 9);
			thisObj.DrawTile(row, col, matrix[i], hints[i]);
		}
		//thisObj.OpenCellInit(oc);
	};
	this.TextDisplay = function (str) {
		var bg, fgText,
			bgStyle, bgText;
		fgText = thisObj.game.add.text(400, 240, '', K.StyleDisplay);
		fgText.anchor.set(0.5, 0.5);
		fgText.fixedToCamera = true;
		fgText.text = str;
		thisObj.displayText = fgText;
		game.renderDirty = true;

	};
	this.TextHide = function () {
		thisObj.displayText.visible = false;
		game.renderDirty = true;
	};
	this.NextLevel = function () {
		/*
		if (levelGrp.value < 9) {
			dbX.Set('selectLevel', levelGrp.value + 1);
			game.state.start('Main');
		}
		*/
		game.state.start('Levels');
	};
	this.GameWon = function () {
		var compLevel;
		sfx.play('gamewon');
		thisObj.TextDisplay('GameWon!');
		compLevel = dbX.Get('compLevel');
		if (levelGrp.value > compLevel) {
			dbX.Set('compLevel', levelGrp.value);
		}
		window.setTimeout(function () { thisObj.NextLevel(); }, K.GameWonTO);
		//ivanix todo: stop game actions
		// update completed level if less than stored value
	};
	this.GameOver = function () {
		sfx.play('gameover');
		thisObj.TextDisplay('GameOver');
		//ivanix todo: stop game actions
	};
	this.LifeUpdate = function (incr) {
		lifeGrp.value += incr;
			
		if (incr < 0) {
			sfx.play('bubbledie');
		}
		if (lifeGrp.value < 0) {
			lifeGrp.value = 0;
		}
		dbX.Set('life', lifeGrp.value);
		lifeGrp.field.text = lifeGrp.value;
		game.renderDirty = true;
		if (lifeGrp.value === 0) {
			console.debug('game over!');
			thisObj.GameOver();
		}
	};
	this.ScoreUpdate = function (incr) {
		scoreGrp.value += incr;
		if (scoreGrp.value < 0) {
			scoreGrp.value = 0;
		}
		dbX.Set('score', scoreGrp.value);
		scoreGrp.field.text = scoreGrp.value;
		game.renderDirty = true;
	};
			
	this.BonusOff = function (col, row) {
		console.debug('BonusOff');
		map.putTile(K.TileBlank, col, row, layerBoardActive);
		game.renderDirty = true;
	};
	this.BonusOn = function (col, row, tileOffset) {
		var bgtile, idx;
		console.debug('BonusOn');
		bgtile = map.getTile(col, row, layerBoardLayout);
		idx = bgtile.index + tileOffset;
		map.putTile(idx, col, row, layerBoardActive);
		window.setTimeout(function () { thisObj.BonusOff(col, row); }, K.BonusTO);
	};
	this.BonusSqr = function (stat, start, tog, hits) {
		var row, col, rstart, cstart, rplus, cplus;

		rstart = 3 * Math.floor(stat.rsi / 3);
		cstart = 3 * (stat.rsi % 3);
	
		rplus = Math.floor(start / 3);
		cplus = start % 3;
	
		row = rstart + rplus;
		col = cstart + cplus;

		if (tog) {
		console.debug('BonusSqr :' + start + ' : ' + hits);
			if (!start) {
				thisObj.BonusFx(hits);
			}
			thisObj.ScoreUpdate(3 * hits);
			thisObj.BonusOn(col, row, K.TileBonusOffset);
		} else {
			thisObj.BonusOff(col, row);
		}
		if (start < 8) {
			window.setTimeout(function () { thisObj.BonusSqr(stat, start + 1, tog, hits); }, K.BonusTO);
			return;
		}
		if (tog) {
			window.setTimeout(function () { thisObj.BonusSqr(stat, 0, false, hits); }, K.BonusTO);
			return;
		}
		//ivanix todo:  bonus on Sqr
		//then call StatsOC
		thisObj.StatsOC(stat);
	};
	this.BonusCol = function (stat, start, tog, hits) {
		var i;
		console.debug('BonusCol');
		if (tog) {
		console.debug('BonusCol :' + start + ' : ' + hits);
			if (!start) {
				thisObj.BonusFx(hits);
			}
			//thisObj.ScoreUpdate(hits);
			thisObj.ScoreUpdate(3 * hits);
			thisObj.BonusOn(stat.rcol, start, K.TileBonusOffset);
		} else {
			thisObj.BonusOff(stat.rcol, start);
		}
		if (start < 8) {
			window.setTimeout(function () { thisObj.BonusCol(stat, start + 1, tog, hits); }, K.BonusTO);
			return;
		}
		if (tog) {
			window.setTimeout(function () { thisObj.BonusCol(stat, 0, false, hits); }, K.BonusTO);
			return;
		}
		thisObj.StatsSqr(stat, hits + 1);
	};
	this.BonusRow = function (stat, start, tog, hits) {
		var i;
		console.debug('BonusRow');
		if (tog) {
		console.debug('BonusRow :' + start + ' : ' + hits);
			if (!start) {
				thisObj.BonusFx(hits);
			}
			//thisObj.ScoreUpdate(hits);
			thisObj.ScoreUpdate(3 * hits);
			thisObj.BonusOn(start, stat.rrow, K.TileBonusOffset);
		} else {
			thisObj.BonusOff(start, stat.rrow);
		}
		if (start < 8) {
			//thisObj.BonusRow(stat, start + 1, tog);
			window.setTimeout(function () { thisObj.BonusRow(stat, start + 1, tog, hits); }, K.BonusTO);
			return;
		}
		if (tog) {
			window.setTimeout(function () { thisObj.BonusRow(stat, 0, false, hits); }, K.BonusTO);
			return;
		}
		thisObj.StatsCol(stat, hits + 1);
	};
	this.StatsOC = function (stat) {
		console.debug('StatsOC');
		if (stat.oc) {
			thisObj.GameWon();
		}
	};
	this.StatsSqr = function (stat, hits) {
		console.debug('StatsSqr');
		if (stat.sqr) {
			thisObj.BonusSqr(stat, 0, true, hits);
		} else {
			thisObj.StatsOC(stat);
		}
	};
	this.StatsCol = function (stat, hits) {
		console.debug('StatsCol');
		if (stat.col) {
			thisObj.BonusCol(stat, 0, true, hits);
		} else {
			thisObj.StatsSqr(stat, hits);
		}
	};
	this.StatsRow = function (stat) {
		console.debug('StatsRow');
		if (stat.row) {
			thisObj.BonusRow(stat, 0, true, 1);
		} else {
			thisObj.StatsCol(stat, 1);
		}
	};
	this.BonusFx = function (hits) {
		console.debug('BonusFx: ' + hits);
		switch (hits) {
		case 0:
			sfx.play('1pt');
			break;
		case 1:
			sfx.play('9pt');
			break;
		case 2:
			sfx.play('18pt');
			break;
		case 3:
			sfx.play('27pt');
			break;
		
		}
	};
	this.StatsUpdate = function (stat) {
		console.debug('StatsUpdate');
		
		if (stat.row || stat.col || stat.sqr || stat.oc) {
			thisObj.StatsRow(stat);
		} else {
			thisObj.BonusFx(0);
		}
	};
	this.OpenCellInit = function (val) {
		openCells = val;
		g.oc = openCells;
	};
	this.OpenCellUpdate = function (incr) {
		openCells -= incr;
		g.od = openCells;
		if (openCells > 0) {
			return;
		}
		thisObj.GameWon();
	};
	this.Init = function () {
//init vars
		step = 4;
		activeHudTile = null;
		activeBoardTile = null;
		hintcells = {};
	//ivanix: debug
		g.hintcells = hintcells;
	
		mx = null;
		my = null;
		eventSelect = false;
		eventBoardDrag = false;
		eventHudDrag = false;
		firstClick = true;
		ct = null;
		rsc = 'rsc/media/';
		mapName = rsc + 'board';
		boardName = rsc + 'board';
		this.activeGroup = null;


	};
	this.InitFloat = function (layer) {

		layer.fixedToCamera = true;
		layer.iso.offsetY = K.BoardOffsetY - 100;
	    layer.resizeWorld();
		layer.floatx  = 0;
		layer.floaty  = 0;
		layer.trackx  = 0;
		layer.tracky  = 0;
	};
	this.floatSelected = function (sprite, event) {
		var active;
		console.debug('floatSelected');
		active = sprite.parent.spriteActive;
		if (active.visible) {
			active.visible = false;
		} else {
			active.visible = true;
		}
	};
	this.SwitchActive = function (groupSprite, activeSushi) {
		console.debug('SwitchActive');
		if (thisObj.activeGroup) {
			thisObj.activeGroup.spriteActive.visible = false;
		}
		thisObj.activeGroup = groupSprite;
		if (groupSprite !== null) {
			thisObj.activeGroup.spriteActive.visible = true;
		}
		thisObj.activeSushi = activeSushi;
	};
	this.SelectHudMenu = function (sprite, event) {
		console.debug('SelectHudMenu');
		thisObj.SwitchActive(sprite.parent, false);
		window.setTimeout(function () { game.state.start('Resume'); }, K.MenuTO);
	};
	this.SelectHudRemove = function (sprite, event) {
		console.debug('SelectHudRemove');
		thisObj.SwitchActive(sprite.parent, false);
		eventSelect = false;
	};
	this.CreateHudRemove = function (ypos) {
		var bg, active, icon;
		
		groupHudRemove = game.add.group();
		bg = groupHudRemove.create(0, ypos, 'board', K.TileHudBg);
		active  = groupHudRemove.create(0, ypos, 'board', K.TileHudActive);
		active.visible = false;
		icon = groupHudRemove.create(0, ypos, 'sushi', K.TileHudRemove);

		groupHudRemove.fixedToCamera = false;
		groupHudRemove.x = 800 - K.TileW - 20;
		groupHudRemove.y = 0;
		groupHudRemove.fixedToCamera = true;
		
		icon.inputEnabled = true;
		icon.events.onInputUp.add(thisObj.SelectHudRemove, this);
		groupHudRemove.spriteActive = active;

		g.groupHudRemove = groupHudRemove;
	};
	this.CreateHudMenu = function (ypos) {
		var bg, active, icon;
		
		groupHudMenu = game.add.group();
		bg = groupHudMenu.create(0, ypos, 'board', K.TileHudBg);
		active  = groupHudMenu.create(0, ypos, 'board', K.TileHudActive);
		active.visible = false;
		icon = groupHudMenu.create(0, ypos, 'board', K.TileHudMenu);

		groupHudMenu.fixedToCamera = false;
		groupHudMenu.x = 20;
		groupHudMenu.y = 0;
		groupHudMenu.fixedToCamera = true;
		
		icon.inputEnabled = true;
		icon.events.onInputUp.add(thisObj.SelectHudMenu, this);
		groupHudMenu.spriteActive = active;

		g.groupHudMenu = groupHudMenu;
	};
	this.CreateHud = function (ypos) {
		this.CreateHudRemove(ypos);
		this.CreateHudMenu(ypos);
	};
	this.Create = function () {
		var btn, btntxt, s, bg;

//game.stage.backgroundColor = "#3333FF";
		bg = game.add.sprite(0, 0, 'bg');
		bg.fixedToCamera = true;
//ivanix debug
		thisObj.CreatePuzzle();
	};
	this.CreateDone = function () {
		var dead, score, level;
		dead = 0;
		score = 0;

	    map = game.add.tilemap('map');
	    map.addTilesetImage('board', 'board');
	    map.addTilesetImage('sushi', 'sushi');

		level = dbX.Get('resumeLevel');
	
		thisObj.school = new Ivx.SushiSchool(thisObj, layerBoard, level);
		if (dbX.Get('resumeGame') === 1) {
			dead = thisObj.school.Load();
			score = dbX.Get('score');
		}
		g.school = thisObj.school;


	    layerTable = map.createLayer('layerTable');
		layerTable.fixedToCamera = false;
		layerTable.iso.offsetY = K.BoardOffsetY - 20;
	    layerTable.resizeWorld();
	
	    layerBoardLayout = map.createLayer('layerBoardLayout');
		layerBoardLayout.fixedToCamera = false;
		layerBoardLayout.iso.offsetY = K.BoardOffsetY;
	    layerBoardLayout.resizeWorld();

	    layerBoardDish = map.createLayer('layerBoardDish');
		layerBoardDish.fixedToCamera = false;
		layerBoardDish.iso.offsetY = K.BoardOffsetY;
	    layerBoardDish.resizeWorld();

	    layerBoardActive = map.createLayer('layerBoardActive');
		layerBoardActive.fixedToCamera = false;
		layerBoardActive.iso.offsetY = K.BoardOffsetY;
	    layerBoardActive.resizeWorld();

	    layerBoard = map.createLayer('layerBoard');
		layerBoard.fixedToCamera = false;
		layerBoard.iso.offsetY = K.BoardOffsetY;
	    layerBoard.resizeWorld();

		layerHudBg = map.createLayer('layerHudBg');
		layerHudBg.fixedToCamera = true;
		layerHudBg.visible = false;
		layerHudBg.iso.offsetY = K.HudOffsetY;
	    layerHudBg.resizeWorld();

		layerHudLayout = map.createLayer('layerHudLayout');
		layerHudLayout.fixedToCamera = true;
		layerHudLayout.visible = false;
		layerHudLayout.iso.offsetY = K.HudOffsetY;
		layerHudLayout.iso.offsetX = K.HudOffsetX;
	    layerHudLayout.resizeWorld();

		layerHudActive = map.createLayer('layerHudActive');
		layerHudActive.fixedToCamera = true;
		layerHudActive.visible = false;
		layerHudActive.iso.offsetY = K.HudOffsetY;
		layerHudActive.iso.offsetX = K.HudOffsetX;
	    layerHudActive.resizeWorld();

		layerHud = map.createLayer('layerHud');
		layerHud.fixedToCamera = true;
		layerHud.visible = false;
		layerHud.iso.offsetY = K.HudOffsetY;
		layerHud.iso.offsetX = K.HudOffsetX;
	    layerHud.resizeWorld();

//ivanix debug var
		g.map = map;
		g.layerBoardLayout = layerBoardLayout;
		g.layerHud = layerHud;
		g.layerBoard = layerBoard;
		g.layerHudBg = layerHudBg;
		g.layerHudLayout = layerHudLayout;
		g.layerHud = layerHud;

		thisObj.DrawPuzzle();

		thisObj.CreateHud(20);
			
		thisObj.wait = false;
		game.renderDirty = true;
		
		scalex = window.innerWidth / 800;
		scaley = window.innerHeight / 480;
	
		levelGrp = thisObj.DisplayField('Level', 100, 150, dbX.Get('resumeLevel'));
		scoreGrp = thisObj.DisplayField('Score', 400, 500, score);
		lifeGrp = thisObj.DisplayField('Life', 720, 770, (K.SushiMax - dead));


		music = game.add.audio('music');
		music.play('', 0, 0.5, true);

		sfx = game.add.audio('sfx');
		sfx.addMarker('1pt', 0, 1);
		sfx.addMarker('9pt',  6.0, 1.1);
		sfx.addMarker('18pt',  2.65, 1.1);
		sfx.addMarker('27pt', 4.0, 1.4);
		sfx.addMarker('gamewon', 8.65, 1.0);
		sfx.addMarker('bubbledie', 11.30, 1.1);
		sfx.addMarker('gameover', 11.33, 1.0);
		sfx.addMarker('tileremove', 12.5, 1.0);
		g.sfx = sfx;
		g.music = music;
	};
};
