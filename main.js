(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}




// VIRTUAL-DOM WIDGETS


var _Markdown_toHtml = F3(function(options, factList, rawMarkdown)
{
	return _VirtualDom_custom(
		factList,
		{
			a: options,
			b: rawMarkdown
		},
		_Markdown_render,
		_Markdown_diff
	);
});



// WIDGET IMPLEMENTATION


function _Markdown_render(model)
{
	return A2(_Markdown_replace, model, _VirtualDom_doc.createElement('div'));
}


function _Markdown_diff(x, y)
{
	return x.b === y.b && x.a === y.a
		? false
		: _Markdown_replace(y);
}


var _Markdown_replace = F2(function(model, div)
{
	div.innerHTML = _Markdown_marked(model.b, _Markdown_formatOptions(model.a));
	return div;
});



// ACTUAL MARKDOWN PARSER


var _Markdown_marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^_\_([\s\S]+?)_\_(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|_\_)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^_\_(?=\S)([\s\S]*?\S)_\_(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function _Markdown_formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && $elm$core$Maybe$isJust(options.defaultHighlighting))
		{
			lang = options.defaultHighlighting.a;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.githubFlavored.a;

	return {
		highlight: toHighlight,
		gfm: gfm,
		tables: gfm && gfm.tables,
		breaks: gfm && gfm.breaks,
		sanitize: options.sanitize,
		smartypants: options.smartypants
	};
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $author$project$Examples$Combination$defaultDate = {day: 1, month: 1, year: 1970};
var $author$project$Examples$Combination$emptyLogin = {password: '', username: ''};
var $author$project$Examples$Combination$formDefaults = {birthday: $author$project$Examples$Combination$defaultDate, login: $author$project$Examples$Combination$emptyLogin};
var $author$project$FancyForms$FormState$FormState = function (a) {
	return {$: 'FormState', a: a};
};
var $author$project$FancyForms$FormState$init = F2(
	function (values, parentDomId) {
		return $author$project$FancyForms$FormState$FormState(
			{allBlurred: false, fieldStatus: $elm$core$Dict$empty, parentDomId: parentDomId, values: values});
	});
var $author$project$FancyForms$Form$init = F2(
	function (_v0, data) {
		var domId = _v0.domId;
		var initWithData = _v0.initWithData;
		return A2(
			initWithData,
			data,
			A2($author$project$FancyForms$FormState$init, $elm$core$Dict$empty, domId));
	});
var $author$project$FancyForms$FormState$alwaysValid = function (_v0) {
	return _List_Nil;
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$FancyForms$FormState$CustomError = function (a) {
	return {$: 'CustomError', a: a};
};
var $author$project$Examples$Validation$MustNotBeGreaterThanDaysInMonth = function (a) {
	return {$: 'MustNotBeGreaterThanDaysInMonth', a: a};
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Examples$Validation$daysInMonth = F2(
	function (month, year) {
		switch (month) {
			case 1:
				return 31;
			case 2:
				return (((!A2($elm$core$Basics$modBy, 4, year)) && (!(!A2($elm$core$Basics$modBy, 100, year)))) || (!A2($elm$core$Basics$modBy, 400, year))) ? 29 : 28;
			case 3:
				return 31;
			case 5:
				return 31;
			case 7:
				return 31;
			case 8:
				return 31;
			case 10:
				return 31;
			case 12:
				return 31;
			default:
				return 30;
		}
	});
var $author$project$Examples$Validation$daysOfMonthValidator = function (_v0) {
	var day = _v0.day;
	var month = _v0.month;
	var year = _v0.year;
	return (_Utils_cmp(
		day,
		A2($author$project$Examples$Validation$daysInMonth, month, year)) > 0) ? _List_fromArray(
		[
			$author$project$FancyForms$FormState$CustomError(
			$author$project$Examples$Validation$MustNotBeGreaterThanDaysInMonth(
				A2($author$project$Examples$Validation$daysInMonth, month, year)))
		]) : _List_Nil;
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Examples$Validation$errorToString = function (e) {
	switch (e.$) {
		case 'NotValid':
			return '';
		case 'MustNotBeBlank':
			return 'must not be blank';
		case 'MustBeGreaterThan':
			var n = e.a;
			return 'must be greater than ' + n;
		case 'MustBeLesserThan':
			var n = e.a;
			return 'must be lower than ' + n;
		default:
			var ce = e.a;
			var daysInMonth_ = ce.a;
			return 'There are only ' + ($elm$core$String$fromInt(daysInMonth_) + ' days in this month');
	}
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$FancyForms$FormState$read = F2(
	function (fieldId, _v0) {
		var values = _v0.a.values;
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$json$Json$Encode$object(_List_Nil),
			A2($elm$core$Dict$get, fieldId, values));
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$FancyForms$FormState$blurChildren = F3(
	function (fieldId, widget, fs) {
		var formState = fs.a;
		var values = formState.values;
		var blurredModel = A2(
			$elm$core$Result$withDefault,
			$elm$json$Json$Encode$null,
			A2(
				$elm$core$Result$map,
				widget.encodeModel,
				A2(
					$elm$core$Result$map,
					widget.blur,
					A2(
						$elm$json$Json$Decode$decodeValue,
						widget.decoderModel,
						A2($author$project$FancyForms$FormState$read, fieldId, fs)))));
		return $author$project$FancyForms$FormState$FormState(
			_Utils_update(
				formState,
				{
					allBlurred: true,
					values: A3($elm$core$Dict$insert, fieldId, blurredModel, values)
				}));
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$FancyForms$FormState$NoEffect = {$: 'NoEffect'};
var $author$project$FancyForms$FormState$WasChanged = {$: 'WasChanged'};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$FancyForms$Form$encodedUpdate = F5(
	function (widget, mbTemplate, subfieldId, operation, modelVal) {
		var decoderMsg = widget.decoderMsg;
		var decoderModel = widget.decoderModel;
		var encodeModel = widget.encodeModel;
		var encodeSubfield = function (updatedModel) {
			if (subfieldId.$ === 'SingleValue') {
				return encodeModel(updatedModel);
			} else {
				var i = subfieldId.a;
				return A2(
					$elm$json$Json$Encode$list,
					encodeModel,
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (idx, e) {
								return _Utils_eq(idx, i) ? updatedModel : e;
							}),
						A2(
							$elm$core$Result$withDefault,
							_List_Nil,
							A2(
								$elm$json$Json$Decode$decodeValue,
								$elm$json$Json$Decode$list(decoderModel),
								modelVal))));
			}
		};
		var decodeSubfield = function () {
			if (subfieldId.$ === 'SingleValue') {
				return decoderModel;
			} else {
				var i = subfieldId.a;
				return A2($elm$json$Json$Decode$index, i, decoderModel);
			}
		}();
		var _v0 = _Utils_Tuple2(operation, subfieldId);
		_v0$3:
		while (true) {
			switch (_v0.a.$) {
				case 'Add':
					if (_v0.b.$ === 'ArrayElement') {
						var _v1 = _v0.a;
						return _Utils_Tuple2(
							function (list) {
								return A2(
									$elm$json$Json$Encode$list,
									encodeModel,
									_Utils_ap(
										list,
										_List_fromArray(
											[
												widget.init(
												A2($elm$core$Maybe$withDefault, widget._default, mbTemplate))
											])));
							}(
								A2(
									$elm$core$Result$withDefault,
									_List_Nil,
									A2(
										$elm$json$Json$Decode$decodeValue,
										$elm$json$Json$Decode$list(decoderModel),
										modelVal))),
							$author$project$FancyForms$FormState$WasChanged);
					} else {
						break _v0$3;
					}
				case 'Remove':
					if (_v0.b.$ === 'ArrayElement') {
						var _v2 = _v0.a;
						var i = _v0.b.a;
						return _Utils_Tuple2(
							A2(
								$elm$json$Json$Encode$list,
								encodeModel,
								function (list) {
									return _Utils_ap(
										A2($elm$core$List$take, i, list),
										A2($elm$core$List$drop, i + 1, list));
								}(
									A2(
										$elm$core$Result$withDefault,
										_List_Nil,
										A2(
											$elm$json$Json$Decode$decodeValue,
											$elm$json$Json$Decode$list(decoderModel),
											modelVal)))),
							$author$project$FancyForms$FormState$WasChanged);
					} else {
						break _v0$3;
					}
				default:
					var msgVal = _v0.a.a;
					var _v3 = _Utils_Tuple2(
						A2($elm$json$Json$Decode$decodeValue, decoderMsg, msgVal),
						A2($elm$json$Json$Decode$decodeValue, decodeSubfield, modelVal));
					if (_v3.a.$ === 'Ok') {
						if (_v3.b.$ === 'Ok') {
							var msg = _v3.a.a;
							var model = _v3.b.a;
							var updateResult = A2(widget.update, msg, model);
							return _Utils_Tuple2(
								encodeSubfield(updateResult.model),
								updateResult.effect);
						} else {
							var msg = _v3.a.a;
							var updateResult = A2(
								widget.update,
								msg,
								widget.init(widget._default));
							return _Utils_Tuple2(
								encodeSubfield(updateResult.model),
								updateResult.effect);
						}
					} else {
						return _Utils_Tuple2(modelVal, $author$project$FancyForms$FormState$NoEffect);
					}
			}
		}
		return _Utils_Tuple2(modelVal, $author$project$FancyForms$FormState$NoEffect);
	});
var $author$project$FancyForms$Form$extendConsistencyCheck = F3(
	function (previousChecks, newCheck, formState) {
		return previousChecks(formState) && newCheck(formState);
	});
var $author$project$FancyForms$Form$extendInit = F4(
	function (previousInit, nextInit, data, formState) {
		return A2(
			nextInit,
			data,
			A2(previousInit, data, formState));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$FancyForms$Form$extractConsistencyCheck = F3(
	function (widget, fieldId, formState) {
		return A2(
			$elm$core$Result$withDefault,
			false,
			A2(
				$elm$core$Result$map,
				function (model) {
					return widget.isConsistent(model) && $elm$core$List$isEmpty(
						widget.validate(
							widget.value(model)));
				},
				A2(
					$elm$json$Json$Decode$decodeValue,
					widget.decoderModel,
					A2($author$project$FancyForms$FormState$read, fieldId, formState))));
	});
var $author$project$FancyForms$FormState$SingleValue = {$: 'SingleValue'};
var $author$project$FancyForms$FormState$toKey = F2(
	function (fieldId, subfieldId) {
		if (subfieldId.$ === 'SingleValue') {
			return fieldId;
		} else {
			var i = subfieldId.a;
			return fieldId + ('-' + $elm$core$String$fromInt(i));
		}
	});
var $author$project$FancyForms$FormState$write = F4(
	function (fieldId, subfieldId, _v0, value) {
		var formState = _v0.a;
		return $author$project$FancyForms$FormState$FormState(
			_Utils_update(
				formState,
				{
					values: A3(
						$elm$core$Dict$insert,
						A2($author$project$FancyForms$FormState$toKey, fieldId, subfieldId),
						value,
						formState.values)
				}));
	});
var $author$project$FancyForms$Form$extractInit = F5(
	function (widget, fieldId, valueExtractor, formModel, formState) {
		var value = valueExtractor(formModel);
		var encodedValue = widget.encodeModel(
			widget.init(value));
		return A4($author$project$FancyForms$FormState$write, fieldId, $author$project$FancyForms$FormState$SingleValue, formState, encodedValue);
	});
var $author$project$FancyForms$FormState$Blurred = {$: 'Blurred'};
var $author$project$FancyForms$Form$FormMsg = F3(
	function (a, b, c) {
		return {$: 'FormMsg', a: a, b: b, c: c};
	});
var $author$project$FancyForms$FormState$Update = function (a) {
	return {$: 'Update', a: a};
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$FancyForms$FormState$NotVisited = {$: 'NotVisited'};
var $author$project$FancyForms$FormState$wasAtLeast = F3(
	function (goal, fieldId, _v0) {
		var fieldStatus = _v0.a.fieldStatus;
		var allBlurred = _v0.a.allBlurred;
		var tested = A2(
			$elm$core$Maybe$withDefault,
			$author$project$FancyForms$FormState$NotVisited,
			A2($elm$core$Dict$get, fieldId, fieldStatus));
		if (allBlurred) {
			return true;
		} else {
			var _v1 = _Utils_Tuple2(tested, goal);
			switch (_v1.a.$) {
				case 'NotVisited':
					if (_v1.b.$ === 'NotVisited') {
						var _v2 = _v1.a;
						var _v3 = _v1.b;
						return true;
					} else {
						var _v4 = _v1.a;
						return false;
					}
				case 'Focused':
					switch (_v1.b.$) {
						case 'NotVisited':
							var _v5 = _v1.a;
							var _v6 = _v1.b;
							return true;
						case 'Focused':
							var _v7 = _v1.a;
							var _v8 = _v1.b;
							return true;
						default:
							var _v9 = _v1.a;
							return false;
					}
				case 'Changed':
					if (_v1.b.$ === 'Blurred') {
						var _v10 = _v1.a;
						var _v11 = _v1.b;
						return false;
					} else {
						var _v12 = _v1.a;
						return true;
					}
				default:
					if (_v1.b.$ === 'Blurred') {
						var _v13 = _v1.a;
						var _v14 = _v1.b;
						return true;
					} else {
						var _v15 = _v1.a;
						return false;
					}
			}
		}
	});
var $author$project$FancyForms$Form$mkField = F3(
	function (fieldWithErrors, fieldId, widget) {
		var deserializeModel = function (formState) {
			return $elm$core$Result$toMaybe(
				A2(
					$elm$json$Json$Decode$decodeValue,
					widget.decoderModel,
					A2($author$project$FancyForms$FormState$read, fieldId, formState)));
		};
		var errors_ = function (formState) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					widget.validate,
					A2(
						$elm$core$Maybe$map,
						widget.value,
						deserializeModel(formState))));
		};
		var value = function (formState) {
			return A2(
				$elm$core$Maybe$withDefault,
				widget._default,
				A2(
					$elm$core$Maybe$map,
					widget.value,
					deserializeModel(formState)));
		};
		var viewField = function (formState) {
			var parentDomId = formState.a.parentDomId;
			var widgetModel = deserializeModel(formState);
			var toMsg = function (msg) {
				return function (v) {
					return A3(
						$author$project$FancyForms$Form$FormMsg,
						fieldId,
						$author$project$FancyForms$FormState$SingleValue,
						$author$project$FancyForms$FormState$Update(v));
				}(
					widget.encodeMsg(msg));
			};
			var fieldErrors = A3($author$project$FancyForms$FormState$wasAtLeast, $author$project$FancyForms$FormState$Blurred, fieldId, formState) ? errors_(formState) : _List_Nil;
			var innerAttrs = A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					function (v) {
						return A2(widget.innerAttributes, fieldErrors, v);
					},
					A2($elm$core$Maybe$map, widget.value, widgetModel)));
			var inputHtml = A2(
				$elm$core$List$map,
				$elm$html$Html$map(toMsg),
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						A2(widget.view, parentDomId + ('f-' + fieldId), innerAttrs),
						widgetModel)));
			return A2(fieldWithErrors, fieldErrors, inputHtml);
		};
		return {errors: errors_, id: fieldId, multiple: false, value: value, view: viewField};
	});
var $author$project$FancyForms$Form$field = F3(
	function (extractDefault, widget, _v0) {
		var fn = _v0.fn;
		var count = _v0.count;
		var updates = _v0.updates;
		var fieldWithErrors = _v0.fieldWithErrors;
		var validator = _v0.validator;
		var blur = _v0.blur;
		var domId = _v0.domId;
		var isConsistent = _v0.isConsistent;
		var initWithData = _v0.initWithData;
		var fieldId = $elm$core$String$fromInt(count);
		return {
			blur: A2(
				$elm$core$Basics$composeR,
				blur,
				A2($author$project$FancyForms$FormState$blurChildren, fieldId, widget)),
			count: count + 1,
			domId: domId,
			fieldWithErrors: fieldWithErrors,
			fn: fn(
				A3($author$project$FancyForms$Form$mkField, fieldWithErrors, fieldId, widget)),
			initWithData: A2(
				$author$project$FancyForms$Form$extendInit,
				initWithData,
				A3($author$project$FancyForms$Form$extractInit, widget, fieldId, extractDefault)),
			isConsistent: A2(
				$author$project$FancyForms$Form$extendConsistencyCheck,
				isConsistent,
				A2($author$project$FancyForms$Form$extractConsistencyCheck, widget, fieldId)),
			updates: A3(
				$elm$core$Dict$insert,
				fieldId,
				A2($author$project$FancyForms$Form$encodedUpdate, widget, $elm$core$Maybe$Nothing),
				updates),
			validator: validator
		};
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$core$Basics$not = _Basics_not;
var $elm$html$Html$small = _VirtualDom_node('small');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Examples$Validation$viewErrors = function (errors) {
	return $elm$core$List$isEmpty(errors) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$small,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(
				A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$map, $author$project$Examples$Validation$errorToString, errors)))
			]));
};
var $author$project$Examples$Validation$fieldWithErrors = F2(
	function (errors, html) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'has-error',
								!$elm$core$List$isEmpty(errors))
							]))
					]),
				_Utils_ap(
					html,
					_List_fromArray(
						[
							$author$project$Examples$Validation$viewErrors(errors)
						])))
			]);
	});
var $author$project$FancyForms$FormState$blurAll = function (_v0) {
	var formState = _v0.a;
	return $author$project$FancyForms$FormState$FormState(
		_Utils_update(
			formState,
			{allBlurred: true}));
};
var $author$project$FancyForms$Form$form = F4(
	function (fieldWithErrors, validator, domId, fn) {
		return {
			blur: $author$project$FancyForms$FormState$blurAll,
			count: 0,
			domId: domId,
			fieldWithErrors: fieldWithErrors,
			fn: fn,
			initWithData: F2(
				function (_v0, fs) {
					return fs;
				}),
			isConsistent: function (_v1) {
				return true;
			},
			updates: $elm$core$Dict$empty,
			validator: validator
		};
	});
var $author$project$FancyForms$FormState$MustBeGreaterThan = function (a) {
	return {$: 'MustBeGreaterThan', a: a};
};
var $author$project$FancyForms$Widgets$Int$greaterThan = F2(
	function (x, value) {
		return (_Utils_cmp(value, x) < 1) ? _List_fromArray(
			[
				$author$project$FancyForms$FormState$MustBeGreaterThan(
				$elm$core$String$fromInt(x))
			]) : _List_Nil;
	});
var $author$project$FancyForms$Widgets$Int$Blurred = {$: 'Blurred'};
var $author$project$FancyForms$Widgets$Int$Changed = function (a) {
	return {$: 'Changed', a: a};
};
var $author$project$FancyForms$Widgets$Int$Focused = {$: 'Focused'};
var $author$project$FancyForms$Widgets$Int$Model = F2(
	function (value, parsedValue) {
		return {parsedValue: parsedValue, value: value};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$FancyForms$Widgets$Int$decoderMsg = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$andThen,
			function (s) {
				switch (s) {
					case 'Focused':
						return $elm$json$Json$Decode$succeed($author$project$FancyForms$Widgets$Int$Focused);
					case 'Blurred':
						return $elm$json$Json$Decode$succeed($author$project$FancyForms$Widgets$Int$Blurred);
					default:
						return $elm$json$Json$Decode$fail('');
				}
			},
			$elm$json$Json$Decode$string),
			A2(
			$elm$json$Json$Decode$map,
			$author$project$FancyForms$Widgets$Int$Changed,
			A2($elm$json$Json$Decode$field, 'Changed', $elm$json$Json$Decode$string))
		]));
