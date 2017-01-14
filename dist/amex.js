/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseDescription = exports.parseDate = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // parse www.americanexpressonline.com.br/amex/extrato

	var _download = __webpack_require__(1);

	var _download2 = _interopRequireDefault(_download);

	var _ofx = __webpack_require__(2);

	var _ofx2 = _interopRequireDefault(_ofx);

	var _parseMoney = __webpack_require__(3);

	var _parseMoney2 = _interopRequireDefault(_parseMoney);

	var _extractRows = __webpack_require__(4);

	var _extractRows2 = _interopRequireDefault(_extractRows);

	var _parseDate = __webpack_require__(5);

	var _parseDate2 = _interopRequireDefault(_parseDate);

	var _parseDescription = __webpack_require__(7);

	var _parseDescription2 = _interopRequireDefault(_parseDescription);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SELECTOR = '.sldLanctos table tr:not(.infoBarTit):not(.data)';

	function parseAmexPage() {
	    return (0, _extractRows2.default)(SELECTOR).filter(function (row) {
	        return row.length == 3;
	    }).map(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 3),
	            date = _ref2[0],
	            description = _ref2[1],
	            value = _ref2[2];

	        return _extends({}, (0, _parseDescription2.default)(description), {
	            date: (0, _parseDate2.default)(date),
	            value: (0, _parseMoney2.default)(value)
	        });
	    });
	}

	if (typeof chrome != 'undefined') {
	    chrome.runtime.onMessage.addListener(function (_ref3) {
	        var action = _ref3.action,
	            url = _ref3.url;

	        if (action == 'export') {
	            (0, _download2.default)('amex', (0, _ofx2.default)(parseAmexPage()));
	        }
	    });
	}

	exports.parseDate = _parseDate2.default;
	exports.parseDescription = _parseDescription2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = download;
	function download(name, content) {
	    var a = document.createElement("a");
	    a.download = name + ".ofx";
	    a.href = "data:application/x-ofx;charset=utf-8," + encodeURIComponent(content);
	    a.click();
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = buildOfx;
	function buildOfx(transactions, name) {

	    function toMoney(v) {
	        return v.toFixed(2);
	    }

	    function toDate(d) {
	        return '' + d.getFullYear() + zeroPad(d.getMonth() + 1) + zeroPad(d.getDate()) + '100000';
	    }

	    function zeroPad(value) {
	        return value < 10 ? '0' + value : value;
	    }

	    var ofxHeader = 'OFXHEADER:100\nDATA:OFXSGML\nVERSION:102\nSECURITY:NONE\nENCODING:USASCII\nCHARSET:1252\nCOMPRESSION:NONE\nOLDFILEUID:NONE\nNEWFILEUID:NONE\n\n<OFX>\n<SIGNONMSGSRSV1>\n<SONRS>\n<STATUS>\n<CODE>0\n<SEVERITY>INFO\n</STATUS>\n<DTSERVER>' + toDate(new Date()) + '[-03:EST]\n<LANGUAGE>POR\n</SONRS>\n</SIGNONMSGSRSV1>\n<BANKMSGSRSV1>\n<STMTTRNRS>\n<TRNUID>1001\n<STATUS>\n<CODE>0\n<SEVERITY>INFO\n</STATUS>\n<STMTRS>\n<CURDEF>BRL\n<BANKTRANLIST>\r\n';

	    ofxHeader += transactions.map(function (_ref) {
	        var date = _ref.date,
	            value = _ref.value,
	            description = _ref.description;

	        return '<STMTTRN>\n<TRNTYPE>' + (value < 0 ? 'DEBIT' : 'CREDIT') + '\n<DTPOSTED>' + toDate(date) + '[-03:EST]\n<TRNAMT>' + toMoney(value) + '\n<MEMO>' + description + '\n</STMTTRN>\r\n';
	    }).join("");

	    return ofxHeader + '</BANKTRANLIST>\n</STMTRS>\n</STMTTRNRS>\n</BANKMSGSRSV1>\n</OFX>';
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = parseMoney;
	function parseMoney(value) {
	    return parseFloat(value.replace('R$', '').trim().replace('.', '').replace(',', '.'));
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = extractRows;
	function extractRows(selector) {
	    return [].slice.call(document.querySelectorAll(selector)).map(function (row) {
	        return [].slice.call(row.querySelectorAll('td')).map(function (c) {
	            return c.innerText;
	        });
	    }); // convert NodeList to Array
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (date) {
	    var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	    var extra = (0, _extraPayments2.default)(description);
	    var dt = date.split('/');
	    return new Date(dt[2], parseInt(dt[1] - 1) + extra, dt[0]);
	};

	var _extraPayments = __webpack_require__(6);

	var _extraPayments2 = _interopRequireDefault(_extraPayments);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (description) {
	    var result = description.match(/PRESTACAO (\d+) DE (\d+)/);
	    if (result) {
	        return parseInt(result[1]) - 1;
	    } else {
	        return 0;
	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (description) {
	    var tokens = description.split("\n");
	    return {
	        description: tokens[0].trim(),
	        memo: tokens.length > 1 ? tokens[1].trim() : ''
	    };
	};

/***/ }
/******/ ]);