
/*global g: true,
 ivx: true,
 sDeviceRegistration: true,
 KORDER: true,
 KMENU: true
  
 */
function MyHash() {
	"use strict";
	this.length = 0;
	this.items = [];
	var i;
	for (i = 0; i < arguments.length; i += 2) {
		if (typeof (arguments[i + 1]) !== 'undefined') {
			this.items[arguments[i]] = arguments[i + 1];
			this.length += 1;
		}
	}

	this.removeItem = function (in_key) {
		var tmp_previous = null;
		if (typeof (this.items[in_key]) !== 'undefined') {
			this.length -= 1;
			tmp_previous = this.items[in_key];
			delete this.items[in_key];
		}
		return tmp_previous;
	};

	this.getItem = function (in_key) {
		var result;
		if (this.items[in_key]) {
			result = this.items[in_key];
		} else {
			result = null;
		}
		return result;
	};

	this.setItem = function (in_key, in_value) {
		var tmp_previous;
		if (typeof (in_value) !== 'undefined') {

			if (typeof (this.items[in_key]) === 'undefined') {
				this.length += 1;
			} else {
				tmp_previous = this.items[in_key];
			}

			this.items[in_key] = in_value;
		}

		return tmp_previous;
	};

	this.hasItem = function (in_key) {
		return typeof (this.items[in_key]) !== 'undefined';
	};

	this.clear = function () {
		var i;
		for (i in this.items) {
			if (this.items.hasOwnProperty(i)) {
				delete this.items[i];
			}
		}
		this.length = 0;
	};
}

if (!window.localStorage) {
	window.myStorage = new MyHash();
} else {
	try {
		window.myStorage = window.localStorage;
	} catch (e) {
		xdebug('Db.js: error: ' + e);
	}
}

function Db(tabname) {
	"use strict";
	this._db = tabname;

	this._setAttr = function (keyname, value) {
		var k = {}, ks;
		k._db = this._db;
		k._attr = keyname;
		ks = JSON.stringify(k);
		window.myStorage.setItem(ks, value);
	};
	this._getAttr = function (keyname) {
		var k = {}, ks;
		k._db = this._db;
		k._attr = keyname;
		ks = JSON.stringify(k);
		return window.myStorage.getItem(ks);
	};
	this._setStartID = function (num) {
		if (!this._getAttr('MaxID')) {
			this._setAttr('MaxID', num);
		}
	};
	this._getNextID = function () {
		var nextid = parseInt(this._getAttr('MaxID') || 0, 10) + 1;
		this._setAttr('MaxID', nextid);
		return nextid;
	};
	this._Key2JSON = function (key) {
		key._db = this._db;
		return JSON.stringify(key);
	};
	this._JSON2Key = function (strkey) {
		//override
		//return  strkey;
		return JSON.parse(strkey);
	};
	this.NewKey = function () {
		var key = {};
		key._db = this._db;
		key.id  = this._getNextID();
		return key;
	};


	this.ForEachKey = function (callbkfcn) {
		var start, i, idx, key;
		start = window.myStorage.length - 1;
		for (i = start; i > -1; i -= 1) {
			idx = window.myStorage.key(i);
			key = this._JSON2Key(idx);
			if (key._db === this._db) {
				callbkfcn(key);
			}
		}
	};
	this.ForEachKeyMatch = function (matchfcn, callbkfcn) {
		var start, i, idx, key;
		start = window.myStorage.length - 1;
		for (i = start; i > -1; i -= 1) {
			idx = window.myStorage.key(i);
			key = this._JSON2Key(idx);
			if (key._db === this._db && matchfcn(key)) {
				callbkfcn(key);
			}
		}
	};
	this.ForEachKeyId = function (callbkfcn) {

		var start, i, idx, key;
		start = window.myStorage.length - 1;

		for (i = start; i > -1; i -= 1) {
			idx = window.myStorage.key(i);
			key = this._JSON2Key(idx);
			if (key._db === this._db) {
				if (key.id || key.hid) {
					callbkfcn(key);
				}
			}
		}
	};
	this.ForEachKeyIdMatch = function (matchfcn, callbkfcn) {
		var start, i, idx, key;
		start = window.myStorage.length - 1;
		for (i = start; i > -1; i -= 1) {
			idx = window.myStorage.key(i);
			key = this._JSON2Key(idx);
			if (key._db === this._db && matchfcn(key)) {
				if (key.id || key.hid) {
					callbkfcn(key);
				}
			}
		}
	};

	this.Purge = function () {
		var This = this;
		this.ForEachKey(function (key) { This.Delete(key); });
	};
	this.Save = function (key, rec) {
		if (key !== null) {
			window.myStorage.setItem(this._Key2JSON(key), JSON.stringify(rec));
		}
	};
	this.Delete = function (key) {
		var result;
		if (key !== null) {
			result = window.myStorage.removeItem(this._Key2JSON(key));
		} else {
			result = null;
		}
		return result;
	};
	this.Load = function (key) {
		var fullkey, a, rec;
		if (key === null) {
			return null;
		}
		fullkey = this._Key2JSON(key);
		a = window.myStorage.getItem(fullkey);
		rec = JSON.parse(a);
		// return null if record not found
		return rec;
	};
	this.Record = function () {
		//override
		return {};
	};
	this.Key = function () {
		//return  {};
		var key = {};
		key._db = this._db;
		key.id = null;
		return key;
	};
	this.Copy = function (struct) {
		var  newStruct, p;
		newStruct = {};
		for (p in struct) {
			if (struct.hasOwnProperty(p)) {
				newStruct[p] = struct[p];
			}
		}
		return newStruct;
	};
}
//________________________________________________________________________
var dbMatrix = new Db('mtx');
dbMatrix.Set = function (row, col, value, hint) {
	"use strict";
	var key, rec;
	key = {};
	key.row = row;
	key.col = col;
	rec = {};
	rec.value = value;
	rec.hint = hint;
	this.Save(key, rec);
};
dbMatrix.Get = function (row, col) {
	"use strict";
	var key;
	key = {};
	key.row = row;
	key.col = col;
	return this.Load(key);
};
//________________________________________________________________________
var dbLevel = new Db('lvl');
dbLevel.Set = function (id, value) {
	"use strict";
	var key;
	key = {};
	key.id = id;
	this.Save(key, value);
};
dbLevel.Get = function (id) {
	"use strict";
	var key;
	key = {};
	key.id = id;
	return this.Load(key);
};
//________________________________________________________________________
var dbX = new Db('dbx');
dbX.Set = function (id, value) {
	"use strict";
	var key;
	key = {};
	key.id = id;
	this.Save(key, value);
};
dbX.Get = function (id) {
	"use strict";
	var key;
	key = {};
	key.id = id;
	return this.Load(key);
};
//________________________________________________________________________
var dbFloat = new Db('flt');
dbFloat.Set = function (idx, sushi, color, isox, isoy, ticker, dir, spdiv) {
	"use strict";
	var key, rec;
	key = {};
	key.idx = idx;
	rec = {};
	rec.sushi = sushi;
	rec.color = color;
	rec.isox = isox;
	rec.isoy = isoy;
	rec.ticker = ticker;
	rec.dir = dir;
	rec.spdiv = spdiv;
	this.Save(key, rec);
};
dbFloat.Get = function (idx) {
	"use strict";
	var key;
	key = {};
	key.idx = idx;
	return this.Load(key);
};