var $author$project$FancyForms$Widgets$Int$encodeMsg = function (msg) {
	switch (msg.$) {
		case 'Focused':
			return $elm$json$Json$Encode$string('Focused');
		case 'Blurred':
			return $elm$json$Json$Encode$string('Blurred');
		default:
			var s = msg.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Changed',
						$elm$json$Json$Encode$string(s))
					]));
	}
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$FancyForms$FormState$justChanged = function (model) {
	return {effect: $author$project$FancyForms$FormState$WasChanged, model: model};
};
var $author$project$FancyForms$FormState$noAttributes = F2(
	function (_v0, _v1) {
		return _List_Nil;
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$FancyForms$FormState$WasBlurred = {$: 'WasBlurred'};
var $author$project$FancyForms$FormState$withBlur = function (model) {
	return {effect: $author$project$FancyForms$FormState$WasBlurred, model: model};
};
var $author$project$FancyForms$FormState$WasFocused = {$: 'WasFocused'};
var $author$project$FancyForms$FormState$withFocus = function (model) {
	return {effect: $author$project$FancyForms$FormState$WasFocused, model: model};
};
var $author$project$FancyForms$Widgets$Int$integerInput = function (attrs) {
	return {
		blur: $elm$core$Basics$identity,
		decoderModel: A3(
			$elm$json$Json$Decode$map2,
			$author$project$FancyForms$Widgets$Int$Model,
			A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'parsedValue', $elm$json$Json$Decode$int)),
		decoderMsg: $author$project$FancyForms$Widgets$Int$decoderMsg,
		_default: 0,
		encodeModel: function (model) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'value',
						$elm$json$Json$Encode$string(model.value)),
						_Utils_Tuple2(
						'parsedValue',
						$elm$json$Json$Encode$int(model.parsedValue))
					]));
		},
		encodeMsg: $author$project$FancyForms$Widgets$Int$encodeMsg,
		init: function (i) {
			return {
				parsedValue: i,
				value: $elm$core$String$fromInt(i)
			};
		},
		innerAttributes: $author$project$FancyForms$FormState$noAttributes,
		isConsistent: function (_v0) {
			var parsedValue = _v0.parsedValue;
			var value = _v0.value;
			return _Utils_eq(
				$elm$core$String$toInt(value),
				$elm$core$Maybe$Just(parsedValue));
		},
		update: F2(
			function (msg, model) {
				switch (msg.$) {
					case 'Changed':
						var val = msg.a;
						return $author$project$FancyForms$FormState$justChanged(
							A2(
								$elm$core$Maybe$withDefault,
								_Utils_update(
									model,
									{value: val}),
								A2(
									$elm$core$Maybe$map,
									function (i) {
										return _Utils_update(
											model,
											{parsedValue: i, value: val});
									},
									$elm$core$String$toInt(val))));
					case 'Focused':
						return $author$project$FancyForms$FormState$withFocus(model);
					default:
						return $author$project$FancyForms$FormState$withBlur(model);
				}
			}),
		validate: $author$project$FancyForms$FormState$alwaysValid,
		value: function ($) {
			return $.parsedValue;
		},
		view: F3(
			function (domId, innerAttrs, model) {
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						$elm$core$List$concat(
							_List_fromArray(
								[
									attrs,
									innerAttrs,
									_List_fromArray(
									[
										$elm$html$Html$Attributes$id(domId),
										$elm$html$Html$Attributes$type_('number'),
										$elm$html$Html$Events$onInput($author$project$FancyForms$Widgets$Int$Changed),
										$elm$html$Html$Events$onFocus($author$project$FancyForms$Widgets$Int$Focused),
										$elm$html$Html$Events$onBlur($author$project$FancyForms$Widgets$Int$Blurred),
										$elm$html$Html$Attributes$value(model.value)
									])
								])),
						_List_Nil)
					]);
			})
	};
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$FancyForms$FormState$MustBeLesserThan = function (a) {
	return {$: 'MustBeLesserThan', a: a};
};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$FancyForms$Widgets$Int$lesserThan = F2(
	function (x, value) {
		return (_Utils_cmp(value, x) > -1) ? _List_fromArray(
			[
				$author$project$FancyForms$FormState$MustBeLesserThan(
				$elm$core$String$fromInt(x))
			]) : _List_Nil;
	});
var $author$project$FancyForms$Form$concatValidators = F2(
	function (validators, model) {
		return $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (validator) {
					return validator(model);
				},
				validators));
	});
var $author$project$FancyForms$Form$validate = F2(
	function (validators, widget) {
		return _Utils_update(
			widget,
			{
				validate: $author$project$FancyForms$Form$concatValidators(validators)
			});
	});
var $author$project$Examples$Validation$myForm = A3(
	$author$project$FancyForms$Form$field,
	function ($) {
		return $.year;
	},
	A2(
		$author$project$FancyForms$Form$validate,
		_List_fromArray(
			[
				$author$project$FancyForms$Widgets$Int$greaterThan(1900)
			]),
		$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil)),
	A3(
		$author$project$FancyForms$Form$field,
		function ($) {
			return $.month;
		},
		A2(
			$author$project$FancyForms$Form$validate,
			_List_fromArray(
				[
					$author$project$FancyForms$Widgets$Int$greaterThan(0),
					$author$project$FancyForms$Widgets$Int$lesserThan(13)
				]),
			$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil)),
		A3(
			$author$project$FancyForms$Form$field,
			function ($) {
				return $.day;
			},
			A2(
				$author$project$FancyForms$Form$validate,
				_List_fromArray(
					[
						$author$project$FancyForms$Widgets$Int$greaterThan(0)
					]),
				$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil)),
			A4(
				$author$project$FancyForms$Form$form,
				$author$project$Examples$Validation$fieldWithErrors,
				$author$project$Examples$Validation$daysOfMonthValidator,
				'validation-example',
				F3(
					function (day, month, year) {
						return {
							combine: function (formState) {
								return {
									day: day.value(formState),
									month: month.value(formState),
									year: year.value(formState)
								};
							},
							view: F2(
								function (formState, errors) {
									return _List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('errors')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2(
														$elm$core$String$join,
														' ',
														A2($elm$core$List$map, $author$project$Examples$Validation$errorToString, errors)))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('grid')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$label,
													_List_Nil,
													A2(
														$elm$core$List$cons,
														$elm$html$Html$text('Day:'),
														day.view(formState))),
													A2(
													$elm$html$Html$label,
													_List_Nil,
													A2(
														$elm$core$List$cons,
														$elm$html$Html$text('Month:'),
														month.view(formState))),
													A2(
													$elm$html$Html$label,
													_List_Nil,
													A2(
														$elm$core$List$cons,
														$elm$html$Html$text('Year: '),
														year.view(formState)))
												]))
										]);
								})
						};
					})))));
var $author$project$FancyForms$Form$CustomEvent = function (a) {
	return {$: 'CustomEvent', a: a};
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$FancyForms$Form$decoderCustomFormMsg = A2(
	$elm$json$Json$Decode$map,
	$author$project$FancyForms$Form$CustomEvent,
	A2($elm$json$Json$Decode$field, 'customEvent', $elm$json$Json$Decode$value));
var $author$project$FancyForms$FormState$Add = {$: 'Add'};
var $author$project$FancyForms$FormState$Remove = {$: 'Remove'};
var $author$project$FancyForms$Form$decoderFieldOperation = A2(
	$elm$json$Json$Decode$andThen,
	function (kind) {
		switch (kind) {
			case 'add':
				return $elm$json$Json$Decode$succeed($author$project$FancyForms$FormState$Add);
			case 'remove':
				return $elm$json$Json$Decode$succeed($author$project$FancyForms$FormState$Remove);
			case 'update':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$FancyForms$FormState$Update,
					A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$value));
			default:
				return $elm$json$Json$Decode$fail('unknown kind');
		}
	},
	A2($elm$json$Json$Decode$field, 'kind', $elm$json$Json$Decode$string));
var $author$project$FancyForms$FormState$ArrayElement = function (a) {
	return {$: 'ArrayElement', a: a};
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $author$project$FancyForms$Form$decoderSubFieldId = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$andThen,
			function (i) {
				return $elm$json$Json$Decode$succeed(
					$author$project$FancyForms$FormState$ArrayElement(i));
			},
			$elm$json$Json$Decode$int),
			$elm$json$Json$Decode$null($author$project$FancyForms$FormState$SingleValue)
		]));
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$FancyForms$Form$decoderFormMsg_ = A4(
	$elm$json$Json$Decode$map3,
	$author$project$FancyForms$Form$FormMsg,
	A2($elm$json$Json$Decode$field, 'fieldId', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'subFieldId', $author$project$FancyForms$Form$decoderSubFieldId),
	A2($elm$json$Json$Decode$field, 'operation', $author$project$FancyForms$Form$decoderFieldOperation));
var $author$project$FancyForms$Form$decoderFormMsg = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[$author$project$FancyForms$Form$decoderCustomFormMsg, $author$project$FancyForms$Form$decoderFormMsg_]));
var $author$project$FancyForms$Form$encodeFieldOperation = function (operation) {
	switch (operation.$) {
		case 'Add':
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'kind',
						$elm$json$Json$Encode$string('add'))
					]));
		case 'Remove':
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'kind',
						$elm$json$Json$Encode$string('remove'))
					]));
		default:
			var v = operation.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'kind',
						$elm$json$Json$Encode$string('update')),
						_Utils_Tuple2('value', v)
					]));
	}
};
var $author$project$FancyForms$Form$encodeSubFieldId = function (subfieldId) {
	if (subfieldId.$ === 'SingleValue') {
		return $elm$json$Json$Encode$null;
	} else {
		var i = subfieldId.a;
		return $elm$json$Json$Encode$int(i);
	}
};
var $author$project$FancyForms$Form$encodeFormMsg = function (msg) {
	if (msg.$ === 'FormMsg') {
		var fieldId = msg.a;
		var subfieldId = msg.b;
		var operation = msg.c;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'fieldId',
					$elm$json$Json$Encode$string(fieldId)),
					_Utils_Tuple2(
					'subFieldId',
					$author$project$FancyForms$Form$encodeSubFieldId(subfieldId)),
					_Utils_Tuple2(
					'operation',
					$author$project$FancyForms$Form$encodeFieldOperation(operation))
				]));
	} else {
		var v = msg.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2('customEvent', v)
				]));
	}
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$FancyForms$FormState$Changed = {$: 'Changed'};
var $author$project$FancyForms$FormState$Focused = {$: 'Focused'};
var $author$project$FancyForms$FormState$decoderFieldStatus = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		switch (s) {
			case 'NotVisited':
				return $elm$json$Json$Decode$succeed($author$project$FancyForms$FormState$NotVisited);
			case 'Focused':
				return $elm$json$Json$Decode$succeed($author$project$FancyForms$FormState$Focused);
			case 'Changed':
				return $elm$json$Json$Decode$succeed($author$project$FancyForms$FormState$Changed);
			case 'Blurred':
				return $elm$json$Json$Decode$succeed($author$project$FancyForms$FormState$Blurred);
			default:
				return $elm$json$Json$Decode$fail('invalid field status');
		}
	},
	$elm$json$Json$Decode$string);
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$FancyForms$FormState$formStateDecoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (parentDomId, values, fieldStatus, allBlurred) {
			return $author$project$FancyForms$FormState$FormState(
				{allBlurred: allBlurred, fieldStatus: fieldStatus, parentDomId: parentDomId, values: values});
		}),
	A2($elm$json$Json$Decode$field, 'parentDomId', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$dict($elm$json$Json$Decode$value)),
	A2(
		$elm$json$Json$Decode$field,
		'fieldStatus',
		$elm$json$Json$Decode$dict($author$project$FancyForms$FormState$decoderFieldStatus)),
	A2($elm$json$Json$Decode$field, 'allBlurred', $elm$json$Json$Decode$bool));
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(_Utils_Tuple0),
				dictionary));
	});
var $author$project$FancyForms$FormState$encodeFieldStatus = function (status) {
	switch (status.$) {
		case 'NotVisited':
			return $elm$json$Json$Encode$string('NotVisited');
		case 'Focused':
			return $elm$json$Json$Encode$string('Focused');
		case 'Changed':
			return $elm$json$Json$Encode$string('Changed');
		default:
			return $elm$json$Json$Encode$string('Blurred');
	}
};
var $author$project$FancyForms$FormState$formStateEncode = function (_v0) {
	var parentDomId = _v0.a.parentDomId;
	var values = _v0.a.values;
	var fieldStatus = _v0.a.fieldStatus;
	var allBlurred = _v0.a.allBlurred;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'parentDomId',
				$elm$json$Json$Encode$string(parentDomId)),
				_Utils_Tuple2(
				'values',
				A3($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $elm$core$Basics$identity, values)),
				_Utils_Tuple2(
				'fieldStatus',
				A3($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $author$project$FancyForms$FormState$encodeFieldStatus, fieldStatus)),
				_Utils_Tuple2(
				'allBlurred',
				$elm$json$Json$Encode$bool(allBlurred))
			]));
};
var $author$project$FancyForms$FormState$justChangedInternally = function (model) {
	return {effect: $author$project$FancyForms$FormState$NoEffect, model: model};
};
var $author$project$FancyForms$FormState$updateFieldStatus = F2(
	function (status, effect) {
		var _v0 = _Utils_Tuple2(status, effect);
		switch (_v0.a.$) {
			case 'NotVisited':
				switch (_v0.b.$) {
					case 'NoEffect':
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return $author$project$FancyForms$FormState$NotVisited;
					case 'WasChanged':
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						return $author$project$FancyForms$FormState$Changed;
					case 'WasFocused':
						var _v5 = _v0.a;
						var _v6 = _v0.b;
						return $author$project$FancyForms$FormState$Focused;
					default:
						var _v7 = _v0.a;
						var _v8 = _v0.b;
						return $author$project$FancyForms$FormState$Blurred;
				}
			case 'Focused':
				switch (_v0.b.$) {
					case 'NoEffect':
						var _v9 = _v0.a;
						var _v10 = _v0.b;
						return $author$project$FancyForms$FormState$Focused;
					case 'WasChanged':
						var _v11 = _v0.a;
						var _v12 = _v0.b;
						return $author$project$FancyForms$FormState$Changed;
					case 'WasFocused':
						var _v13 = _v0.a;
						var _v14 = _v0.b;
						return $author$project$FancyForms$FormState$Focused;
					default:
						var _v15 = _v0.a;
						var _v16 = _v0.b;
						return $author$project$FancyForms$FormState$Blurred;
				}
			case 'Changed':
				if (_v0.b.$ === 'WasBlurred') {
					var _v17 = _v0.a;
					var _v18 = _v0.b;
					return $author$project$FancyForms$FormState$Blurred;
				} else {
					var _v19 = _v0.a;
					return $author$project$FancyForms$FormState$Changed;
				}
			default:
				var _v20 = _v0.a;
				return $author$project$FancyForms$FormState$Blurred;
		}
	});
var $author$project$FancyForms$Form$updateField = F5(
	function (_v0, fieldId, subfieldId, operation, fs) {
		var updates = _v0.updates;
		var formState = fs.a;
		var updateFn = A2(
			$elm$core$Maybe$withDefault,
			F3(
				function (_v3, _v4, modelValue_) {
					return _Utils_Tuple2(modelValue_, $author$project$FancyForms$FormState$NoEffect);
				}),
			A2($elm$core$Dict$get, fieldId, updates));
		var modelValue = A2($author$project$FancyForms$FormState$read, fieldId, fs);
		var _v1 = A3(updateFn, subfieldId, operation, modelValue);
		var updatedModelValue = _v1.a;
		var effect = _v1.b;
		var fieldStatus = function () {
			var currentStatus = function () {
				var _v2 = A2($elm$core$Dict$get, fieldId, formState.fieldStatus);
				if (_v2.$ === 'Nothing') {
					return $author$project$FancyForms$FormState$NotVisited;
				} else {
					var status = _v2.a;
					return status;
				}
			}();
			return A3(
				$elm$core$Dict$insert,
				fieldId,
				A2($author$project$FancyForms$FormState$updateFieldStatus, currentStatus, effect),
				formState.fieldStatus);
		}();
		return $author$project$FancyForms$FormState$FormState(
			_Utils_update(
				formState,
				{
					fieldStatus: fieldStatus,
					values: A3($elm$core$Dict$insert, fieldId, updatedModelValue, formState.values)
				}));
	});
var $author$project$FancyForms$Form$toWidget = function (f) {
	var value_ = function (formState) {
		return f.fn.combine(formState);
	};
	return {
		blur: $author$project$FancyForms$FormState$blurAll,
		decoderModel: $author$project$FancyForms$FormState$formStateDecoder,
		decoderMsg: $author$project$FancyForms$Form$decoderFormMsg,
		_default: f.fn.combine(
			A2($author$project$FancyForms$FormState$init, $elm$core$Dict$empty, '')),
		encodeModel: $author$project$FancyForms$FormState$formStateEncode,
		encodeMsg: $author$project$FancyForms$Form$encodeFormMsg,
		init: function (data) {
			return A2($author$project$FancyForms$Form$init, f, data);
		},
		innerAttributes: $author$project$FancyForms$FormState$noAttributes,
		isConsistent: f.isConsistent,
		update: F2(
			function (msg, model) {
				if (msg.$ === 'FormMsg') {
					var fieldId = msg.a;
					var subfieldId = msg.b;
					var value = msg.c;
					return $author$project$FancyForms$FormState$justChanged(
						A5($author$project$FancyForms$Form$updateField, f, fieldId, subfieldId, value, model));
				} else {
					return $author$project$FancyForms$FormState$justChangedInternally(model);
				}
			}),
		validate: f.validator,
		value: value_,
		view: F3(
			function (domId, innerAttrs, fs) {
				var model = fs.a;
				return A2(
					f.fn.view,
					$author$project$FancyForms$FormState$FormState(
						_Utils_update(
							model,
							{parentDomId: domId})),
					f.validator(
						value_(fs)));
			})
	};
};
var $author$project$Examples$Combination$dateInput = $author$project$FancyForms$Form$toWidget($author$project$Examples$Validation$myForm);
var $author$project$FancyForms$Widgets$Text$Blurred = {$: 'Blurred'};
var $author$project$FancyForms$Widgets$Text$Changed = function (a) {
	return {$: 'Changed', a: a};
};
var $author$project$FancyForms$Widgets$Text$Focused = {$: 'Focused'};
var $author$project$FancyForms$Widgets$Text$decoderMsg = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$andThen,
			function (s) {
				switch (s) {
					case 'Focused':
						return $elm$json$Json$Decode$succeed($author$project$FancyForms$Widgets$Text$Focused);
					case 'Blurred':
						return $elm$json$Json$Decode$succeed($author$project$FancyForms$Widgets$Text$Blurred);
					default:
						return $elm$json$Json$Decode$fail('Expected \'Focused\' or \'Blurred\'');
				}
			},
			$elm$json$Json$Decode$string),
			A2(
			$elm$json$Json$Decode$map,
			$author$project$FancyForms$Widgets$Text$Changed,
			A2($elm$json$Json$Decode$field, 'Changed', $elm$json$Json$Decode$string))
		]));
var $author$project$FancyForms$Widgets$Text$encodeMsg = function (msg) {
	switch (msg.$) {
		case 'Changed':
			var s = msg.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Changed',
						$elm$json$Json$Encode$string(s))
					]));
		case 'Focused':
			return $elm$json$Json$Encode$string('Focused');
		default:
			return $elm$json$Json$Encode$string('Blurred');
	}
};
var $author$project$FancyForms$Widgets$Text$textInput = function (attrs) {
	return {
		blur: $elm$core$Basics$identity,
		decoderModel: $elm$json$Json$Decode$string,
		decoderMsg: $author$project$FancyForms$Widgets$Text$decoderMsg,
		_default: '',
		encodeModel: $elm$json$Json$Encode$string,
		encodeMsg: $author$project$FancyForms$Widgets$Text$encodeMsg,
		init: $elm$core$Basics$identity,
		innerAttributes: $author$project$FancyForms$FormState$noAttributes,
		isConsistent: function (_v0) {
			return true;
		},
		update: F2(
			function (msg, model) {
				switch (msg.$) {
					case 'Focused':
						return $author$project$FancyForms$FormState$withFocus(model);
					case 'Blurred':
						return $author$project$FancyForms$FormState$withBlur(model);
					default:
						var s = msg.a;
						return $author$project$FancyForms$FormState$justChanged(s);
				}
			}),
		validate: $author$project$FancyForms$FormState$alwaysValid,
		value: $elm$core$Basics$identity,
		view: F3(
			function (domId, innerAttrs, model) {
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						$elm$core$List$concat(
							_List_fromArray(
								[
									attrs,
									innerAttrs,
									_List_fromArray(
									[
										$elm$html$Html$Attributes$id(domId),
										$elm$html$Html$Events$onInput($author$project$FancyForms$Widgets$Text$Changed),
										$elm$html$Html$Events$onFocus($author$project$FancyForms$Widgets$Text$Focused),
										$elm$html$Html$Events$onBlur($author$project$FancyForms$Widgets$Text$Blurred),
										$elm$html$Html$Attributes$value(model)
									])
								])),
						_List_Nil)
					]);
			})
	};
};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $author$project$Examples$Decoration$contentWithLabel = F3(
	function (labelText, domId, content) {
		return A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$for(domId)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(labelText)
					])),
			content);
	});
