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

function dagbladetComic(comicName, callback) {
	var identifier = comicName.toLowerCase();
	return parseComic({name: comicName,
					   url: 'http://www.dagbladet.no/tegneserie/' + identifier + '/',
				   	   img: function($) { return $('#' + identifier + '-stripe').attr('src')},
				   	   callback: callback});
}

function heltNormaltComic(comicName, callback) {
	var identifier;
	if(comicName.name) {
		identifier = comicName.id
		comicName = comicName.name
	} else {
		identifier = comicName.toLowerCase();
	}
	return parseComic({name: comicName,
					   url: 'http://heltnormalt.no/' + identifier,
				   	   img: function($) { return $('article.strip img').attr('src')},
				   	   callback: callback});
}

function commitStrip(callback) {
	return parseComic({name: 'CommitStrip',
					   url: 'http://www.commitstrip.com/en/',
				  	   img: function($) { return $('div.entry-content img.size-full').attr('src')},
				  	   title: function($) { return $('div.entry-content p').get(1); },
				  	   callback: callback});
}

function smbc(callback) {
	return parseComic({name: 'SMBC',
					   url: 'http://www.smbc-comics.com/',
				  	   img: function($) { return $('div#comicimage img').attr('src')},
				  	   img2: function($) { return $('div#aftercomic img').attr('src'); },
				  	   callback: callback});
}

function ctrlaltdel(callback) {
	return parseComic({name: 'Ctrl-Alt-Del',
					   url: 'http://www.cad-comic.com/cad/',
				   	   img: function($) { return $('#content img').attr('src')},
				       callback: callback});
}

function spinnerette(callback) {
	return parseComic({name: 'Spinnerette',
					   url: 'http://www.spinnyverse.com',
				   	   img: function($) { return $('#comicbody img').attr('src')},
				       callback: callback});
}

function userfriendly(callback) {
	return parseComic({name: 'User Friendly',
                       url: 'http://www.userfriendly.org/static/',
				       img: function($) { return $("img[alt='Latest Strip']").attr('src')},
				       callback: callback});
}

var dagbladetComics = ['Pondus', 'Lunch', 'Nemi', 'Zelda'].map(function(comicName) { 
	return function(callback) { return dagbladetComic(comicName, callback); }
});

var heltNormaltComics = ['Dilbert', {name: 'Tommy & Tigern', id: 'tommytigern'}, 
						 'Kollektivet', 
					     {name: 'Truth Facts', id: 'truthfacts'}, 
						 'Hjalmar'].map(function(comicName) { 
	return function(callback) { return heltNormaltComic(comicName, callback); } 
});

var comics = [xkcd, criticalMiss, commitStrip, smbc, ctrlaltdel, spinnerette, userfriendly].
				concat(dagbladetComics).concat(heltNormaltComics);

module.exports = comics;
