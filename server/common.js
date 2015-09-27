var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var url = require('url');

function get(options, bodyfunc) {
	var comic = newComic(options);
	request(options.url, function(error, response, body) {
		try {
			if(error) {
				fail(options, comic, error);
			} else if(response.statusCode != 200) {
				fail(options, comic, "HTTP " + response.statusCode);
			} else {
				bodyfunc(body, comic);
			}
		} catch(err) {
			fail(options, comic, err.toString(), err);
		}
	})
}

function newComic(options) {
	return {
		name: options.name,
		originalUrl: options.url,
		lastUpdated: options.now
	}
}

function fail(options, comic, error, errorInfo, body) {
	console.log("Error: " + error);
	console.log("URL: " + comic.originalUrl);
	if(errorInfo) {
		comic.errorInfo = errorInfo;
		console.log(errorInfo);
	}
	if(body) {
		console.log("Source: ");
		console.log(body);
	}
	comic.error = error;
	options.callback(comic);
}

function notfound(options, comic, body, info) {
	fail(options, comic, "Did not find comic on page", info, body);
}

function regexpComic(options) {
	get(options, function(body, comic) {
			var comicData = options.regexp.exec(body);
			
			if(comicData == null) {
				return notfound(options, comic, body, "Regexp: " + options.regexp);
			}
			comic.url = comicData[1];
			comic.title = comicData[2];
			
			finalizeComic(comic);
			options.callback(comic);
	});
}

function lv(n, v) {
	console.log(n + "=", util.inspect(v, {depth: 1, colors:true}));
}

function domNodesToText($, input) {
	if(!input) return '';
	if(input.get) {
		input = input.get();
	} 
	if(!input.get && input.map) {
		input = input.map(function(input) { return domNodesToText($, input)}).join("");
	}
	if(input.name) {
		input = $.html($(input));
	}
	
	return input;
}

function parseComic(options) {
	get(options, function(body, comic) {
		var $ = cheerio.load(body);
		comic.url = domNodesToText($, options.img($))
		if(!comic.url) {
			return notfound(options, comic, body, "Img expression: " + options.img)
		}
		if(options.img2) {
			comic.url2 = domNodesToText($, options.img2($));
		}
		if(options.title) {
			comic.title = domNodesToText($, options.title($))
		}
		finalizeComic(comic);
		
		if(options.finalizeCallback) {
			options.finalizeCallback(comic, options);
		} else {
			options.callback(comic);
		}
	});
}

function finalizeComic(comic) {
	if(comic.url) comic.url = url.resolve(comic.originalUrl, comic.url);
	if(comic.url2) comic.url2 = url.resolve(comic.originalUrl, comic.url2);
}

function log(text) {
	args = ["%s: " + text, new Date];
	for(var i=1; i<arguments.length; ++i) args.push(arguments[i]);
	console.log.apply(null, args);
}

exports.regexpComic = regexpComic;
exports.parseComic = parseComic;
exports.get = get;
exports.log = log