var $author$project$FancyForms$Form$wrap = F2(
	function (widget, container) {
		return _Utils_update(
			widget,
			{
				view: F3(
					function (domId, innerAttrs, model) {
						return A2(
							container,
							domId,
							A3(widget.view, domId, innerAttrs, model));
					})
			});
	});
var $author$project$Examples$Decoration$withLabel = F2(
	function (labelText, wrapped) {
		return A2(
			$author$project$FancyForms$Form$wrap,
			wrapped,
			$author$project$Examples$Decoration$contentWithLabel(labelText));
	});
var $author$project$Examples$Decoration$textInputWithLabel = function (labelText) {
	return A2(
		$author$project$Examples$Decoration$withLabel,
		labelText,
		$author$project$FancyForms$Widgets$Text$textInput(_List_Nil));
};
var $author$project$Examples$Decoration$myForm = A3(
	$author$project$FancyForms$Form$field,
	function ($) {
		return $.password;
	},
	A2(
		$author$project$Examples$Decoration$withLabel,
		'password',
		$author$project$FancyForms$Widgets$Text$textInput(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('password')
				]))),
	A3(
		$author$project$FancyForms$Form$field,
		function ($) {
			return $.username;
		},
		$author$project$Examples$Decoration$textInputWithLabel('username'),
		A4(
			$author$project$FancyForms$Form$form,
			F2(
				function (errors_, html) {
					return html;
				}),
			$author$project$FancyForms$FormState$alwaysValid,
			'decoration-example',
			F2(
				function (user, password) {
					return {
						combine: function (formState) {
							return {
								password: password.value(formState),
								username: user.value(formState)
							};
						},
						view: F2(
							function (formState, _v0) {
								return $elm$core$List$concat(
									_List_fromArray(
										[
											user.view(formState),
											password.view(formState)
										]));
							})
					};
				}))));
var $author$project$Examples$Combination$loginInput = $author$project$FancyForms$Form$toWidget($author$project$Examples$Decoration$myForm);
var $author$project$Examples$Combination$myForm = A3(
	$author$project$FancyForms$Form$field,
	function ($) {
		return $.birthday;
	},
	A2($author$project$Examples$Decoration$withLabel, 'birthday', $author$project$Examples$Combination$dateInput),
	A3(
		$author$project$FancyForms$Form$field,
		function ($) {
			return $.login;
		},
		$author$project$Examples$Combination$loginInput,
		A4(
			$author$project$FancyForms$Form$form,
			F2(
				function (errors_, html) {
					return html;
				}),
			$author$project$FancyForms$FormState$alwaysValid,
			'combination-example',
			F2(
				function (login, birthday) {
					return {
						combine: function (formState) {
							return {
								birthday: birthday.value(formState),
								login: login.value(formState)
							};
						},
						view: F2(
							function (formState, _v0) {
								return $elm$core$List$concat(
									_List_fromArray(
										[
											login.view(formState),
											birthday.view(formState)
										]));
							})
					};
				}))));
var $author$project$Examples$Combination$init = {
	formState: A2($author$project$FancyForms$Form$init, $author$project$Examples$Combination$myForm, $author$project$Examples$Combination$formDefaults)
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$FancyForms$Form$customEvent = $author$project$FancyForms$Form$CustomEvent;
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Examples$CustomEvents$doubleValues = _List_fromArray(
	[
		A2($elm$html$Html$hr, _List_Nil, _List_Nil),
		A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Events$onClick(
				$author$project$FancyForms$Form$customEvent(
					$elm$json$Json$Encode$int(2)))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Multiply')
			]))
	]);
var $author$project$Examples$CustomEvents$myForm = A3(
	$author$project$FancyForms$Form$field,
	$elm$core$Basics$identity,
	A2(
		$author$project$FancyForms$Form$validate,
		_List_fromArray(
			[
				$author$project$FancyForms$Widgets$Int$greaterThan(0)
			]),
		$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil)),
	A4(
		$author$project$FancyForms$Form$form,
		F2(
			function (errors_, html) {
				return html;
			}),
		$author$project$FancyForms$FormState$alwaysValid,
		'minimal-example',
		function (amount) {
			return {
				combine: function (formState) {
					return amount.value(formState);
				},
				view: F2(
					function (formState, _v0) {
						return _Utils_ap(
							$author$project$Examples$CustomEvents$doubleValues,
							amount.view(formState));
					})
			};
		}));
var $author$project$Examples$CustomEvents$init = {
	count: 0,
	formState: A2($author$project$FancyForms$Form$init, $author$project$Examples$CustomEvents$myForm, 42)
};
var $author$project$Examples$Decoration$default = {password: '', username: ''};
var $author$project$Examples$Decoration$init = {
	formState: A2($author$project$FancyForms$Form$init, $author$project$Examples$Decoration$myForm, $author$project$Examples$Decoration$default)
};
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Examples$Lists$role = function (value) {
	return A2($elm$html$Html$Attributes$attribute, 'role', value);
};
var $author$project$Examples$Lists$fieldWithRemoveButton = F2(
	function (removeMsg, input) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$fieldset,
				_List_fromArray(
					[
						$author$project$Examples$Lists$role('group')
					]),
				_Utils_ap(
					input,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(removeMsg)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Remove')
								]))
						])))
			]);
	});
var $author$project$FancyForms$Form$extractListInit = F5(
	function (widget, fieldId, valueExtractor, formModel, formState) {
		var values = valueExtractor(formModel);
		var encodedValues = A2(
			$elm$core$List$map,
			widget.encodeModel,
			A2($elm$core$List$map, widget.init, values));
		var encodedListValue = A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, encodedValues);
		return A4($author$project$FancyForms$FormState$write, fieldId, $author$project$FancyForms$FormState$SingleValue, formState, encodedListValue);
	});
var $author$project$FancyForms$Form$buildDomId = F3(
	function (parentDomId, fieldId, subfieldId) {
		return parentDomId + ('-' + (fieldId + function () {
			if (subfieldId.$ === 'SingleValue') {
				return '';
			} else {
				var i = subfieldId.a;
				return '-' + $elm$core$String$fromInt(i);
			}
		}()));
	});
var $author$project$FancyForms$Form$mkListField = F5(
	function (fieldWithErrors, listWithAddButton, fieldWithRemoveButton, fieldId, widget) {
		var deserializeModel = function (formState) {
			return A2(
				$elm$core$Result$withDefault,
				_List_Nil,
				A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list(widget.decoderModel),
					A2($author$project$FancyForms$FormState$read, fieldId, formState)));
		};
		var errors_ = function (formState) {
			return $elm$core$List$concat(
				A2(
					$elm$core$List$map,
					widget.validate,
					A2(
						$elm$core$List$map,
						widget.value,
						deserializeModel(formState))));
		};
		var value = function (formState) {
			return A2(
				$elm$core$List$map,
				widget.value,
				deserializeModel(formState));
		};
		var viewField = function (formState) {
			var parentDomId = formState.a.parentDomId;
			var toMsg_ = F2(
				function (i, html) {
					return A2(
						$elm$html$Html$map,
						function (msg) {
							return A3(
								$author$project$FancyForms$Form$FormMsg,
								fieldId,
								$author$project$FancyForms$FormState$ArrayElement(i),
								$author$project$FancyForms$FormState$Update(
									widget.encodeMsg(msg)));
						},
						html);
				});
			var toMsg = F2(
				function (i, html) {
					return A2(
						$elm$core$List$map,
						toMsg_(i),
						html);
				});
			var removeArrayElementMsg = function (x) {
				return A3(
					$author$project$FancyForms$Form$FormMsg,
					fieldId,
					$author$project$FancyForms$FormState$ArrayElement(x),
					$author$project$FancyForms$FormState$Remove);
			};
			var fieldErrors = A3($author$project$FancyForms$FormState$wasAtLeast, $author$project$FancyForms$FormState$Blurred, fieldId, formState) ? errors_(formState) : _List_Nil;
			var arrayElementHtml = F2(
				function (i, model) {
					return A3(
						widget.view,
						A3(
							$author$project$FancyForms$Form$buildDomId,
							parentDomId,
							fieldId,
							$author$project$FancyForms$FormState$ArrayElement(i)),
						_List_Nil,
						model);
				});
			var addRemoveButton = F2(
				function (i, html) {
					return A2(
						fieldWithRemoveButton,
						removeArrayElementMsg(i),
						html);
				});
			var inputHtml = $elm$core$List$concat(
				A2(
					$elm$core$List$indexedMap,
					addRemoveButton,
					A2(
						$elm$core$List$indexedMap,
						toMsg,
						A2(
							$elm$core$List$indexedMap,
							arrayElementHtml,
							deserializeModel(formState)))));
			var addArrayElementMsg = A3(
				$author$project$FancyForms$Form$FormMsg,
				fieldId,
				$author$project$FancyForms$FormState$ArrayElement(0),
				$author$project$FancyForms$FormState$Add);
			var addArrayElement = function (html) {
				return A2(listWithAddButton, addArrayElementMsg, html);
			};
			return A2(
				fieldWithErrors,
				fieldErrors,
				addArrayElement(inputHtml));
		};
		return {errors: errors_, id: fieldId, multiple: true, value: value, view: viewField};
	});
var $author$project$FancyForms$Form$listField = F6(
	function (listWithAddButton, fieldWithRemoveButton, template, extractDefault, widget, _v0) {
		var fn = _v0.fn;
		var count = _v0.count;
		var updates = _v0.updates;
		var fieldWithErrors = _v0.fieldWithErrors;
		var validator = _v0.validator;
		var blur = _v0.blur;
		var domId = _v0.domId;
		var isConsistent = _v0.isConsistent;
		var initWithData = _v0.initWithData;
		var fieldId = $elm$core$String$fromInt(count);
		return {
			blur: A2(
				$elm$core$Basics$composeR,
				blur,
				A2($author$project$FancyForms$FormState$blurChildren, fieldId, widget)),
			count: count + 1,
			domId: domId,
			fieldWithErrors: fieldWithErrors,
			fn: fn(
				A5($author$project$FancyForms$Form$mkListField, fieldWithErrors, listWithAddButton, fieldWithRemoveButton, fieldId, widget)),
			initWithData: A2(
				$author$project$FancyForms$Form$extendInit,
				initWithData,
				A3($author$project$FancyForms$Form$extractListInit, widget, fieldId, extractDefault)),
			isConsistent: A2(
				$author$project$FancyForms$Form$extendConsistencyCheck,
				isConsistent,
				A2($author$project$FancyForms$Form$extractConsistencyCheck, widget, fieldId)),
			updates: A3(
				$elm$core$Dict$insert,
				$elm$core$String$fromInt(count),
				A2(
					$author$project$FancyForms$Form$encodedUpdate,
					widget,
					$elm$core$Maybe$Just(template)),
				updates),
			validator: validator
		};
	});
var $author$project$Examples$Lists$listWithAddButton = F2(
	function (addMsg, items) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_Utils_ap(
					items,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(addMsg)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Add todo')
								]))
						])))
			]);
	});
var $author$project$Examples$Lists$myForm = A6(
	$author$project$FancyForms$Form$listField,
	$author$project$Examples$Lists$listWithAddButton,
	$author$project$Examples$Lists$fieldWithRemoveButton,
	'a new todo',
	$elm$core$Basics$identity,
	$author$project$FancyForms$Widgets$Text$textInput(_List_Nil),
	A4(
		$author$project$FancyForms$Form$form,
		F2(
			function (_v0, html) {
				return html;
			}),
		$author$project$FancyForms$FormState$alwaysValid,
		'lists-example',
		function (todos) {
			return {
				combine: function (formState) {
					return todos.value(formState);
				},
				view: F2(
					function (formState, _v1) {
						return todos.view(formState);
					})
			};
		}));
var $author$project$Examples$Lists$init = {
	formState: A2(
		$author$project$FancyForms$Form$init,
		$author$project$Examples$Lists$myForm,
		_List_fromArray(
			['yay!']))
};
var $author$project$Examples$Minimal$myForm = A3(
	$author$project$FancyForms$Form$field,
	$elm$core$Basics$identity,
	A2(
		$author$project$FancyForms$Form$validate,
		_List_fromArray(
			[
				$author$project$FancyForms$Widgets$Int$greaterThan(0)
			]),
		$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil)),
	A4(
		$author$project$FancyForms$Form$form,
		F2(
			function (errors_, html) {
				return html;
			}),
		$author$project$FancyForms$FormState$alwaysValid,
		'minimal-example',
		function (amount) {
			return {
				combine: function (formState) {
					return amount.value(formState);
				},
				view: F2(
					function (formState, _v0) {
						return amount.view(formState);
					})
			};
		}));
var $author$project$Examples$Minimal$init = {
	formState: A2($author$project$FancyForms$Form$init, $author$project$Examples$Minimal$myForm, 42)
};
var $author$project$Examples$Validation$init = {
	formState: A2(
		$author$project$FancyForms$Form$init,
		$author$project$Examples$Validation$myForm,
		{day: 1, month: 1, year: 2000})
};
var $author$project$Examples$Variants$Phone = F2(
	function (a, b) {
		return {$: 'Phone', a: a, b: b};
	});
var $author$project$Examples$Variants$default = A2($author$project$Examples$Variants$Phone, 1, 1234);
var $mgold$elm_nonempty_list$List$Nonempty$Nonempty = F2(
	function (a, b) {
		return {$: 'Nonempty', a: a, b: b};
	});
var $mgold$elm_nonempty_list$List$Nonempty$filter = F3(
	function (p, d, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		if (p(x)) {
			return A2(
				$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
				x,
				A2($elm$core$List$filter, p, xs));
		} else {
			var _v1 = A2($elm$core$List$filter, p, xs);
			if (!_v1.b) {
				return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, d, _List_Nil);
			} else {
				var y = _v1.a;
				var ys = _v1.b;
				return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, y, ys);
			}
		}
	});
var $mgold$elm_nonempty_list$List$Nonempty$head = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return x;
};
var $author$project$FancyForms$Widgets$Dropdown$fromString = F2(
	function (nel, s) {
		return $mgold$elm_nonempty_list$List$Nonempty$head(
			A3(
				$mgold$elm_nonempty_list$List$Nonempty$filter,
				function (_v0) {
					var id = _v0.id;
					return _Utils_eq(s, id);
				},
				$mgold$elm_nonempty_list$List$Nonempty$head(nel),
				nel)).value;
	});
var $author$project$FancyForms$Widgets$Dropdown$init = F2(
	function (variants, v) {
		return $mgold$elm_nonempty_list$List$Nonempty$head(
			A3(
				$mgold$elm_nonempty_list$List$Nonempty$filter,
				function (_v0) {
					var value = _v0.value;
					return _Utils_eq(value, v);
				},
				$mgold$elm_nonempty_list$List$Nonempty$head(variants),
				variants)).id;
	});
var $author$project$FancyForms$Widgets$Dropdown$update = F2(
	function (id, _v0) {
		return $author$project$FancyForms$FormState$justChanged(id);
	});
var $mgold$elm_nonempty_list$List$Nonempty$toList = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return A2($elm$core$List$cons, x, xs);
};
var $author$project$FancyForms$Widgets$Dropdown$all = $mgold$elm_nonempty_list$List$Nonempty$toList;
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$FancyForms$Widgets$Dropdown$view = F4(
	function (variants, _v0, innerAttrs, selectedId) {
		var selectedValue = A2($author$project$FancyForms$Widgets$Dropdown$fromString, variants, selectedId);
		var opt = function (_v1) {
			var id = _v1.id;
			var label = _v1.label;
			var value = _v1.value;
			return A2(
				$elm$html$Html$option,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(id),
						$elm$html$Html$Attributes$selected(
						_Utils_eq(selectedValue, value))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(label)
					]));
		};
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$select,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown'),
							$elm$html$Html$Events$onInput($elm$core$Basics$identity)
						]),
					innerAttrs),
				A2(
					$elm$core$List$map,
					opt,
					$author$project$FancyForms$Widgets$Dropdown$all(variants)))
			]);
	});
var $author$project$FancyForms$Widgets$Dropdown$dropdown = function (variants) {
	return {
		blur: $elm$core$Basics$identity,
		decoderModel: $elm$json$Json$Decode$string,
		decoderMsg: $elm$json$Json$Decode$string,
		_default: $mgold$elm_nonempty_list$List$Nonempty$head(variants).value,
		encodeModel: $elm$json$Json$Encode$string,
		encodeMsg: $elm$json$Json$Encode$string,
		init: $author$project$FancyForms$Widgets$Dropdown$init(variants),
		innerAttributes: $author$project$FancyForms$FormState$noAttributes,
		isConsistent: function (_v0) {
			return true;
		},
		update: $author$project$FancyForms$Widgets$Dropdown$update,
		validate: $author$project$FancyForms$FormState$alwaysValid,
		value: $author$project$FancyForms$Widgets$Dropdown$fromString(variants),
		view: $author$project$FancyForms$Widgets$Dropdown$view(variants)
	};
};
var $author$project$Examples$Variants$Email = function (a) {
	return {$: 'Email', a: a};
};
var $author$project$Examples$Variants$email_ = function (c) {
	if (c.$ === 'Email') {
		var email = c.a;
		return email;
	} else {
		return '';
	}
};
var $author$project$Examples$Variants$emailForm = A3(
	$author$project$FancyForms$Form$field,
	$author$project$Examples$Variants$email_,
	$author$project$FancyForms$Widgets$Text$textInput(_List_Nil),
	A4(
		$author$project$FancyForms$Form$form,
		F2(
			function (errors_, html) {
				return html;
			}),
		$author$project$FancyForms$FormState$alwaysValid,
		'email-form',
		function (email) {
			return {
				combine: function (formState) {
					return $author$project$Examples$Variants$Email(
						email.value(formState));
				},
				view: F2(
					function (formState, _v0) {
						return email.view(formState);
					})
			};
		}));
var $mgold$elm_nonempty_list$List$Nonempty$append = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var xs = _v0.b;
		var y = _v1.a;
		var ys = _v1.b;
		return A2(
			$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
			x,
			_Utils_ap(
				xs,
				A2($elm$core$List$cons, y, ys)));
	});
var $author$project$FancyForms$Widgets$VariantSelect$selectorFieldId = 'selectorValue';
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$FancyForms$Widgets$VariantSelect$variantWidgetInit = F3(
	function (variantWidgets, extractVariantName, value_) {
		var variantInit = F2(
			function (_v0, dict) {
				var variantName = _v0.a;
				var variantW = _v0.b;
				return function (v) {
					return A3($elm$core$Dict$insert, variantName, v, dict);
				}(
					variantW.encodeModel(
						variantW.init(value_)));
			});
		var values = A2(
			$elm$core$Dict$singleton,
			$author$project$FancyForms$Widgets$VariantSelect$selectorFieldId,
			$elm$json$Json$Encode$string(
				extractVariantName(value_)));
		var values_ = A3(
			$elm$core$List$foldl,
			variantInit,
			values,
			$mgold$elm_nonempty_list$List$Nonempty$toList(variantWidgets));
		return $author$project$FancyForms$FormState$FormState(
			{allBlurred: false, fieldStatus: $elm$core$Dict$empty, parentDomId: '0', values: values_});
	});
var $author$project$FancyForms$Form$extractVariantInit = F6(
	function (variantsWithWidgets, fieldId, valueExtractor, variantNameExtractor, formModel, formState) {
		var value = valueExtractor(formModel);
		var encodedValue = $author$project$FancyForms$FormState$formStateEncode(
			A3($author$project$FancyForms$Widgets$VariantSelect$variantWidgetInit, variantsWithWidgets, variantNameExtractor, value));
		return A4($author$project$FancyForms$FormState$write, fieldId, $author$project$FancyForms$FormState$SingleValue, formState, encodedValue);
	});
