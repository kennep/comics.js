var common = require('./common');
var regexpComic = common.regexpComic;
var parseComic = common.parseComic;

function xkcd(callback) {
	return parseComic({name: 'XKCD', 
						url: 'http://www.xkcd.org/', 
						img: function($) { return $('#comic img').attr('src')},
						title: function($) { return $('#comic img').attr('title')},
						callback: callback});
}

function criticalMiss(callback) {
	return parseComic({name: 'Critical Miss', 
						url: 'http://www.escapistmagazine.com/articles/view/comics/critical-miss.latest',
						img: function($) { return $('.folder_nav_links ~ img').attr('src')},
						title: function($) { 
							var span = $('#intelliTXT');
							return span.children().nextAll();
						},
						callback: callback});
}

var comics = [xkcd, criticalMiss];

module.exports = comics;