var $mgold$elm_nonempty_list$List$Nonempty$fromList = function (ys) {
	if (ys.b) {
		var x = ys.a;
		var xs = ys.b;
		return $elm$core$Maybe$Just(
			A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mgold$elm_nonempty_list$List$Nonempty$map = F2(
	function (f, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		return A2(
			$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
			f(x),
			A2($elm$core$List$map, f, xs));
	});
var $mgold$elm_nonempty_list$List$Nonempty$singleton = function (x) {
	return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, _List_Nil);
};
var $author$project$FancyForms$Widgets$VariantSelect$blur = F3(
	function (variantSelector, variantWidgets, formState) {
		var withBlurredSelector = A3($author$project$FancyForms$FormState$blurChildren, $author$project$FancyForms$Widgets$VariantSelect$selectorFieldId, variantSelector, formState);
		var folder = F2(
			function (_v0, fs) {
				var fieldId = _v0.a;
				var widget = _v0.b;
				return A3($author$project$FancyForms$FormState$blurChildren, fieldId, widget, fs);
			});
		return A3($elm$core$List$foldl, folder, withBlurredSelector, variantWidgets);
	});
var $author$project$FancyForms$Widgets$VariantSelect$ForVariant = F2(
	function (a, b) {
		return {$: 'ForVariant', a: a, b: b};
	});
var $author$project$FancyForms$Widgets$VariantSelect$ForVariantSelect = function (a) {
	return {$: 'ForVariantSelect', a: a};
};
var $author$project$FancyForms$Widgets$VariantSelect$decoderMsg = A2(
	$elm$json$Json$Decode$andThen,
	function (kind) {
		switch (kind) {
			case 'ForVariantSelect':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$FancyForms$Widgets$VariantSelect$ForVariantSelect,
					A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$value));
			case 'ForVariant':
				return A3(
					$elm$json$Json$Decode$map2,
					$author$project$FancyForms$Widgets$VariantSelect$ForVariant,
					A2($elm$json$Json$Decode$field, 'variantName', $elm$json$Json$Decode$string),
					A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$value));
			default:
				return $elm$json$Json$Decode$fail('unknown kind');
		}
	},
	A2($elm$json$Json$Decode$field, 'kind', $elm$json$Json$Decode$string));
var $author$project$FancyForms$Widgets$VariantSelect$encodeMsg = function (msg) {
	if (msg.$ === 'ForVariantSelect') {
		var v = msg.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'kind',
					$elm$json$Json$Encode$string('ForVariantSelect')),
					_Utils_Tuple2('value', v)
				]));
	} else {
		var variantName = msg.a;
		var v = msg.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'kind',
					$elm$json$Json$Encode$string('ForVariant')),
					_Utils_Tuple2(
					'variantName',
					$elm$json$Json$Encode$string(variantName)),
					_Utils_Tuple2('value', v)
				]));
	}
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$FancyForms$Widgets$VariantSelect$value = F3(
	function (defaultVariantName, widget, formState) {
		return A2(
			$elm$core$Result$withDefault,
			defaultVariantName,
			A2(
				$elm$core$Result$map,
				widget.value,
				A2(
					$elm$json$Json$Decode$decodeValue,
					widget.decoderModel,
					A2($author$project$FancyForms$FormState$read, $author$project$FancyForms$Widgets$VariantSelect$selectorFieldId, formState))));
	});
var $author$project$FancyForms$Widgets$VariantSelect$selectedValue = F3(
	function (variantSelectWidget, variantWidgets, model) {
		var defaultVariantName = $mgold$elm_nonempty_list$List$Nonempty$head(variantWidgets).a;
		var selectedVariantName = A3($author$project$FancyForms$Widgets$VariantSelect$value, defaultVariantName, variantSelectWidget, model);
		var selectedWidget = A2(
			$elm$core$Maybe$withDefault,
			$mgold$elm_nonempty_list$List$Nonempty$head(variantWidgets),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var name = _v0.a;
						return _Utils_eq(name, selectedVariantName);
					},
					$mgold$elm_nonempty_list$List$Nonempty$toList(variantWidgets)))).b;
		return A2(
			$elm$core$Result$withDefault,
			selectedWidget._default,
			A2(
				$elm$core$Result$map,
				selectedWidget.value,
				A2(
					$elm$json$Json$Decode$decodeValue,
					selectedWidget.decoderModel,
					A2($author$project$FancyForms$FormState$read, selectedVariantName, model))));
	});
var $author$project$FancyForms$FormState$encodedUpdate = F4(
	function (widget, subfieldId, operation, modelVal) {
		var decoderMsg = widget.decoderMsg;
		var decoderModel = widget.decoderModel;
		var encodeModel = widget.encodeModel;
		var encodeSubfield = function (updatedModel) {
			if (subfieldId.$ === 'SingleValue') {
				return encodeModel(updatedModel);
			} else {
				var i = subfieldId.a;
				return A2(
					$elm$json$Json$Encode$list,
					encodeModel,
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (idx, e) {
								return _Utils_eq(idx, i) ? updatedModel : e;
							}),
						A2(
							$elm$core$Result$withDefault,
							_List_Nil,
							A2(
								$elm$json$Json$Decode$decodeValue,
								$elm$json$Json$Decode$list(decoderModel),
								modelVal))));
			}
		};
		var decodeSubfield = function () {
			if (subfieldId.$ === 'SingleValue') {
				return decoderModel;
			} else {
				var i = subfieldId.a;
				return A2($elm$json$Json$Decode$index, i, decoderModel);
			}
		}();
		var _v0 = _Utils_Tuple2(operation, subfieldId);
		_v0$3:
		while (true) {
			switch (_v0.a.$) {
				case 'Add':
					if (_v0.b.$ === 'ArrayElement') {
						var _v1 = _v0.a;
						return function (list) {
							return A2(
								$elm$json$Json$Encode$list,
								encodeModel,
								_Utils_ap(
									list,
									_List_fromArray(
										[
											widget.init(widget._default)
										])));
						}(
							A2(
								$elm$core$Result$withDefault,
								_List_Nil,
								A2(
									$elm$json$Json$Decode$decodeValue,
									$elm$json$Json$Decode$list(decoderModel),
									modelVal)));
					} else {
						break _v0$3;
					}
				case 'Remove':
					if (_v0.b.$ === 'ArrayElement') {
						var _v2 = _v0.a;
						var i = _v0.b.a;
						return A2(
							$elm$json$Json$Encode$list,
							encodeModel,
							function (list) {
								return _Utils_ap(
									A2($elm$core$List$take, i, list),
									A2($elm$core$List$drop, i + 1, list));
							}(
								A2(
									$elm$core$Result$withDefault,
									_List_Nil,
									A2(
										$elm$json$Json$Decode$decodeValue,
										$elm$json$Json$Decode$list(decoderModel),
										modelVal))));
					} else {
						break _v0$3;
					}
				default:
					var msgVal = _v0.a.a;
					var _v3 = _Utils_Tuple2(
						A2($elm$json$Json$Decode$decodeValue, decoderMsg, msgVal),
						A2($elm$json$Json$Decode$decodeValue, decodeSubfield, modelVal));
					if ((_v3.a.$ === 'Ok') && (_v3.b.$ === 'Ok')) {
						var msg = _v3.a.a;
						var model = _v3.b.a;
						return encodeSubfield(
							A2(widget.update, msg, model).model);
					} else {
						return modelVal;
					}
			}
		}
		return modelVal;
	});
var $author$project$FancyForms$Widgets$VariantSelect$widgetByName = F2(
	function (variantWidgets, variantName) {
		return A2(
			$elm$core$Maybe$withDefault,
			$mgold$elm_nonempty_list$List$Nonempty$head(variantWidgets).b,
			$elm$core$List$head(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$second,
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var name = _v0.a;
							return _Utils_eq(name, variantName);
						},
						$mgold$elm_nonempty_list$List$Nonempty$toList(variantWidgets)))));
	});
var $author$project$FancyForms$Widgets$VariantSelect$update = F4(
	function (variantSelector, variantWidgets, msg, model) {
		if (msg.$ === 'ForVariant') {
			var variantName = msg.a;
			var subMsgVal = msg.b;
			return A4(
				$author$project$FancyForms$FormState$write,
				variantName,
				$author$project$FancyForms$FormState$SingleValue,
				model,
				A4(
					$author$project$FancyForms$FormState$encodedUpdate,
					A2($author$project$FancyForms$Widgets$VariantSelect$widgetByName, variantWidgets, variantName),
					$author$project$FancyForms$FormState$SingleValue,
					$author$project$FancyForms$FormState$Update(subMsgVal),
					A2($author$project$FancyForms$FormState$read, variantName, model)));
		} else {
			var subMsgVal = msg.a;
			return A4(
				$author$project$FancyForms$FormState$write,
				$author$project$FancyForms$Widgets$VariantSelect$selectorFieldId,
				$author$project$FancyForms$FormState$SingleValue,
				model,
				A4(
					$author$project$FancyForms$FormState$encodedUpdate,
					variantSelector,
					$author$project$FancyForms$FormState$SingleValue,
					$author$project$FancyForms$FormState$Update(subMsgVal),
					A2($author$project$FancyForms$FormState$read, $author$project$FancyForms$Widgets$VariantSelect$selectorFieldId, model)));
		}
	});
var $author$project$FancyForms$FormState$subId = F3(
	function (parentDomId, fieldId, subfieldId) {
		return A2(
			$elm$core$String$join,
			'-',
			_List_fromArray(
				[
					parentDomId,
					A2($author$project$FancyForms$FormState$toKey, fieldId, subfieldId)
				]));
	});
var $author$project$FancyForms$Widgets$VariantSelect$view = F6(
	function (defaultVariantName, variantSelectWidget, variantWidgets, domId, innerAttrs, model) {
		var variantView = function (_v1) {
			var variantName = _v1.a;
			var variantW = _v1.b;
			return A2(
				$elm$core$Result$withDefault,
				_List_fromArray(
					[
						$elm$html$Html$text('Could not decode variant')
					]),
				A2(
					$elm$core$Result$map,
					function (variantModel) {
						return A2(
							$elm$core$List$map,
							function (html) {
								return A2(
									$elm$html$Html$map,
									function (m) {
										return A2(
											$author$project$FancyForms$Widgets$VariantSelect$ForVariant,
											variantName,
											variantW.encodeMsg(m));
									},
									html);
							},
							A3(
								variantW.view,
								_Utils_ap(domId, variantName),
								_List_Nil,
								variantModel));
					},
					A2(
						$elm$json$Json$Decode$decodeValue,
						variantW.decoderModel,
						A2($author$project$FancyForms$FormState$read, variantName, model))));
		};
		var selectedVariantName = A3($author$project$FancyForms$Widgets$VariantSelect$value, defaultVariantName, variantSelectWidget, model);
		var variantSelectorHtml = A2(
			$elm$core$List$map,
			$elm$html$Html$map(
				function (msg) {
					return $author$project$FancyForms$Widgets$VariantSelect$ForVariantSelect(
						variantSelectWidget.encodeMsg(msg));
				}),
			A3(
				variantSelectWidget.view,
				A3($author$project$FancyForms$FormState$subId, domId, $author$project$FancyForms$Widgets$VariantSelect$selectorFieldId, $author$project$FancyForms$FormState$SingleValue),
				_List_Nil,
				variantSelectWidget.init(selectedVariantName)));
		var variantsHtml = $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				variantView,
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var name = _v0.a;
						return _Utils_eq(name, selectedVariantName);
					},
					variantWidgets)));
		return _Utils_ap(variantSelectorHtml, variantsHtml);
	});
var $author$project$FancyForms$Widgets$VariantSelect$variantWidget = F4(
	function (variantSelector, variantNameExtractor, defaultVariantName, variantWidgets) {
		return {
			blur: A2(
				$author$project$FancyForms$Widgets$VariantSelect$blur,
				variantSelector,
				$mgold$elm_nonempty_list$List$Nonempty$toList(variantWidgets)),
			decoderModel: $author$project$FancyForms$FormState$formStateDecoder,
			decoderMsg: $author$project$FancyForms$Widgets$VariantSelect$decoderMsg,
			_default: $mgold$elm_nonempty_list$List$Nonempty$head(variantWidgets).b._default,
			encodeModel: $author$project$FancyForms$FormState$formStateEncode,
			encodeMsg: $author$project$FancyForms$Widgets$VariantSelect$encodeMsg,
			init: A2($author$project$FancyForms$Widgets$VariantSelect$variantWidgetInit, variantWidgets, variantNameExtractor),
			innerAttributes: $author$project$FancyForms$FormState$noAttributes,
			isConsistent: function (_v0) {
				return true;
			},
			update: F2(
				function (msg, model) {
					return $author$project$FancyForms$FormState$justChanged(
						A4($author$project$FancyForms$Widgets$VariantSelect$update, variantSelector, variantWidgets, msg, model));
				}),
			validate: $author$project$FancyForms$FormState$alwaysValid,
			value: A2($author$project$FancyForms$Widgets$VariantSelect$selectedValue, variantSelector, variantWidgets),
			view: A3(
				$author$project$FancyForms$Widgets$VariantSelect$view,
				defaultVariantName,
				variantSelector,
				$mgold$elm_nonempty_list$List$Nonempty$toList(variantWidgets))
		};
	});
var $author$project$FancyForms$Form$fieldWithVariants = F6(
	function (extractDefault, variantSelector, defaultVariant, otherVariants, extractVariantName, _v0) {
		var fn = _v0.fn;
		var count = _v0.count;
		var updates = _v0.updates;
		var fieldWithErrors = _v0.fieldWithErrors;
		var validator = _v0.validator;
		var blur = _v0.blur;
		var domId = _v0.domId;
		var isConsistent = _v0.isConsistent;
		var initWithData = _v0.initWithData;
		var toWidgetVariant = function (_v3) {
			var n = _v3.a;
			var f = _v3.b;
			return _Utils_Tuple2(
				n,
				$author$project$FancyForms$Form$toWidget(f));
		};
		var otherAsNonEmptyList = $mgold$elm_nonempty_list$List$Nonempty$fromList(
			A2($elm$core$List$map, toWidgetVariant, otherVariants));
		var mkVariant = function (_v2) {
			var name = _v2.a;
			return {id: name, label: name, value: name};
		};
		var fieldId = $elm$core$String$fromInt(count);
		var defaultAsNonEmptyList = $mgold$elm_nonempty_list$List$Nonempty$singleton(
			toWidgetVariant(defaultVariant));
		var variantsWithWidgets = function () {
			if (otherAsNonEmptyList.$ === 'Just') {
				var nel = otherAsNonEmptyList.a;
				return A2($mgold$elm_nonempty_list$List$Nonempty$append, defaultAsNonEmptyList, nel);
			} else {
				return defaultAsNonEmptyList;
			}
		}();
		var widget = A4(
			$author$project$FancyForms$Widgets$VariantSelect$variantWidget,
			variantSelector(
				A2($mgold$elm_nonempty_list$List$Nonempty$map, mkVariant, variantsWithWidgets)),
			extractVariantName,
			$mgold$elm_nonempty_list$List$Nonempty$head(variantsWithWidgets).a,
			variantsWithWidgets);
		return {
			blur: A2(
				$elm$core$Basics$composeR,
				blur,
				A2($author$project$FancyForms$FormState$blurChildren, fieldId, widget)),
			count: count + 1,
			domId: domId,
			fieldWithErrors: fieldWithErrors,
			fn: fn(
				A3($author$project$FancyForms$Form$mkField, fieldWithErrors, fieldId, widget)),
			initWithData: A2(
				$author$project$FancyForms$Form$extendInit,
				initWithData,
				A4($author$project$FancyForms$Form$extractVariantInit, variantsWithWidgets, fieldId, extractDefault, extractVariantName)),
			isConsistent: A2(
				$author$project$FancyForms$Form$extendConsistencyCheck,
				isConsistent,
				A2($author$project$FancyForms$Form$extractConsistencyCheck, widget, fieldId)),
			updates: A3(
				$elm$core$Dict$insert,
				fieldId,
				A2($author$project$FancyForms$Form$encodedUpdate, widget, $elm$core$Maybe$Nothing),
				updates),
			validator: validator
		};
	});
var $author$project$Examples$Variants$countryCode_ = function (c) {
	if (c.$ === 'Email') {
		return 0;
	} else {
		var cc = c.a;
		return cc;
	}
};
var $author$project$Examples$Variants$number_ = function (c) {
	if (c.$ === 'Email') {
		return 0;
	} else {
		var n = c.b;
		return n;
	}
};
var $author$project$Examples$Variants$phoneForm = A3(
	$author$project$FancyForms$Form$field,
	$author$project$Examples$Variants$number_,
	$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil),
	A3(
		$author$project$FancyForms$Form$field,
		$author$project$Examples$Variants$countryCode_,
		$author$project$FancyForms$Widgets$Int$integerInput(_List_Nil),
		A4(
			$author$project$FancyForms$Form$form,
			F2(
				function (errors_, html) {
					return html;
				}),
			$author$project$FancyForms$FormState$alwaysValid,
			'email-form',
			F2(
				function (countryCode, number) {
					return {
						combine: function (formState) {
							return A2(
								$author$project$Examples$Variants$Phone,
								countryCode.value(formState),
								number.value(formState));
						},
						view: F2(
							function (formState, _v0) {
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('grid')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_Nil,
												countryCode.view(formState)),
												A2(
												$elm$html$Html$div,
												_List_Nil,
												number.view(formState))
											]))
									]);
							})
					};
				}))));
var $author$project$FancyForms$Widgets$RadioButtons$fromString = F2(
	function (nel, s) {
		return $mgold$elm_nonempty_list$List$Nonempty$head(
			A3(
				$mgold$elm_nonempty_list$List$Nonempty$filter,
				function (_v0) {
					var id = _v0.id;
					return _Utils_eq(s, id);
				},
				$mgold$elm_nonempty_list$List$Nonempty$head(nel),
				nel)).value;
	});
var $author$project$FancyForms$Widgets$RadioButtons$init = F2(
	function (variants, v) {
		return $mgold$elm_nonempty_list$List$Nonempty$head(
			A3(
				$mgold$elm_nonempty_list$List$Nonempty$filter,
				function (_v0) {
					var value = _v0.value;
					return _Utils_eq(value, v);
				},
				$mgold$elm_nonempty_list$List$Nonempty$head(variants),
				variants)).id;
	});
var $author$project$FancyForms$Widgets$RadioButtons$update = F2(
	function (id, _v0) {
		return $author$project$FancyForms$FormState$justChanged(id);
	});
var $author$project$FancyForms$Widgets$RadioButtons$all = $mgold$elm_nonempty_list$List$Nonempty$toList;
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$FancyForms$Widgets$RadioButtons$view = F4(
	function (variants, _v0, innerAttrs, selectedId) {
		var selectedValue = A2($author$project$FancyForms$Widgets$RadioButtons$fromString, variants, selectedId);
		var opt = function (_v2) {
			var id = _v2.id;
			var label = _v2.label;
			var value = _v2.value;
			return A2(
				$elm$html$Html$label,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('radio'),
									$elm$html$Html$Attributes$value(id),
									$elm$html$Html$Attributes$checked(
									_Utils_eq(selectedValue, value)),
									$elm$html$Html$Events$onInput(
									function (_v1) {
										return id;
									})
								]),
							innerAttrs),
						_List_Nil),
						$elm$html$Html$text(label)
					]));
		};
		return A2(
			$elm$core$List$map,
			opt,
			$author$project$FancyForms$Widgets$RadioButtons$all(variants));
	});
var $author$project$FancyForms$Widgets$RadioButtons$radioButtons = function (variants) {
	return {
		blur: $elm$core$Basics$identity,
		decoderModel: $elm$json$Json$Decode$string,
		decoderMsg: $elm$json$Json$Decode$string,
		_default: $mgold$elm_nonempty_list$List$Nonempty$head(variants).value,
		encodeModel: $elm$json$Json$Encode$string,
		encodeMsg: $elm$json$Json$Encode$string,
		init: $author$project$FancyForms$Widgets$RadioButtons$init(variants),
		innerAttributes: $author$project$FancyForms$FormState$noAttributes,
		isConsistent: function (_v0) {
			return true;
		},
		update: $author$project$FancyForms$Widgets$RadioButtons$update,
		validate: $author$project$FancyForms$FormState$alwaysValid,
		value: $author$project$FancyForms$Widgets$RadioButtons$fromString(variants),
		view: $author$project$FancyForms$Widgets$RadioButtons$view(variants)
	};
};
var $author$project$Examples$Variants$variantToString = function (c) {
	if (c.$ === 'Email') {
		return 'email';
	} else {
		return 'phone';
	}
};
var $author$project$Examples$Variants$myForm = function (useRadioButtons) {
	return A6(
		$author$project$FancyForms$Form$fieldWithVariants,
		$elm$core$Basics$identity,
		useRadioButtons ? $author$project$FancyForms$Widgets$RadioButtons$radioButtons : $author$project$FancyForms$Widgets$Dropdown$dropdown,
		_Utils_Tuple2('email', $author$project$Examples$Variants$emailForm),
		_List_fromArray(
			[
				_Utils_Tuple2('phone', $author$project$Examples$Variants$phoneForm)
			]),
		$author$project$Examples$Variants$variantToString,
		A4(
			$author$project$FancyForms$Form$form,
			F2(
				function (errors_, html) {
					return html;
				}),
			$author$project$FancyForms$FormState$alwaysValid,
			'variant-example',
			function (contact) {
				return {
					combine: function (formState) {
						return contact.value(formState);
					},
					view: F2(
						function (formState, _v0) {
							return contact.view(formState);
						})
				};
			}));
};
var $author$project$Examples$Variants$init = {
	formState: A2(
		$author$project$FancyForms$Form$init,
		$author$project$Examples$Variants$myForm(false),
		$author$project$Examples$Variants$default),
	useRadioButtons: false
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{combination: $author$project$Examples$Combination$init, customEvents: $author$project$Examples$CustomEvents$init, decoration: $author$project$Examples$Decoration$init, expanded: $elm$core$Set$empty, lists: $author$project$Examples$Lists$init, minimal: $author$project$Examples$Minimal$init, validation: $author$project$Examples$Validation$init, variants: $author$project$Examples$Variants$init},
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$exampleAsStr = function (example) {
	switch (example.$) {
		case 'Minimal':
			return 'Minimal';
		case 'Validation':
			return 'Validation';
		case 'Decoration':
			return 'Decoration';
		case 'Combination':
			return 'Combination';
		case 'Lists':
			return 'Lists';
		case 'Variants':
			return 'Variants';
		default:
			return 'CustomEvents';
	}
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$Main$isExpanded = F2(
	function (example, model) {
		return A2(
			$elm$core$Set$member,
			$author$project$Main$exampleAsStr(example),
			model.expanded);
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$remove, key, dict));
	});
var $author$project$FancyForms$Form$update = F3(
	function (form_, msg, formState) {
		if (msg.$ === 'FormMsg') {
			var fieldId = msg.a;
			var subfieldId = msg.b;
			var op = msg.c;
			return A5($author$project$FancyForms$Form$updateField, form_, fieldId, subfieldId, op, formState);
		} else {
			return formState;
		}
	});
var $author$project$Examples$Combination$update = F2(
	function (msg, model) {
		var formMsg = msg.a;
		return _Utils_update(
			model,
			{
				formState: A3($author$project$FancyForms$Form$update, $author$project$Examples$Combination$myForm, formMsg, model.formState)
			});
	});
var $author$project$FancyForms$Form$getCustomEvent = function (msg) {
	if (msg.$ === 'CustomEvent') {
		var v = msg.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$FancyForms$Form$extract = function (_v0) {
	var fn = _v0.fn;
	return fn.combine;
};
var $author$project$Examples$CustomEvents$multiply = F2(
	function (n, formState) {
		return A2(
			$author$project$FancyForms$Form$init,
			$author$project$Examples$CustomEvents$myForm,
			function (i) {
				return i * n;
			}(
				A2($author$project$FancyForms$Form$extract, $author$project$Examples$CustomEvents$myForm, formState)));
	});
var $author$project$Examples$CustomEvents$update = F2(
	function (msg, model) {
		var formMsg = msg.a;
		var _v1 = A2(
			$elm$core$Maybe$map,
			$elm$json$Json$Decode$decodeValue($elm$json$Json$Decode$int),
			$author$project$FancyForms$Form$getCustomEvent(formMsg));
		if ((_v1.$ === 'Just') && (_v1.a.$ === 'Ok')) {
			var n = _v1.a.a;
			return _Utils_update(
				model,
				{
					count: model.count + 1,
					formState: A2($author$project$Examples$CustomEvents$multiply, n, model.formState)
				});
		} else {
			return _Utils_update(
				model,
				{
					formState: A3($author$project$FancyForms$Form$update, $author$project$Examples$CustomEvents$myForm, formMsg, model.formState)
				});
		}
	});
var $author$project$Examples$Decoration$update = F2(
	function (msg, model) {
		var formMsg = msg.a;
		return _Utils_update(
			model,
			{
				formState: A3($author$project$FancyForms$Form$update, $author$project$Examples$Decoration$myForm, formMsg, model.formState)
			});
	});
var $author$project$Examples$Lists$update = F2(
	function (msg, model) {
		var formMsg = msg.a;
		return _Utils_update(
			model,
			{
				formState: A3($author$project$FancyForms$Form$update, $author$project$Examples$Lists$myForm, formMsg, model.formState)
			});
	});
var $author$project$Examples$Minimal$update = F2(
	function (msg, model) {
		var formMsg = msg.a;
		return _Utils_update(
			model,
			{
				formState: A3($author$project$FancyForms$Form$update, $author$project$Examples$Minimal$myForm, formMsg, model.formState)
			});
	});
var $author$project$Examples$Validation$update = F2(
	function (msg, model) {
		if (msg.$ === 'ForForm') {
			var formMsg = msg.a;
			return _Utils_update(
				model,
				{
					formState: A3($author$project$FancyForms$Form$update, $author$project$Examples$Validation$myForm, formMsg, model.formState)
				});
		} else {
			return model;
		}
	});
var $author$project$Examples$Variants$update = F2(
	function (msg, model) {
		if (msg.$ === 'ForForm') {
			var formMsg = msg.a;
			return _Utils_update(
				model,
				{
					formState: A3(
						$author$project$FancyForms$Form$update,
						$author$project$Examples$Variants$myForm(false),
						formMsg,
						model.formState)
				});
		} else {
			return _Utils_update(
				model,
				{useRadioButtons: !model.useRadioButtons});
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Toggle':
				var example = msg.a;
				return A2($author$project$Main$isExpanded, example, model) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							expanded: A2(
								$elm$core$Set$remove,
								$author$project$Main$exampleAsStr(example),
								model.expanded)
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							expanded: A2(
								$elm$core$Set$insert,
								$author$project$Main$exampleAsStr(example),
								model.expanded)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ForMinimal':
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							minimal: A2($author$project$Examples$Minimal$update, subMsg, model.minimal)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ForValidation':
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							validation: A2($author$project$Examples$Validation$update, subMsg, model.validation)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ForDecoration':
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							decoration: A2($author$project$Examples$Decoration$update, subMsg, model.decoration)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ForCombination':
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							combination: A2($author$project$Examples$Combination$update, subMsg, model.combination)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ForLists':
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							lists: A2($author$project$Examples$Lists$update, subMsg, model.lists)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ForVariants':
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							variants: A2($author$project$Examples$Variants$update, subMsg, model.variants)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var subMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							customEvents: A2($author$project$Examples$CustomEvents$update, subMsg, model.customEvents)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme = function (a) {
	return {$: 'Theme', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule = function (a) {
	return {$: 'AtRule', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$ClassExtends = {$: 'ClassExtends'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Css = function (a) {
	return {$: 'Css', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$DeclarationKeyword = {$: 'DeclarationKeyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Elm = function (a) {
	return {$: 'Elm', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex = function (a) {
	return {$: 'Hex', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier = {$: 'Identifier'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Javascript = function (a) {
	return {$: 'Javascript', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Property = {$: 'Property'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature = {$: 'TypeSignature'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$bold = function (style) {
	return _Utils_update(
		style,
		{isBold: true});
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$italic = function (style) {
	return _Utils_update(
		style,
		{isItalic: true});
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$DefaultColor = {$: 'DefaultColor'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$backgroundColor = function (background) {
	return {background: background, isBold: false, isItalic: false, isUnderline: false, text: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$DefaultColor};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$noEmphasis = F2(
	function (text, background) {
		return {background: background, isBold: false, isItalic: false, isUnderline: false, text: text};
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor = function (text) {
	return {background: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$DefaultColor, isBold: false, isItalic: false, isUnderline: false, text: text};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Monokai$requiredStyles = {
	addition: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$backgroundColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#003800')),
	comment: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#75715e')),
	_default: A2(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$noEmphasis,
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#f8f8f2'),
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#23241f')),
	deletion: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$backgroundColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#380000')),
	highlight: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$backgroundColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#343434')),
	style1: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#ae81ff')),
	style2: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#e6db74')),
	style3: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#f92672')),
	style4: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#66d9ef')),
	style5: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#a6e22e')),
	style6: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#ae81ff')),
	style7: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#fd971f'))
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Monokai$theme = {
	customStyles: _List_fromArray(
		[
			_Utils_Tuple2(
			_List_fromArray(
				[
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Elm($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Javascript($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$DeclarationKeyword),
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Css($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Property)
				]),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$italic(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#66d9ef')))),
			_Utils_Tuple2(
			_List_fromArray(
				[
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Javascript($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$ClassExtends)
				]),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$italic(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#a6e22e')))),
			_Utils_Tuple2(
			_List_fromArray(
				[
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$Css(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier))
				]),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$bold(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$textColor(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Hex('#f92672'))))
		]),
	requiredStyles: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Monokai$requiredStyles
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1 = {$: 'Style1'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2 = {$: 'Style2'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3 = {$: 'Style3'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4 = {$: 'Style4'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5 = {$: 'Style5'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleToFragment = function (a) {
	switch (a.$) {
		case 'Identifier':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-ar-i');
		case 'Prefix':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-ar-p');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-ar-k');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'css-ar-v');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default = {$: 'Default'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7 = {$: 'Style7'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelectorToFragment = function (att) {
	switch (att.$) {
		case 'AttributeName':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-s-a-an');
		case 'AttributeValue':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'css-s-a-av');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-s-a-o');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selectorToFragment = function (s) {
	switch (s.$) {
		case 'Element':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-s-e');
		case 'Id':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-s-i');
		case 'Class':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-s-cl');
		case 'Combinator':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'css-s-c');
		case 'Universal':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-s-u');
		case 'AttributeSelector':
			var att = s.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelectorToFragment(att);
		case 'PseudoElement':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'css-s-pe');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'css-s-pc');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'css-s');
		case 'AtRule':
			var a = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleToFragment(a);
		case 'Selector':
			var s = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selectorToFragment(s);
		case 'Property':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'css-p');
		case 'PropertyValue':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'css-pv');
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'css-n');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-u');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6 = {$: 'Style6'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'elm-s');
		case 'BasicSymbol':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'elm-bs');
		case 'GroupSymbol':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'elm-gs');
		case 'Capitalized':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'elm-c');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'elm-k');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'elm-f');
		case 'TypeSignature':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'elm-ts');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'elm-n');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'js-n');
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'js-s');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'js-k');
		case 'DeclarationKeyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'js-dk');
		case 'FunctionEval':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'js-fe');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'js-f');
		case 'LiteralKeyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'js-lk');
		case 'Param':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'js-p');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'js-ce');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Nix$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'nix-n');
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'nix-s');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'nix-k');
		case 'Operator':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'nix-o');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'nix-f');
		case 'Punctuation':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'nix-p');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'nix-l');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$syntaxToStyle = function (syntax) {
	return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'nolang');
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Python$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'py-n');
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'py-s');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'py-k');
		case 'DeclarationKeyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'py-dk');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'py-f');
		case 'LiteralKeyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'py-lk');
		case 'Param':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'py-p');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'py-fe');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Sql$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'sql-n');
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'sql-s');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'sql-k');
		case 'Operator':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'sql-o');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'sql-f');
		case 'Punctuation':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'sql-p');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'sql-l');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Xml$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'Tag':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'xml-t');
		case 'Attribute':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'xml-a');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'xlm-av');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$syntaxToSelector = function (syntax) {
	switch (syntax.$) {
		case 'Elm':
			var elmSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$syntaxToStyle(elmSyntax).b;
		case 'Xml':
			var xmlSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Xml$syntaxToStyle(xmlSyntax).b;
		case 'Javascript':
			var jsSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$syntaxToStyle(jsSyntax).b;
		case 'Css':
			var cssSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$syntaxToStyle(cssSyntax).b;
		case 'Python':
			var pythonSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Python$syntaxToStyle(pythonSyntax).b;
		case 'Sql':
			var sqlSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Sql$syntaxToStyle(sqlSyntax).b;
		case 'Nix':
			var nixSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Nix$syntaxToStyle(nixSyntax).b;
		default:
			var noLangSyntax = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$syntaxToStyle(noLangSyntax).b;
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$syntaxesToSelectors = function (syntaxes) {
	return $elm$core$String$concat(
		A2(
			$elm$core$List$intersperse,
			', ',
			A2(
				$elm$core$List$map,
				$elm$core$Basics$append('.elmsh-'),
				A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$syntaxToSelector, syntaxes))));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$colorToCss = F2(
	function (property, color) {
		switch (color.$) {
			case 'DefaultColor':
				return '';
			case 'Hex':
				var hex = color.a;
				return property + (hex + ';');
			case 'Rgb':
				var r = color.a;
				var g = color.b;
				var b = color.c;
				return $elm$core$String$concat(
					_List_fromArray(
						[
							property,
							'rgb(',
							$elm$core$String$fromInt(r),
							', ',
							$elm$core$String$fromInt(g),
							',',
							$elm$core$String$fromInt(b),
							');'
						]));
			default:
				var r = color.a;
				var g = color.b;
				var b = color.c;
				var a = color.d;
				return $elm$core$String$concat(
					_List_fromArray(
						[
							property,
							'rgba(',
							$elm$core$String$fromInt(r),
							', ',
							$elm$core$String$fromInt(g),
							',',
							$elm$core$String$fromInt(b),
							', ',
							$elm$core$String$fromFloat(a),
							');'
						]));
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$emptyIfFalse = F2(
	function (bool, str) {
		return bool ? str : '';
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$styleToCss = function (_v0) {
	var isBold = _v0.isBold;
	var isItalic = _v0.isItalic;
	var isUnderline = _v0.isUnderline;
	var text = _v0.text;
	var background = _v0.background;
	return $elm$core$String$concat(
		_List_fromArray(
			[
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$emptyIfFalse, isBold, 'font-weight: bold;'),
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$emptyIfFalse, isItalic, 'font-style: italic;'),
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$emptyIfFalse, isUnderline, 'text-decoration: underline;'),
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$colorToCss, 'color: ', text),
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$colorToCss, 'background: ', background)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$toCssClass = function (_v0) {
	var selectors = _v0.a;
	var style = _v0.b;
	return $elm$core$String$isEmpty(selectors) ? '' : (selectors + (' {' + ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$styleToCss(style) + '}')));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$toCss = function (classes) {
	return $elm$core$String$concat(
		A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$toCssClass, classes));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$toCss = function (_v0) {
	var requiredStyles = _v0.requiredStyles;
	var customStyles = _v0.customStyles;
	return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$toCss(
		_Utils_ap(
			_List_fromArray(
				[
					_Utils_Tuple2('.elmsh', requiredStyles._default),
					_Utils_Tuple2('.elmsh-hl', requiredStyles.highlight),
					_Utils_Tuple2('.elmsh-add', requiredStyles.addition),
					_Utils_Tuple2('.elmsh-del', requiredStyles.deletion),
					_Utils_Tuple2('.elmsh-comm', requiredStyles.comment),
					_Utils_Tuple2('.elmsh1', requiredStyles.style1),
					_Utils_Tuple2('.elmsh2', requiredStyles.style2),
					_Utils_Tuple2('.elmsh3', requiredStyles.style3),
					_Utils_Tuple2('.elmsh4', requiredStyles.style4),
					_Utils_Tuple2('.elmsh5', requiredStyles.style5),
					_Utils_Tuple2('.elmsh6', requiredStyles.style6),
					_Utils_Tuple2('.elmsh7', requiredStyles.style7)
				]),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapFirst($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$syntaxesToSelectors),
				customStyles)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Monokai$css = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Type$toCss($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Monokai$theme);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$monokai = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$Monokai$css;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$monokai = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Theme$monokai);
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$useTheme = function (_v0) {
	var theme = _v0.a;
	return A3(
		$elm$html$Html$node,
		'style',
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(theme)
			]));
};
var $author$project$Main$Combination = {$: 'Combination'};
var $author$project$Main$ForCombination = function (a) {
	return {$: 'ForCombination', a: a};
};
var $elm_explorations$markdown$Markdown$defaultOptions = {
	defaultHighlighting: $elm$core$Maybe$Nothing,
	githubFlavored: $elm$core$Maybe$Just(
		{breaks: false, tables: false}),
	sanitize: true,
	smartypants: false
};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm_explorations$markdown$Markdown$toHtmlWith = _Markdown_toHtml;
var $elm_explorations$markdown$Markdown$toHtml = $elm_explorations$markdown$Markdown$toHtmlWith($elm_explorations$markdown$Markdown$defaultOptions);
var $author$project$Main$combinationMarkdown = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nThe main difference to other form libraries is that we can create custom input widgets.\nAnd the easiest way to do that is to turn **a form** into an **input widget**.\n\nHere we are reusing the _"login"_ form from the "Decoration example" and the _"date"_ form\nfrom the "Validation example".\n\nWe can use the `Form.toWidget` function to convert a form into an input widget.\nThese will yield a field that collects a _input value_ of the type that the form that we\nconverted collects.\n\nFor this to work, all widgets need to use the same custom `Error` type. Throughout these examples\nwe consistently use the `MyError` type.\n');
var $author$project$Examples$Combination$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$FancyForms$FormState$NotValid = {$: 'NotValid'};
var $author$project$FancyForms$Form$addInvalidIfInconsistent = F3(
	function (form_, formState, errors) {
		return form_.isConsistent(formState) ? errors : A2($elm$core$List$cons, $author$project$FancyForms$FormState$NotValid, errors);
	});
var $author$project$FancyForms$Form$render = F3(
	function (toMsg, form_, formState) {
		return A2(
			$elm$core$List$map,
			$elm$html$Html$map(toMsg),
			A2(
				form_.fn.view,
				formState,
				A3(
					$author$project$FancyForms$Form$addInvalidIfInconsistent,
					form_,
					formState,
					form_.validator(
						form_.fn.combine(formState)))));
	});
var $author$project$Examples$Combination$view = function (model) {
	var data = A2($author$project$FancyForms$Form$extract, $author$project$Examples$Combination$myForm, model.formState);
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3($author$project$FancyForms$Form$render, $author$project$Examples$Combination$ForForm, $author$project$Examples$Combination$myForm, model.formState)),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The user entered: '),
						A2($elm$html$Html$br, _List_Nil, _List_Nil),
						$elm$html$Html$text('login: '),
						$elm$html$Html$text(data.login.username),
						$elm$html$Html$text(':'),
						$elm$html$Html$text(data.login.password)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('day: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(data.birthday.day)),
						$elm$html$Html$text(' month: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(data.birthday.month)),
						$elm$html$Html$text(' year: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(data.birthday.year))
					]))
			]));
};
var $author$project$Main$CustomEvents = {$: 'CustomEvents'};
var $author$project$Main$Decoration = {$: 'Decoration'};
var $author$project$Main$Lists = {$: 'Lists'};
var $author$project$Main$Minimal = {$: 'Minimal'};
var $author$project$Main$Validation = {$: 'Validation'};
var $author$project$Main$Variants = {$: 'Variants'};
var $author$project$Examples$Code$Combination$code = '\nmodule Examples.Combination exposing (..)\n\nimport Examples.Decoration exposing (Login, withLabel)\nimport Examples.Validation exposing (Date, MyError)\nimport FancyForms.Form as Form exposing (Form, field)\nimport FancyForms.FormState exposing (FormState, alwaysValid)\nimport Html exposing (br, div, p, text)\nimport String exposing (fromInt)\n\n\ntype alias Model =\n    { formState : FormState }\n\n\ntype Msg\n    = ForForm Form.Msg\n\n\ntype alias Signup =\n    { login : Login\n    , birthday : Date\n    }\n\n\nloginInput =\n    Form.toWidget Examples.Decoration.myForm\n\n\ndateInput =\n    Form.toWidget Examples.Validation.myForm\n\n\nmyForm : Form Signup MyError\nmyForm =\n    Form.form\n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n        "combination-example"\n        (\\login birthday ->\n            { view =\n                \\formState _ ->\n                    List.concat\n                        [ login.view formState\n                        , birthday.view formState\n                        ]\n            , combine =\n                \\formState ->\n                    { login = login.value formState\n                    , birthday = birthday.value formState\n                    }\n            }\n        )\n        |> field .login loginInput\n        |> field .birthday (dateInput |> withLabel "birthday")\n\n\nview model =\n    let\n        data =\n            Form.extract myForm model.formState\n    in\n    div []\n        [ div [] <| Form.render ForForm myForm model.formState\n        , p []\n            [ text "The user entered: "\n            , br [] []\n            , text "login: "\n            , text <| data.login.username\n            , text ":"\n            , text <| data.login.password\n            ]\n        , p []\n            [ text "day: "\n            , text <| fromInt data.birthday.day\n            , text " month: "\n            , text <| fromInt data.birthday.month\n            , text " year: "\n            , text <| fromInt data.birthday.year\n            ]\n        ]\n\n\ninit =\n    { formState = Form.init myForm formDefaults }\n\n\nformDefaults =\n    { login = emptyLogin\n    , birthday = defaultDate\n    }\n\n\nemptyLogin =\n    { username = ""\n    , password = ""\n    }\n\n\ndefaultDate =\n    { day = 1\n    , month = 1\n    , year = 1970\n    }\n\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            { model | formState = Form.update myForm formMsg model.formState }\n';
var $author$project$Examples$Code$CustomEvents$code = '\nmodule Examples.CustomEvents exposing (..)\n\nimport FancyForms.Form as Form exposing (Form, field, getCustomEvent)\nimport FancyForms.FormState exposing (FormState, alwaysValid)\nimport FancyForms.Widgets.Int exposing (integerInput)\nimport Html exposing (div, p, text)\nimport String exposing (fromInt)\nimport FancyForms.Form exposing (validate)\nimport FancyForms.Widgets.Int exposing (greaterThan)\nimport Html exposing (hr)\nimport Html exposing (button)\nimport Html.Events exposing (onClick)\nimport FancyForms.Form exposing (customEvent)\nimport Json.Encode\nimport Json.Decode\n\n\ntype alias Model =\n    { formState : FormState\n    , count : Int\n    }\n\ntype Msg\n    = ForForm Form.Msg\n\nmyForm : Form Int ()\nmyForm =\n    Form.form\n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n         "minimal-example" -- unique id to be used in DOM\n        (\\amount ->\n            { view = \\formState _ -> \n                amount.view formState\n                |> (++) doubleValues\n            , combine = \\formState -> amount.value formState\n            }\n        )\n        |> field identity (integerInput [] |> validate [greaterThan 0])\n\ndoubleValues = \n    [ hr [] []\n    , button \n        [ onClick <| customEvent <| Json.Encode.int 2 ] \n        [ text "Multiply"]\n    ]\n\nview model =\n    div []\n        [ div [] <| Form.render ForForm myForm model.formState\n        , p []\n            [ text "The user entered: "\n            , text <| fromInt <| Form.extract myForm model.formState\n            ]\n        , p [] \n            [ text "The number of custom events is: "\n            , text <| fromInt model.count\n            ]\n        ]\n\ninit =\n    { formState = Form.init myForm 42\n    , count = 0\n    }\n\nmultiply : Int -> FormState -> FormState\nmultiply n formState =\n    Form.extract myForm formState \n    |> (\\i -> i * n)\n    |> Form.init myForm\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            case getCustomEvent formMsg |> Maybe.map (Json.Decode.decodeValue Json.Decode.int) of\n                Just (Ok n) -> \n                    { model \n                    | count = model.count + 1 \n                    , formState = multiply n model.formState\n                    }\n                _ -> \n                    { model | formState = Form.update myForm formMsg model.formState }\n';
var $author$project$Examples$Code$Decoration$code = '\nmodule Examples.Decoration exposing (..)\n\nimport Examples.Validation exposing (MyError)\nimport FancyForms.Form as Form exposing (Form, field)\nimport FancyForms.FormState exposing (FormState, Widget, alwaysValid)\nimport FancyForms.Widgets.Text exposing (textInput)\nimport Html exposing (div, label, p, text)\nimport Html.Attributes exposing (for, type_)\n\n\ntype alias Model =\n    { formState : FormState }\n\n\ntype Msg\n    = ForForm Form.Msg\n\n\ntype alias Login =\n    { username : String\n    , password : String\n    }\n\n\ncontentWithLabel labelText domId content =\n    label [ for domId ] [ text labelText ] :: content\n\n\nwithLabel :\n    String\n    -> Widget widgetModel msg value customError\n    -> Widget widgetModel msg value customError\nwithLabel labelText wrapped =\n    Form.wrap wrapped <| contentWithLabel labelText\n\n\ntextInputWithLabel labelText =\n    textInput [] |> withLabel labelText\n\n\nmyForm : Form Login MyError\nmyForm =\n    Form.form\n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n        "decoration-example"\n        (\\user password ->\n            { view =\n                \\formState _ ->\n                    List.concat\n                        [ user.view formState\n                        , password.view formState\n                        ]\n            , combine =\n                \\formState ->\n                    { username = user.value formState\n                    , password = password.value formState\n                    }\n            }\n        )\n        |> field .username (textInputWithLabel "username")\n        |> field .password (textInput [ type_ "password" ] |> withLabel "password")\n\n\nview model =\n    div []\n        [ div [] <| Form.render ForForm myForm model.formState\n        , p []\n            [ text "The user entered: "\n            , text <| .username <| Form.extract myForm model.formState\n            , text ":"\n            , text <| .password <| Form.extract myForm model.formState\n            ]\n        ]\n\n\ninit =\n    { formState = Form.init myForm default }\n\n\ndefault =\n    { username = ""\n    , password = ""\n    }\n\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            { model | formState = Form.update myForm formMsg model.formState }\n';
var $author$project$Examples$Code$Lists$code = '\nmodule Examples.Lists exposing (..)\n\nimport FancyForms.Form as Form exposing (Form, listField)\nimport FancyForms.FormState exposing (FormState, alwaysValid)\nimport FancyForms.Widgets.Text exposing (textInput)\nimport Html exposing (Attribute, button, div, fieldset, p, text)\nimport Html.Attributes exposing (attribute)\nimport Html.Events exposing (onClick)\n\n\ntype alias Model =\n    { formState : FormState }\n\n\ntype Msg\n    = ForForm Form.Msg\n\n\nmyForm : Form (List String) ()\nmyForm =\n    Form.form\n        (\\_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n        "lists-example"\n        (\\todos ->\n            { view = \\formState _ -> todos.view formState\n            , combine = \\formState -> todos.value formState\n            }\n        )\n        |> listField\n            listWithAddButton\n            fieldWithRemoveButton\n            "a new todo"\n            identity\n            (textInput [])\n\nfieldWithRemoveButton removeMsg input =\n    [ fieldset [ role "group" ] <|\n        input\n            ++ [ button [ onClick removeMsg ] [ text "Remove" ] ]\n    ]\n\nlistWithAddButton addMsg items =\n    [ div [] <|\n        items\n            ++ [ button [ onClick addMsg ] [ text "Add todo" ] ]\n    ]\n\nview model =\n    div []\n        [ div [] <| Form.render ForForm myForm model.formState\n        , p []\n            (text "The user entered: "\n                :: (List.map (\\todo -> div [] [ text todo ]) <| Form.extract myForm model.formState)\n            )\n        ]\n\n\ninit =\n    { formState = Form.init myForm [ "yay!" ] }\n\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            { model | formState = Form.update myForm formMsg model.formState }\n\n\nrole : String -> Attribute msg\nrole value =\n    attribute "role" value\n';
var $author$project$Examples$Code$Minimal$code = '\nmodule Examples.Minimal exposing (..)\n\nimport FancyForms.Form as Form exposing (Form, field)\nimport FancyForms.FormState exposing (FormState, alwaysValid)\nimport FancyForms.Widgets.Int exposing (integerInput)\nimport Html exposing (div, p, text)\nimport String exposing (fromInt)\nimport FancyForms.Form exposing (validate)\nimport FancyForms.Widgets.Int exposing (greaterThan)\n\n\ntype alias Model =\n    { formState : FormState }\n\ntype Msg\n    = ForForm Form.Msg\n\nmyForm : Form Int ()\nmyForm =\n    Form.form\n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n         "minimal-example" -- unique id to be used in DOM\n        (\\amount ->\n            { view = \\formState _ -> amount.view formState\n            , combine = \\formState -> amount.value formState\n            }\n        )\n        |> field identity (integerInput [] |> validate [greaterThan 0])\n\nview model =\n    div []\n        [ div [] <| Form.render ForForm myForm model.formState\n        , p []\n            [ text "The user entered: "\n            , text <| fromInt <| Form.extract myForm model.formState\n            ]\n        ]\n\ninit =\n    { formState = Form.init myForm 42 }\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            { model | formState = Form.update myForm formMsg model.formState }\n';
var $author$project$Examples$Code$Validation$code = '\nmodule Examples.Validation exposing (..)\n\nimport FancyForms.Form as Form exposing (FieldWithErrors, Form, field, validate)\nimport FancyForms.FormState exposing (Error(..), FormState)\nimport FancyForms.Widgets.Int exposing (greaterThan, integerInput, lesserThan)\nimport Html exposing (Html, button, div, label, p, text)\nimport Html.Attributes exposing (class, classList, disabled)\nimport Html.Events exposing (onClick)\nimport String exposing (fromInt)\nimport Html.Attributes exposing (attribute)\nimport Html exposing (small)\n\n\ntype alias Model =\n    { formState : FormState }\n\n\ntype Msg\n    = ForForm Form.Msg\n    | Submit\n\n\ntype alias Date =\n    { day : Int\n    , month : Int\n    , year : Int\n    }\n\n\ntype MyError\n    = MustNotBeGreaterThanDaysInMonth Int\n\n\ndaysOfMonthValidator : Date -> List (Error MyError)\ndaysOfMonthValidator { day, month, year } =\n    if day > daysInMonth month year then\n        [ CustomError <| MustNotBeGreaterThanDaysInMonth (daysInMonth month year) ]\n\n    else\n        []\n\n\nviewErrors : List (Error MyError) -> Html msg\nviewErrors errors =\n    if List.isEmpty errors then\n        text ""\n\n    else\n        small []\n            [ List.map errorToString errors\n                |> String.join " "\n                |> text\n            ]\n\n\nfieldWithErrors : FieldWithErrors MyError\nfieldWithErrors errors html =\n    [ div [ classList [ ( "has-error", not <| List.isEmpty errors ) ] ]\n        (html ++ [ viewErrors errors ])\n    ]\n\n\nmyForm : Form Date MyError\nmyForm =\n    Form.form \n        fieldWithErrors\n        daysOfMonthValidator\n        "validation-example"\n        (\\day month year ->\n            { view =\n                \\formState errors ->\n                    [ div [ class "errors" ]\n                        [ List.map errorToString errors\n                            |> String.join " "\n                            |> text\n                        ]\n                    , div [ class "grid" ] <|\n                        [ label [] <| text "Day:" :: day.view formState\n                        , label [] <| text "Month:" :: month.view formState\n                        , label [] <| text "Year: " :: year.view formState\n                        ]\n                    ]\n            , combine =\n                \\formState ->\n                    { day = day.value formState\n                    , month = month.value formState\n                    , year = year.value formState\n                    }\n            }\n        )\n        |> field .day (integerInput [] |> validate [ greaterThan 0 ])\n        |> field .month (integerInput [] |> validate [ greaterThan 0, lesserThan 13 ])\n        |> field .year (integerInput [] |> validate [ greaterThan 1900 ])\n\nmarkAsInvalid errors _ =\n    if List.isEmpty errors then\n        []\n    else\n        [attribute "aria-invalid" "true"]\n\ntakeDay : Date -> Int\ntakeDay { day } =\n    day\n\n\nerrorToString : Error MyError -> String\nerrorToString e =\n    case e of\n        NotValid ->\n            ""\n\n        MustNotBeBlank ->\n            "must not be blank"\n\n        MustBeGreaterThan n ->\n            "must be greater than " ++ n\n\n        MustBeLesserThan n ->\n            "must be lower than " ++ n\n\n        CustomError ce ->\n            case ce of\n                MustNotBeGreaterThanDaysInMonth daysInMonth_ ->\n                    "There are only " ++ String.fromInt daysInMonth_ ++ " days in this month"\n\n\nview model =\n    div []\n        [ div [] <| Form.render ForForm myForm model.formState\n        , div []\n            [ button\n                [ onClick Submit\n                , disabled <| not <| Form.isValid myForm model.formState\n                ]\n                [ text "Submit" ]\n            ]\n        , p [] [ text "The user entered: " ]\n        , viewDate <| Form.extract myForm model.formState\n        ]\n\n\ninit =\n    { formState = Form.init myForm { day = 1, month = 1, year = 2000 } }\n\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            { model | formState = Form.update myForm formMsg model.formState }\n\n        Submit ->\n            model\n\n\nviewDate { day, month, year } =\n    div []\n        [ div []\n            [ text "day: "\n            , text <| fromInt day\n            , text " month: "\n            , text <| fromInt month\n            , text " year: "\n            , text <| fromInt year\n            ]\n        ]\n\n\ndaysInMonth : Int -> Int -> Int\ndaysInMonth month year =\n    case month of\n        1 ->\n            31\n\n        2 ->\n            if (modBy 4 year == 0) && (modBy 100 year /= 0) || (modBy 400 year == 0) then\n                29\n\n            else\n                28\n\n        3 ->\n            31\n\n        5 ->\n            31\n\n        7 ->\n            31\n\n        8 ->\n            31\n\n        10 ->\n            31\n\n        12 ->\n            31\n\n        _ ->\n            30\n';
var $author$project$Examples$Code$Variants$code = '\nmodule Examples.Variants exposing (..)\n\nimport FancyForms.Form as Form exposing (Form, field, fieldWithVariants)\nimport FancyForms.FormState exposing (FormState, alwaysValid)\nimport FancyForms.Widgets.Dropdown exposing (dropdown)\nimport FancyForms.Widgets.RadioButtons exposing (radioButtons)\nimport FancyForms.Widgets.Int exposing (integerInput)\nimport FancyForms.Widgets.Text exposing (textInput)\nimport Html exposing (div, p, text)\nimport Html.Attributes exposing (class)\nimport String exposing (fromInt)\n\n\ntype alias Model =\n    { formState : FormState \n    , useRadioButtons : Bool\n    }\n\n\ntype Msg\n    = ForForm Form.Msg\n    | ToggleSwitcher\n\n\ntype Contact\n    = Email String\n    | Phone Int Int\n\n\nmyForm : Bool -> Form Contact ()\nmyForm useRadioButtons =\n    Form.form \n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n        "variant-example"\n        (\\contact ->\n            { view = \\formState _ -> contact.view formState\n            , combine = \\formState -> contact.value formState\n            }\n        )\n        |> fieldWithVariants \n            identity\n            (if useRadioButtons then radioButtons else dropdown)\n            ( "email", emailForm )\n            [ ( "phone", phoneForm ) ]\n            variantToString\n\n\nvariantToString : Contact -> String\nvariantToString c =\n    case c of\n        Email _ ->\n            "email"\n\n        Phone _ _ ->\n            "phone"\n\n\nemailForm : Form Contact ()\nemailForm =\n    Form.form\n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n         "email-form"\n        (\\email ->\n            { view = \\formState _ -> email.view formState\n            , combine = \\formState -> Email <| email.value formState\n            }\n        )\n        |> field email_ (textInput [])\n\n\nemail_ : Contact -> String\nemail_ c =\n    case c of\n        Email email ->\n            email\n\n        Phone _ _ ->\n            ""\n\n\nphoneForm : Form Contact ()\nphoneForm =\n    Form.form\n        (\\errors_ html -> html) -- omitting errors for brevity\n        alwaysValid -- no custom validations\n        "email-form"\n        (\\countryCode number ->\n            { view =\n                \\formState _ ->\n                    [ div [ class "grid" ]\n                        [ div [] <| countryCode.view formState\n                        , div [] <| number.view formState\n                        ]\n                    ]\n            , combine = \\formState -> Phone (countryCode.value formState) (number.value formState)\n            }\n        )\n        |> field countryCode_ (integerInput [])\n        |> field number_ (integerInput [])\n\n\ncountryCode_ : Contact -> Int\ncountryCode_ c =\n    case c of\n        Email _ ->\n            0\n\n        Phone cc _ ->\n            cc\n\n\nnumber_ : Contact -> Int\nnumber_ c =\n    case c of\n        Email _ ->\n            0\n\n        Phone _ n ->\n            n\n\n\nview {formState, useRadioButtons} =\n    div []\n        [ div [] <| Form.render ForForm (myForm useRadioButtons) formState\n        , p []\n            [ text "The user entered: "\n            , case Form.extract (myForm False) formState of\n                Email email ->\n                    text <| "Email: " ++ email\n\n                Phone countryCode number ->\n                    text <| "Phone: " ++ fromInt countryCode ++ " " ++ fromInt number\n            ]\n        ]\n\n\ndefault =\n    Phone 1 1234\n\n\ninit =\n    { formState = Form.init (myForm False) default \n    , useRadioButtons = False\n    }\n\n\nupdate : Msg -> Model -> Model\nupdate msg model =\n    case msg of\n        ForForm formMsg ->\n            { model | formState = Form.update (myForm False) formMsg model.formState }\n        ToggleSwitcher ->\n            { model | useRadioButtons = not model.useRadioButtons }\n';
var $author$project$Main$examples = _List_fromArray(
	[
		{
		code: $author$project$Examples$Code$Minimal$code,
		example: $author$project$Main$Minimal,
		range: _Utils_Tuple2(12, 48),
		subTitle: 'The simplest possible form',
		title: 'Getting started'
	},
		{
		code: $author$project$Examples$Code$Validation$code,
		example: $author$project$Main$Validation,
		range: _Utils_Tuple2(16, 90),
		subTitle: 'How to add validations to individual fields and entire forms',
		title: 'Validations'
	},
		{
		code: $author$project$Examples$Code$Decoration$code,
		example: $author$project$Main$Decoration,
		range: _Utils_Tuple2(19, 61),
		subTitle: 'Controlling markup of fields without changing widgets',
		title: 'Decoration/Wrapping of input widgets'
	},
		{
		code: $author$project$Examples$Code$Combination$code,
		example: $author$project$Main$Combination,
		range: _Utils_Tuple2(19, 53),
		subTitle: 'How to turn forms into input widgets',
		title: 'Combination: Reusing forms by combining them'
	},
		{
		code: $author$project$Examples$Code$Lists$code,
		example: $author$project$Main$Lists,
		range: _Utils_Tuple2(19, 48),
		subTitle: 'How to add repeatable elements to a form',
		title: 'Lists'
	},
		{
		code: $author$project$Examples$Code$Variants$code,
		example: $author$project$Main$Variants,
		range: _Utils_Tuple2(13, 45),
		subTitle: 'Letting the user choose between multiple sub forms',
		title: 'Variants'
	},
		{
		code: $author$project$Examples$Code$CustomEvents$code,
		example: $author$project$Main$CustomEvents,
		range: _Utils_Tuple2(25, 73),
		subTitle: 'Emitting custom events from the form',
		title: 'Custom events'
	}
	]);
var $author$project$Main$findExample = function (example) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (e) {
				return _Utils_eq(e.example, example);
			},
			$author$project$Main$examples));
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$article = _VirtualDom_node('article');
var $author$project$Main$htmlMap = F2(
	function (toMsg, html) {
		return A2(
			$elm$html$Html$article,
			_List_Nil,
			_List_fromArray(
				[
					A2($elm$html$Html$map, toMsg, html)
				]));
	});
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Main$Toggle = function (a) {
	return {$: 'Toggle', a: a};
};
var $elm$parser$Parser$deadEndsToString = function (deadEnds) {
	return 'TODO deadEndsToString';
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode = function (a) {
	return {$: 'HCode', a: a};
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$newLine = function (fragments) {
	return {fragments: fragments, highlight: $elm$core$Maybe$Nothing};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak = {$: 'LineBreak'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Comment = {$: 'Comment'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment = F2(
	function (toStyle, _v0) {
		var syntax = _v0.a;
		var text = _v0.b;
		switch (syntax.$) {
			case 'Normal':
				return {additionalClass: '', requiredStyle: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, text: text};
			case 'Comment':
				return {additionalClass: '', requiredStyle: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Comment, text: text};
			case 'LineBreak':
				return {additionalClass: '', requiredStyle: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, text: text};
			default:
				var c = syntax.a;
				var _v2 = toStyle(c);
				var requiredStyle = _v2.a;
				var additionalClass = _v2.b;
				return {additionalClass: additionalClass, requiredStyle: requiredStyle, text: text};
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLinesHelp = F3(
	function (toStyle, _v0, _v1) {
		var syntax = _v0.a;
		var text = _v0.b;
		var lines = _v1.a;
		var fragments = _v1.b;
		var maybeLastSyntax = _v1.c;
		if (_Utils_eq(syntax, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak)) {
			return _Utils_Tuple3(
				A2(
					$elm$core$List$cons,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$newLine(fragments),
					lines),
				_List_fromArray(
					[
						A2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment,
						toStyle,
						_Utils_Tuple2(syntax, text))
					]),
				$elm$core$Maybe$Nothing);
		} else {
			if (_Utils_eq(
				$elm$core$Maybe$Just(syntax),
				maybeLastSyntax)) {
				if (fragments.b) {
					var headFrag = fragments.a;
					var tailFrags = fragments.b;
					return _Utils_Tuple3(
						lines,
						A2(
							$elm$core$List$cons,
							_Utils_update(
								headFrag,
								{
									text: _Utils_ap(text, headFrag.text)
								}),
							tailFrags),
						maybeLastSyntax);
				} else {
					return _Utils_Tuple3(
						lines,
						A2(
							$elm$core$List$cons,
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment,
								toStyle,
								_Utils_Tuple2(syntax, text)),
							fragments),
						maybeLastSyntax);
				}
			} else {
				return _Utils_Tuple3(
					lines,
					A2(
						$elm$core$List$cons,
						A2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment,
							toStyle,
							_Utils_Tuple2(syntax, text)),
						fragments),
					$elm$core$Maybe$Just(syntax));
			}
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines = F2(
	function (toStyle, revTokens) {
		return function (_v0) {
			var lines = _v0.a;
			var frags = _v0.b;
			return A2(
				$elm$core$List$cons,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$newLine(frags),
				lines);
		}(
			A3(
				$elm$core$List$foldl,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLinesHelp(toStyle),
				_Utils_Tuple3(_List_Nil, _List_Nil, $elm$core$Maybe$Nothing),
				revTokens));
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment = {$: 'Comment'};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\n'));
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile = F2(
	function (isNotRelevant, previousParser) {
		return A2(
			$elm$parser$Parser$ignorer,
			previousParser,
			$elm$parser$Parser$chompWhile(isNotRelevant));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$inlineComment = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b)
			]);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak),
			$elm$parser$Parser$symbol('--'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$addThen = F3(
	function (f, list, plist) {
		return A2(
			$elm$parser$Parser$andThen,
			function (n) {
				return f(
					_Utils_ap(n, list));
			},
			plist);
	});
var $elm$parser$Parser$UnexpectedChar = {$: 'UnexpectedChar'};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
				return _Utils_eq(newOffset, -1) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src}) : A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src}));
			});
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen = F3(
	function (f, list, pn) {
		return A2(
			$elm$parser$Parser$andThen,
			function (n) {
				return f(
					A2($elm$core$List$cons, n, list));
			},
			pn);
	});
var $elm$parser$Parser$ExpectingEnd = {$: 'ExpectingEnd'};
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable = F2(
	function (options, revAList) {
		var defaultMap = options.defaultMap;
		var isNotRelevant = options.isNotRelevant;
		var end = options.end;
		var innerParsers = options.innerParsers;
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							defaultMap(end),
							revAList)),
					$elm$parser$Parser$symbol(end)),
					A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(revAList),
					$elm$parser$Parser$end),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$addThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable(options),
					revAList,
					$elm$parser$Parser$oneOf(innerParsers)),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable(options),
					revAList,
					A2(
						$elm$parser$Parser$map,
						defaultMap,
						$elm$parser$Parser$getChompedString(
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
								isNotRelevant,
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$always(true))))))
				]));
	});
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable = F3(
	function (nestLevel, options, revAList) {
		var defaultMap = options.defaultMap;
		var isNotRelevant = options.isNotRelevant;
		var start = options.start;
		var end = options.end;
		var innerParsers = options.innerParsers;
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$andThen,
					function (n) {
						return (nestLevel === 1) ? $elm$parser$Parser$succeed(n) : A3($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable, nestLevel - 1, options, n);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								defaultMap(end),
								revAList)),
						$elm$parser$Parser$symbol(end))),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen,
					A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable, nestLevel + 1, options),
					revAList,
					A2(
						$elm$parser$Parser$map,
						defaultMap,
						$elm$parser$Parser$getChompedString(
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
								isNotRelevant,
								$elm$parser$Parser$symbol(start))))),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$addThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable(options),
					revAList,
					$elm$parser$Parser$oneOf(innerParsers)),
					A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(revAList),
					$elm$parser$Parser$end),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen,
					A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable, nestLevel, options),
					revAList,
					A2(
						$elm$parser$Parser$map,
						defaultMap,
						$elm$parser$Parser$getChompedString(
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
								isNotRelevant,
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$always(true))))))
				]));
	});
var $elm$parser$Parser$Problem = function (a) {
	return {$: 'Problem', a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedHelp = F2(
	function (options, revAList) {
		var start = options.start;
		var end = options.end;
		var isNotRelevant = options.isNotRelevant;
		var _v0 = _Utils_Tuple2(
			$elm$core$String$uncons(options.start),
			$elm$core$String$uncons(options.end));
		if (_v0.a.$ === 'Nothing') {
			var _v1 = _v0.a;
			return $elm$parser$Parser$problem('Trying to parse a delimited helper, but the start token cannot be an empty string!');
		} else {
			if (_v0.b.$ === 'Nothing') {
				var _v2 = _v0.b;
				return $elm$parser$Parser$problem('Trying to parse a delimited helper, but the end token cannot be an empty string!');
			} else {
				var _v3 = _v0.a.a;
				var startChar = _v3.a;
				var _v4 = _v0.b.a;
				var endChar = _v4.a;
				return options.isNestable ? A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable,
					1,
					_Utils_update(
						options,
						{
							isNotRelevant: function (c) {
								return isNotRelevant(c) && ((!_Utils_eq(c, startChar)) && (!_Utils_eq(c, endChar)));
							}
						}),
					revAList) : A2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable,
					_Utils_update(
						options,
						{
							isNotRelevant: function (c) {
								return isNotRelevant(c) && (!_Utils_eq(c, endChar));
							}
						}),
					revAList);
			}
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited = function (options) {
	var start = options.start;
	var isNotRelevant = options.isNotRelevant;
	var defaultMap = options.defaultMap;
	return A2(
		$elm$parser$Parser$andThen,
		function (n) {
			return A2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedHelp,
				options,
				_List_fromArray(
					[n]));
		},
		A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				defaultMap(start)),
			$elm$parser$Parser$symbol(start)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreakList = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n')
			]);
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$multilineComment = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	{
		defaultMap: function (b) {
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b);
		},
		end: '-}',
		innerParsers: _List_fromArray(
			[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreakList]),
		isNestable: true,
		isNotRelevant: function (c) {
			return !$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c);
		},
		start: '{-'
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$inlineComment, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$multilineComment]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol = {$: 'BasicSymbol'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C = function (a) {
	return {$: 'C', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized = {$: 'Capitalized'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$GroupSymbol = {$: 'GroupSymbol'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword = {$: 'Keyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal = {$: 'Normal'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Number = {$: 'Number'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile = function (isNotRelevant) {
	return A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(_Utils_Tuple0),
			$elm$parser$Parser$chompIf(isNotRelevant)),
		$elm$parser$Parser$chompWhile(isNotRelevant));
};
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbols = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('|'),
			_Utils_chr('.'),
			_Utils_chr('='),
			_Utils_chr('\\'),
			_Utils_chr('/'),
			_Utils_chr('('),
			_Utils_chr(')'),
			_Utils_chr('-'),
			_Utils_chr('>'),
			_Utils_chr('<'),
			_Utils_chr(':'),
			_Utils_chr('+'),
			_Utils_chr('!'),
			_Utils_chr('$'),
			_Utils_chr('%'),
			_Utils_chr('&'),
			_Utils_chr('*')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isBasicSymbol = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbols);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbol = $elm$parser$Parser$getChompedString(
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isBasicSymbol));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbols = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr(','),
			_Utils_chr('['),
			_Utils_chr(']'),
			_Utils_chr('{'),
			_Utils_chr('}')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isGroupSymbol = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbols);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isStringLiteralChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\"')) || _Utils_eq(
		c,
		_Utils_chr('\''));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || _Utils_eq(
		c,
		_Utils_chr('\t'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace = function (c) {
	return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isBasicSymbol(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isGroupSymbol(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isStringLiteralChar(c))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$capitalized = $elm$parser$Parser$getChompedString(
	A2(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar,
		$elm$parser$Parser$chompIf($elm$core$Char$isUpper)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbol = $elm$parser$Parser$getChompedString(
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isGroupSymbol));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function = {$: 'Function'};
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('+'),
			_Utils_chr('-'),
			_Utils_chr('/'),
			_Utils_chr('*'),
			_Utils_chr('='),
			_Utils_chr('.'),
			_Utils_chr('$'),
			_Utils_chr('<'),
			_Utils_chr('>'),
			_Utils_chr(':'),
			_Utils_chr('&'),
			_Utils_chr('|'),
			_Utils_chr('^'),
			_Utils_chr('?'),
			_Utils_chr('%'),
			_Utils_chr('#'),
			_Utils_chr('@'),
			_Utils_chr('~'),
			_Utils_chr('!'),
			_Utils_chr(',')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isInfixChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixParser = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
			b);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(_Utils_Tuple0),
					$elm$parser$Parser$backtrackable(
						$elm$parser$Parser$symbol('('))),
				$elm$parser$Parser$backtrackable(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isInfixChar))),
			$elm$parser$Parser$backtrackable(
				$elm$parser$Parser$symbol(')')))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$keywordSet = $elm$core$Set$fromList(
	_List_fromArray(
		['as', 'where', 'let', 'in', 'if', 'else', 'then', 'case', 'of', 'type', 'alias']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isKeyword = function (str) {
	return A2($elm$core$Set$member, str, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$keywordSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isNumber = function (c) {
	return $elm$core$Char$isDigit(c) || _Utils_eq(
		c,
		_Utils_chr('.'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumber = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isNumber)),
	$elm$parser$Parser$chompWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isNumber));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$negativeNumber = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$backtrackable(
			$elm$parser$Parser$symbol('-'))),
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumber);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumber, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$negativeNumber]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable = $elm$parser$Parser$getChompedString(
	A2(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar,
		$elm$parser$Parser$chompIf($elm$core$Char$isLower)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$weirdText = $elm$parser$Parser$getChompedString(
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBodyContent = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Number),
					b);
			},
			$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number)),
			A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized),
					'()')),
			$elm$parser$Parser$symbol('()')),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixParser,
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol),
					b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbol),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$GroupSymbol),
					b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbol),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized),
					b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$capitalized),
			A2(
			$elm$parser$Parser$map,
			function (n) {
				return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isKeyword(n) ? _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n) : _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, n);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$weirdText)
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$String = {$: 'String'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapableSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('\''),
			_Utils_chr('\"'),
			_Utils_chr('\\'),
			_Utils_chr('n'),
			_Utils_chr('r'),
			_Utils_chr('t'),
			_Utils_chr('b'),
			_Utils_chr('f'),
			_Utils_chr('v')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapableChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapableSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapable = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$backtrackable(
			$elm$parser$Parser$symbol('\\'))),
	$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapableChar));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$elmEscapable = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized),
				b)
			]);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapable));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\\'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter = {
	defaultMap: function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$String),
			b);
	},
	end: '\"',
	innerParsers: _List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreakList, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$elmEscapable]),
	isNestable: false,
	isNotRelevant: function (c) {
		return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable(c));
	},
	start: '\"'
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$doubleQuote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$quote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter,
		{end: '\'', start: '\''}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$tripleDoubleQuote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter,
		{end: '\"\"\"', start: '\"\"\"'}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringLiteral = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$tripleDoubleQuote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$doubleQuote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$quote]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n');
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContext = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space),
				A2(
				$elm$parser$Parser$andThen,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContext,
				A2(
					$elm$parser$Parser$map,
					function (n) {
						return A2($elm$core$List$cons, n, revTokens);
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak)),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringLiteral),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBodyContent),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigIsNotRelevant = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || (_Utils_eq(
		c,
		_Utils_chr('(')) || (_Utils_eq(
		c,
		_Utils_chr(')')) || (_Utils_eq(
		c,
		_Utils_chr('-')) || _Utils_eq(
		c,
		_Utils_chr(','))))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContentHelp = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
					'()')),
			$elm$parser$Parser$symbol('()')),
			A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol),
					'->')),
			$elm$parser$Parser$symbol('->')),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
			},
			$elm$parser$Parser$getChompedString(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
					function (c) {
						return _Utils_eq(
							c,
							_Utils_chr('(')) || (_Utils_eq(
							c,
							_Utils_chr(')')) || (_Utils_eq(
							c,
							_Utils_chr('-')) || _Utils_eq(
							c,
							_Utils_chr(','))));
					}))),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
					b);
			},
			$elm$parser$Parser$getChompedString(
				A2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigIsNotRelevant,
					$elm$parser$Parser$chompIf($elm$core$Char$isUpper)))),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
			},
			$elm$parser$Parser$getChompedString(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigIsNotRelevant)))
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContent = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContentHelp),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionSignature = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$andThen,
					function (ns) {
						return A2($elm$parser$Parser$loop, ns, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContent);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol),
									':'),
								revTokens)),
						$elm$parser$Parser$symbol(':')))),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2($elm$parser$Parser$loop, revTokens, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('-')) || _Utils_eq(
		c,
		_Utils_chr('{'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar));
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 'ExpectingKeyword', a: a};
};
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return (_Utils_eq(newOffset, -1) || (0 <= A3(
				$elm$parser$Parser$Advanced$isSubChar,
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
						c,
						_Utils_chr('_'));
				},
				newOffset,
				s.src))) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecIsNotRelevant = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar(c) || _Utils_eq(
		c,
		_Utils_chr('('))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpIsNotRelevant = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar(c) || (_Utils_eq(
		c,
		_Utils_chr('(')) || (_Utils_eq(
		c,
		_Utils_chr(')')) || (_Utils_eq(
		c,
		_Utils_chr(',')) || _Utils_eq(
		c,
		_Utils_chr('.')))))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpnIsSpecialChar = function (c) {
	return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar(c) || (_Utils_eq(
		c,
		_Utils_chr('(')) || _Utils_eq(
		c,
		_Utils_chr(')'))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContextNested = function (_v1) {
	var nestLevel = _v1.a;
	var revTokens = _v1.b;
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStepNested(
				_Utils_Tuple2(nestLevel, revTokens)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStepNested = function (_v0) {
	var nestLevel = _v0.a;
	var revTokens = _v0.b;
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(
							nestLevel,
							A2($elm$core$List$cons, n, revTokens)));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space),
				A2(
				$elm$parser$Parser$andThen,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContextNested,
				A2(
					$elm$parser$Parser$map,
					function (n) {
						return _Utils_Tuple2(
							nestLevel,
							A2($elm$core$List$cons, n, revTokens));
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak)),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(
							nestLevel,
							_Utils_ap(n, revTokens)));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParNest = function (_v0) {
	var nestLevel = _v0.a;
	var revTokens = _v0.b;
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStepNested(
				_Utils_Tuple2(nestLevel, revTokens)),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(nestLevel + 1, ns));
				},
				A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
							revTokens)),
					$elm$parser$Parser$symbol('('))),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return (!nestLevel) ? $elm$parser$Parser$Done(ns) : $elm$parser$Parser$Loop(
						_Utils_Tuple2(nestLevel - 1, ns));
				},
				A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, ')'),
							revTokens)),
					$elm$parser$Parser$symbol(')'))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(
							nestLevel,
							A2($elm$core$List$cons, n, revTokens)));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar),
							A2(
							$elm$parser$Parser$map,
							function (s) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, s);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpnIsSpecialChar))))
						]))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParentheses = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, ')'),
							revTokens)),
					$elm$parser$Parser$symbol(')'))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixParser,
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
									function (c) {
										return _Utils_eq(
											c,
											_Utils_chr(',')) || _Utils_eq(
											c,
											_Utils_chr('.'));
									}))),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
									b);
							},
							$elm$parser$Parser$getChompedString(
								A2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpIsNotRelevant,
									$elm$parser$Parser$chompIf($elm$core$Char$isUpper)))),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
									b);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpIsNotRelevant)))
						]))),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (n) {
						return A2(
							$elm$parser$Parser$loop,
							_Utils_Tuple2(0, n),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParNest);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
								revTokens)),
						$elm$parser$Parser$symbol('(')))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$moduleDeclaration = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (n) {
						return A2($elm$parser$Parser$loop, n, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParentheses);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
								revTokens)),
						$elm$parser$Parser$symbol('(')))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar),
							A2(
							$elm$parser$Parser$map,
							$elm$core$Basics$always(
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
									'exposing')),
							$elm$parser$Parser$keyword('exposing')),
							A2(
							$elm$parser$Parser$map,
							$elm$core$Basics$always(
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
									'as')),
							$elm$parser$Parser$keyword('as')),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecIsNotRelevant)))
						]))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclarationHelp = F2(
	function (revTokens, str) {
		return (str === 'module') ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					str),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$moduleDeclaration) : A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
					str),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionSignature);
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclaration = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$andThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclarationHelp(revTokens),
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2($elm$parser$Parser$loop, revTokens, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineStartVariable = F2(
	function (revTokens, n) {
		return ((n === 'module') || (n === 'import')) ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$moduleDeclaration) : ((n === 'port') ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclaration) : ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isKeyword(n) ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody) : A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionSignature)));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mainLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineStartVariable(revTokens),
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (s) {
						return A2(
							$elm$parser$Parser$loop,
							_Utils_ap(s, revTokens),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody);
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringLiteral)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (s) {
						return A2(
							$elm$parser$Parser$loop,
							A2($elm$core$List$cons, s, revTokens),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody);
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBodyContent)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toRevTokens = A2($elm$parser$Parser$loop, _List_Nil, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mainLoop);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toLines = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toRevTokens),
	$elm$core$Result$map(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$syntaxToStyle)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$elm = A2(
	$elm$core$Basics$composeR,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toLines,
	$elm$core$Result$map($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add = {$: 'Add'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del = {$: 'Del'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal = {$: 'Normal'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$highlightLinesHelp = F5(
	function (maybeHighlight, start, end, index, line) {
		return ((_Utils_cmp(index, start) > -1) && (_Utils_cmp(index, end) < 0)) ? _Utils_update(
			line,
			{highlight: maybeHighlight}) : line;
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$highlightLines = F4(
	function (maybeHighlight, start, end, lines) {
		var length = $elm$core$List$length(lines);
		var start_ = (start < 0) ? (length + start) : start;
		var end_ = (end < 0) ? (length + end) : end;
		return A2(
			$elm$core$List$indexedMap,
			A3($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$highlightLinesHelp, maybeHighlight, start_, end_),
			lines);
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$highlightLines = F4(
	function (maybeHighlight, start, end, _v0) {
		var lines = _v0.a;
		var maybeHighlight_ = function () {
			if (maybeHighlight.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				switch (maybeHighlight.a.$) {
					case 'Highlight':
						var _v2 = maybeHighlight.a;
						return $elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal);
					case 'Add':
						var _v3 = maybeHighlight.a;
						return $elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add);
					default:
						var _v4 = maybeHighlight.a;
						return $elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del);
				}
			}
		}();
		return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode(
			A4($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$highlightLines, maybeHighlight_, start, end, lines));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$html$Html$code = _VirtualDom_node('code');
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$requiredStyleToString = function (required) {
	return 'elmsh' + function () {
		switch (required.$) {
			case 'Default':
				return '0';
			case 'Comment':
				return '-comm';
			case 'Style1':
				return '1';
			case 'Style2':
				return '2';
			case 'Style3':
				return '3';
			case 'Style4':
				return '4';
			case 'Style5':
				return '5';
			case 'Style6':
				return '6';
			default:
				return '7';
		}
	}();
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView = function (_v0) {
	var text = _v0.text;
	var requiredStyle = _v0.requiredStyle;
	var additionalClass = _v0.additionalClass;
	return (_Utils_eq(requiredStyle, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default) && $elm$core$String$isEmpty(additionalClass)) ? $elm$html$Html$text(text) : A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$requiredStyleToString(requiredStyle),
						!_Utils_eq(requiredStyle, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default)),
						_Utils_Tuple2('elmsh-' + additionalClass, additionalClass !== '')
					]))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(text)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$lineView = F3(
	function (start, index, _v0) {
		var fragments = _v0.fragments;
		var highlight = _v0.highlight;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('elmsh-line', true),
							_Utils_Tuple2(
							'elmsh-hl',
							_Utils_eq(
								highlight,
								$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal))),
							_Utils_Tuple2(
							'elmsh-add',
							_Utils_eq(
								highlight,
								$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add))),
							_Utils_Tuple2(
							'elmsh-del',
							_Utils_eq(
								highlight,
								$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del)))
						])),
					A2(
					$elm$html$Html$Attributes$attribute,
					'data-elmsh-lc',
					$elm$core$String$fromInt(start + index))
				]),
			A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView, fragments));
	});
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toInlineHtml = function (lines) {
	return A2(
		$elm$html$Html$code,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elmsh')
			]),
		$elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var highlight = _v0.highlight;
					var fragments = _v0.fragments;
					return _Utils_eq(highlight, $elm$core$Maybe$Nothing) ? A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView, fragments) : _List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'elmsh-hl',
											_Utils_eq(
												highlight,
												$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal))),
											_Utils_Tuple2(
											'elmsh-add',
											_Utils_eq(
												highlight,
												$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add))),
											_Utils_Tuple2(
											'elmsh-del',
											_Utils_eq(
												highlight,
												$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del)))
										]))
								]),
							A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView, fragments))
						]);
				},
				lines)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toBlockHtml = F2(
	function (maybeStart, lines) {
		if (maybeStart.$ === 'Nothing') {
			return A2(
				$elm$html$Html$pre,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elmsh')
					]),
				_List_fromArray(
					[
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toInlineHtml(lines)
					]));
		} else {
			var start = maybeStart.a;
			return A2(
				$elm$html$Html$pre,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elmsh')
					]),
				$elm$core$List$singleton(
					A2(
						$elm$html$Html$code,
						_List_Nil,
						A2(
							$elm$core$List$indexedMap,
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$lineView(start),
							lines))));
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$toBlockHtml = F2(
	function (maybeStart, _v0) {
		var lines = _v0.a;
		return A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toBlockHtml, maybeStart, lines);
	});
var $author$project$Main$codeToHtml = F3(
	function (maybeStart, str, hlModel) {
		return function (result) {
			if (result.$ === 'Ok') {
				var a = result.a;
				return a;
			} else {
				var x = result.a;
				return $elm$html$Html$text(x);
			}
		}(
			A2(
				$elm$core$Result$mapError,
				$elm$parser$Parser$deadEndsToString,
				A2(
					$elm$core$Result$map,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$toBlockHtml(maybeStart),
					A2(
						$elm$core$Result$map,
						A3($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$highlightLines, hlModel.mode, hlModel.start, hlModel.end),
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$elm(str)))));
	});
var $author$project$Main$defaultHighlightModel = {end: 0, mode: $elm$core$Maybe$Nothing, start: 0};
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $elm$core$String$lines = _String_lines;
var $author$project$Main$viewCode = F2(
	function (example, model) {
		var _v0 = $author$project$Main$findExample(example);
		if (_v0.$ === 'Nothing') {
			return $elm$html$Html$text('');
		} else {
			var code = _v0.a.code;
			var range = _v0.a.range;
			var _v1 = function () {
				if (A2($author$project$Main$isExpanded, example, model)) {
					return _Utils_Tuple2(
						A2(
							$elm$core$String$join,
							'\n',
							A2(
								$elm$core$List$drop,
								1,
								$elm$core$String$lines(code))),
						1);
				} else {
					var _v2 = range;
					var start = _v2.a;
					var end = _v2.b;
					return _Utils_Tuple2(
						A2(
							$elm$core$String$join,
							'\n',
							A2(
								$elm$core$List$take,
								(end - start) + 1,
								A2(
									$elm$core$List$drop,
									start,
									$elm$core$String$lines(code)))),
						start);
				}
			}();
			var content = _v1.a;
			var startLine = _v1.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elmsh')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('toggle'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$Toggle(example))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('▼ toggle full example ▼')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('view-container')
							]),
						_List_fromArray(
							[
								A4(
								$elm$html$Html$Lazy$lazy3,
								$author$project$Main$codeToHtml,
								$elm$core$Maybe$Just(startLine),
								content,
								$author$project$Main$defaultHighlightModel)
							]))
					]));
		}
	});
var $author$project$Main$viewExample = F5(
	function (model, description, toMsg, example, subView) {
		return A2(
			$elm$html$Html$section,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$name(
									$author$project$Main$exampleAsStr(example))
								]),
							_List_Nil),
							$elm$html$Html$text(
							A2(
								$elm$core$Maybe$withDefault,
								'',
								A2(
									$elm$core$Maybe$map,
									function ($) {
										return $.title;
									},
									$author$project$Main$findExample(example))))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('grid')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									description,
									A2($author$project$Main$htmlMap, toMsg, subView)
								])),
							A2($author$project$Main$viewCode, example, model)
						])),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('top-link'),
							$elm$html$Html$Attributes$href('#top')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('▲ Back to Top ▲')
						]))
				]));
	});
var $author$project$Main$viewCombination = function (model) {
	return A5(
		$author$project$Main$viewExample,
		model,
		$author$project$Main$combinationMarkdown,
		$author$project$Main$ForCombination,
		$author$project$Main$Combination,
		$author$project$Examples$Combination$view(model.combination));
};
var $author$project$Main$ForCustomEvents = function (a) {
	return {$: 'ForCustomEvents', a: a};
};
var $author$project$Main$customEventsMarkdown = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nOne thing we can\'t easily do is to send `Msg` from the outside app from __inside__ the form.    \nThe way the form widgets can be arbitrarily nested is thal all its messages get serialized to JSON and back.\n\nWe can\'t infer how to do that for message from the outside.\nInstead of adding another type parameter and functions for serializing to the form functions we offer a\nworkaround: You can emit a _"custom event"_ with arbitrary JSON data from within the form.\n\nThis obviously sacrifices a lot of type safety, but is the best we can do without making the general API\neven more complicated.\n\nThe user can use the `getCustomEvent` function during the `update` to extract the custom data.\nThese events can even be used to update the content of the form as shown in the following example.\n\nIn real life use one should use a symmetric pair of de-/encoders instead of de-/encoding\nin the view/update functions.\n');
var $author$project$Examples$CustomEvents$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $author$project$Examples$CustomEvents$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3($author$project$FancyForms$Form$render, $author$project$Examples$CustomEvents$ForForm, $author$project$Examples$CustomEvents$myForm, model.formState)),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The user entered: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							A2($author$project$FancyForms$Form$extract, $author$project$Examples$CustomEvents$myForm, model.formState)))
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The number of custom events is: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(model.count))
					]))
			]));
};
var $author$project$Main$viewCustomEvents = function (model) {
	var description = A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[$author$project$Main$customEventsMarkdown]));
	return A5(
		$author$project$Main$viewExample,
		model,
		description,
		$author$project$Main$ForCustomEvents,
		$author$project$Main$CustomEvents,
		$author$project$Examples$CustomEvents$view(model.customEvents));
};
var $author$project$Main$ForDecoration = function (a) {
	return {$: 'ForDecoration', a: a};
};
var $author$project$Main$decorationMarkdown = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nHow the markup for an input field has to be structured varies from application to application.\nOften it depends on the CSS framework you are using. This is why we keep the basic input widgets\nas unopinionated and simple as possible.\n\nTo not having to repeat the same markup over and over again we can use the `Form.wrap` function.\nIt allows us add markup to an input widget without changing the logic of the widget itself.\n\nWe can use it to add a _"Decoration"_ when we declare the field or create versions of\nexisting widgets like the `textInputWithLabel`.\n\nOne noteworthy aspect of the `Form.wrap` function is that it is aware of the unique `DomId` of the input\nthat gets wrapped. This is especially import in our _"label"_ case since we need to know the value of\nthe `id` attribute of the `input` element. Only if we use that value for the `for` attribute of the \nlabel element the user will be able to focus the input by clicking on the label.\n');
var $author$project$Examples$Decoration$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $author$project$Examples$Decoration$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3($author$project$FancyForms$Form$render, $author$project$Examples$Decoration$ForForm, $author$project$Examples$Decoration$myForm, model.formState)),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The user entered: '),
						$elm$html$Html$text(
						A2($author$project$FancyForms$Form$extract, $author$project$Examples$Decoration$myForm, model.formState).username),
						$elm$html$Html$text(':'),
						$elm$html$Html$text(
						A2($author$project$FancyForms$Form$extract, $author$project$Examples$Decoration$myForm, model.formState).password)
					]))
			]));
};
var $author$project$Main$viewDecoration = function (model) {
	return A5(
		$author$project$Main$viewExample,
		model,
		$author$project$Main$decorationMarkdown,
		$author$project$Main$ForDecoration,
		$author$project$Main$Decoration,
		$author$project$Examples$Decoration$view(model.decoration));
};
var $author$project$Main$ForLists = function (a) {
	return {$: 'ForLists', a: a};
};
var $author$project$Main$listsMarkdown = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nAnother common use case is collecting a list of values. When the user determins the\nnumber if items in the form we can\'t _"hard code"_ a list of fields.\n\nIn this case we can use the `listField` function.\n\nTo collect information for an item in in the list we can use\nany widget that we want to collect a list of values. Here we use the `textInput` widget.\n\nIn addition to the input widget for the list items we need to supply the `listField` function\nwith a few more arguments:\n\n1. A function that will place a button to remove an item from the list in the vicinity of the item\n2. A function that places a UI element to add a _new_ item to the list.\n3. A default value for a new item.\n4. A function that extracts the inital list from the initial value of the form.\n\n');
var $author$project$Examples$Lists$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $author$project$Examples$Lists$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3($author$project$FancyForms$Form$render, $author$project$Examples$Lists$ForForm, $author$project$Examples$Lists$myForm, model.formState)),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$text('The user entered: '),
					A2(
						$elm$core$List$map,
						function (todo) {
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(todo)
									]));
						},
						A2($author$project$FancyForms$Form$extract, $author$project$Examples$Lists$myForm, model.formState))))
			]));
};
var $author$project$Main$viewLists = function (model) {
	return A5(
		$author$project$Main$viewExample,
		model,
		$author$project$Main$listsMarkdown,
		$author$project$Main$ForLists,
		$author$project$Main$Lists,
		$author$project$Examples$Lists$view(model.lists));
};
var $author$project$Main$ForMinimal = function (a) {
	return {$: 'ForMinimal', a: a};
};
var $author$project$Main$minimalMarkdown = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nA form is declared by calling [`Form.form`](https://package.elm-lang.org/packages/axelerator/fancy-forms/2.0.0/FancyForms-Form#form)\nto create an expression of type `Form data error`.\nThe `data` type parameter declares what type of data the form inputs will be converted to.\nThe `error` type parameter allows you to name your own error type for custom validations.\n\nSo this form declares a form that collects an `Int` from the user and doesn\'t have any custom validations\n(it usese the unit type `()` as the `error` type parameter).\n\nTo track the state of the form we add a `FormState` field to our model and a `Msg` variant to modify it.\nWe use the `Form.init` function to create the inital `FormState` with the values we want the form to start with.\n\nThe second argument to the form is a function that receives an argument for each field.\nIt returns a record with two fields: `view` and `combine`.\nThe `view` function is used to render the field.\nThe `combine` function is used to extract the value from the form state.\n\nWe add fields to the form by "piping" the result of the `form` call into the [`field`](https://package.elm-lang.org/packages/axelerator/fancy-forms/2.0.0/FancyForms-Form#field)\nfunction.\n\nHere we only have a single `Int` input field. The `view` function can use the `amount` field to render the input widget.\nThe `combine` function can use the `amount` field to extract the value from the form state.\n');
var $author$project$Examples$Minimal$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $author$project$Examples$Minimal$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3($author$project$FancyForms$Form$render, $author$project$Examples$Minimal$ForForm, $author$project$Examples$Minimal$myForm, model.formState)),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The user entered: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							A2($author$project$FancyForms$Form$extract, $author$project$Examples$Minimal$myForm, model.formState)))
					]))
			]));
};
var $author$project$Main$viewMinimal = function (model) {
	return A5(
		$author$project$Main$viewExample,
		model,
		$author$project$Main$minimalMarkdown,
		$author$project$Main$ForMinimal,
		$author$project$Main$Minimal,
		$author$project$Examples$Minimal$view(model.minimal));
};
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$Main$intro = A2(
	$elm_explorations$markdown$Markdown$toHtml,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('content')
		]),
	'\n# FancyForms\n\n[_FancyForms_ is a library](https://package.elm-lang.org/packages/axelerator/fancy-forms/2.0.0/) for building forms in Elm.\nIt is designed with the following goals in mind:\n\n1. **Type saftey**: Data collected in the forms will be returned directly into a user provided type.\n1. **Ease of use**: No matter how complex the form is, it will only need **one** `Msg` and **one** field on the model.\n1. **Customization**: Users can provide their own widgets and custom validations.\n1. **CSS Agnostic**: Adapts to any CSS framework.\n1. **Composable**: Smaller forms can be combined into larger forms.\n1. **I18n**: Internationalization is supported by avoiding hard coded strings.\n\n');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Main$viewTocEntry = function (_v0) {
	var title = _v0.title;
	var example = _v0.example;
	var subTitle = _v0.subTitle;
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						'#' + $author$project$Main$exampleAsStr(example))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(title)
					])),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$small,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(subTitle)
					]))
			]));
};
var $author$project$Main$viewToc = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('grid')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$article,
			_List_Nil,
			_List_fromArray(
				[$author$project$Main$intro])),
			A2(
			$elm$html$Html$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$header,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Table of Contents')
						])),
					A2(
					$elm$html$Html$ul,
					_List_Nil,
					A2($elm$core$List$map, $author$project$Main$viewTocEntry, $author$project$Main$examples))
				]))
		]));
var $author$project$Main$ForValidation = function (a) {
	return {$: 'ForValidation', a: a};
};
var $author$project$Main$validationMarkdown = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\n#### Per-form validation\n\nSometimes whether the data in the form is valid or not can\'t be determined\nbased on the input of a single field.\n\nThe first argument to the `form` call is a function that returns errors based on\nwhat would otherwise be returned as data from the **entire form**.\n\nIn this example we make sure that the selected day is in the correct range. To do so\nwe need to know which month and year the user has selected.\n\nTo display the errors that that occurr "per-form" we use the **second** argument that gets passed into our\n`view` function. They are a `List (Error MyError)` and we have to convert them into human readable Html and\nplace them somewhere in our view\n\nTo assess whether to for example submit the value entered by the user we can use\nthe `isValid` predicate. This will return `False` if any of the forms or it\'s fields have an error.\n\n#### Per-field validation\n\nPer-field validations validate the input independently of the other fields\nand display an error next to the input widget of that field.\n\nThe the widgets that get passed into the `field` declaration can optionally recieve\nadditional validations by calling the `validate` function with a list of functions that validate\ninputs for that specific widget type.\n\nHere we use the `greaterThan` validator to ensure that the user has selected a day, month and year that \nhave a certain minimum value.\n\nTo ensure a consistent UX we assume that errors are always displayed in the same relation to the input\nfield they occur in. That\'s why the second argument to the `form` function is a function that places\na list of `Error MyError` relative to the input field.\n\nPer-field validations are only executed the first time a field is blurred. This is because we wan\'t to\navoid the user being confronted with an "all red" form before they have entered anything.\n');
var $author$project$Examples$Validation$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $author$project$Examples$Validation$Submit = {$: 'Submit'};
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$FancyForms$Form$isValid = F2(
	function (form_, formState) {
		var fn = form_.fn;
		var validator = form_.validator;
		return $elm$core$List$isEmpty(
			A3(
				$author$project$FancyForms$Form$addInvalidIfInconsistent,
				form_,
				formState,
				validator(
					fn.combine(formState))));
	});
var $author$project$Examples$Validation$viewDate = function (_v0) {
	var day = _v0.day;
	var month = _v0.month;
	var year = _v0.year;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('day: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(day)),
						$elm$html$Html$text(' month: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(month)),
						$elm$html$Html$text(' year: '),
						$elm$html$Html$text(
						$elm$core$String$fromInt(year))
					]))
			]));
};
var $author$project$Examples$Validation$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3($author$project$FancyForms$Form$render, $author$project$Examples$Validation$ForForm, $author$project$Examples$Validation$myForm, model.formState)),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Examples$Validation$Submit),
								$elm$html$Html$Attributes$disabled(
								!A2($author$project$FancyForms$Form$isValid, $author$project$Examples$Validation$myForm, model.formState))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Submit')
							]))
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The user entered: ')
					])),
				$author$project$Examples$Validation$viewDate(
				A2($author$project$FancyForms$Form$extract, $author$project$Examples$Validation$myForm, model.formState))
			]));
};
var $author$project$Main$viewValidation = function (model) {
	return A5(
		$author$project$Main$viewExample,
		model,
		$author$project$Main$validationMarkdown,
		$author$project$Main$ForValidation,
		$author$project$Main$Validation,
		$author$project$Examples$Validation$view(model.validation));
};
var $author$project$Main$ForVariants = function (a) {
	return {$: 'ForVariants', a: a};
};
var $author$project$Examples$Variants$ToggleSwitcher = {$: 'ToggleSwitcher'};
var $author$project$Main$variantsMarkdown1 = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nOften we want to let the user choose __"the kind"__ of date they want to enter.\nWhen the choice affects the shape of the form we can use the `fieldWithVariants` function to create a field.\n\nThe first argument is the widget that will be used to let the user choose the kind of data.\nIn this case we use the `dropdown` widget.\n');
var $author$project$Main$variantsMarkdown2 = A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, '\nThe next argument provides the default variant. Each variant is a `Tuple` of the label and the sub form.\nThe third argument is the list of all the other variants.\n\nLastly we need a function that extracts the inital variant from the initial value of the form.\nThis function also needs to tell us which variant to use to edit it. That\'s why `fromForm` returns a tuple.\n\nThe resulting field will still only collect a value of a **single** type. \nSo the widgets of all sub forms need to return the same type.\nSo pratically we will create a new sum type with a variant for each of the possible sub forms.\n');
var $author$project$Examples$Variants$ForForm = function (a) {
	return {$: 'ForForm', a: a};
};
var $author$project$Examples$Variants$view = function (_v0) {
	var formState = _v0.formState;
	var useRadioButtons = _v0.useRadioButtons;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A3(
					$author$project$FancyForms$Form$render,
					$author$project$Examples$Variants$ForForm,
					$author$project$Examples$Variants$myForm(useRadioButtons),
					formState)),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The user entered: '),
						function () {
						var _v1 = A2(
							$author$project$FancyForms$Form$extract,
							$author$project$Examples$Variants$myForm(false),
							formState);
						if (_v1.$ === 'Email') {
							var email = _v1.a;
							return $elm$html$Html$text('Email: ' + email);
						} else {
							var countryCode = _v1.a;
							var number = _v1.b;
							return $elm$html$Html$text(
								'Phone: ' + ($elm$core$String$fromInt(countryCode) + (' ' + $elm$core$String$fromInt(number))));
						}
					}()
					]))
			]));
};
var $author$project$Main$viewVariants = function (model) {
	var description = A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Main$variantsMarkdown1,
				$elm$html$Html$text('But we could also use the '),
				A2(
				$elm$html$Html$small,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Main$ForVariants($author$project$Examples$Variants$ToggleSwitcher))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('radioButtons')
							]))
					])),
				$elm$html$Html$text(' widget.'),
				$author$project$Main$variantsMarkdown2
			]));
	return A5(
		$author$project$Main$viewExample,
		model,
		description,
		$author$project$Main$ForVariants,
		$author$project$Main$Variants,
		$author$project$Examples$Variants$view(model.variants));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container-fluid')
			]),
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$useTheme($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$monokai),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$name('top')
					]),
				_List_Nil),
				$author$project$Main$viewToc,
				$author$project$Main$viewMinimal(model),
				$author$project$Main$viewValidation(model),
				$author$project$Main$viewDecoration(model),
				$author$project$Main$viewCombination(model),
				$author$project$Main$viewLists(model),
				$author$project$Main$viewVariants(model),
				$author$project$Main$viewCustomEvents(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: $author$project$Main$init,
		subscriptions: function (_v0) {
			return $elm$core$Platform$Sub$none;
		},
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));