var request = require('request');
var common = require('./common');

var xkcd = {
	name: 'XKCD',
	url: 'http://www.xkcd.org/',
	img: function($) {
		return $('#comic img').attr('src')
	},
	title: function($) {
		return $('#comic img').attr('title')
	}
};

var criticalMiss = {
	name: 'Critical Miss',
	url: 'http://www.escapistmagazine.com/articles/view/comics/critical-miss.latest',
	img: function($) {
		return $('.folder_nav_links ~ img').attr('src')
	},
	title: function($) {
		var span = $('#intelliTXT');
		return span.children().nextAll();
	}
};

function dagbladetComic(comicName) {
	var identifier = comicName.toLowerCase(); 
	
	function resolveRedirect(url, completedCallback) {
		var lastLocationHeader;
		var options = {
			url: url,
			followRedirect: function(response) {
				if(response.headers.location) {
					lastLocationHeader = response.headers.location;
				}
				return true;
			}
		}
		request.head(options, function(error, response, body) {
			if(!lastLocationHeader) lastLocationHeader = url;
			completedCallback(lastLocationHeader);
		});
	}
	
	return {
		name: comicName,
		url: 'http://www.dagbladet.no/tegneserie/' + identifier + '/',
		img: function($) { 
			return $('#' + identifier + '-stripe').attr('src')
		},
		finalizeCallback: function(comic, options) {
			resolveRedirect(comic.url, function(url) {
				comic.url = url;
				options.callback(comic);
			});
		}
	};
}

function heltNormaltComic(comicName) {
	var identifier;
	if (comicName.name) {
		identifier = comicName.id
		comicName = comicName.name
	} else {
		identifier = comicName.toLowerCase();
	}
	return {
		name: comicName,
		url: 'http://heltnormalt.no/' + identifier,
		img: function($) {
			return $('article.strip img').attr('src')
		}
	};
}

var commitStrip = {
	name: 'CommitStrip',
	url: 'http://www.commitstrip.com/en/',
	img: function($) {
		return $('div.entry-content img.size-full').attr('src')
	},
	title: function($) {
		return $('div.entry-content p').get(1);
	}
};

var smbc = {
	name: 'SMBC',
	url: 'http://www.smbc-comics.com/',
	img: function($) {
		return $('div#comicimage img').attr('src')
	},
	img2: function($) {
		return $('div#aftercomic img').attr('src');
	}
}

var ctrlaltdel = {
	name: 'Ctrl-Alt-Del',
	url: 'http://www.cad-comic.com/cad/',
	img: function($) {
		return $('#content img').attr('src')
	}
};

var spinnerette = {
	name: 'Spinnerette',
	url: 'http://www.spinnyverse.com',
	img: function($) {
		return $('#comicbody img').attr('src')
	}
};

var userfriendly = {
	name: 'User Friendly',
	url: 'http://www.userfriendly.org/static/',
	img: function($) {
		return $("img[alt='Latest Strip']").attr('src')
	}
};

var dagbladetComics = ['Pondus', 'Lunch', 'Nemi', 'Zelda'].map(function(comicName) {
		return dagbladetComic(comicName);
	}
);

var heltNormaltComics = ['Dilbert', {
		name: 'Tommy & Tigern',
		id: 'tommytigern'
	},
	'Kollektivet', {
		name: 'Truth Facts',
		id: 'truthfacts'
	},
	'Hjalmar'
].map(function(comicName) {
		return heltNormaltComic(comicName);
	}
);

var comics = [xkcd, criticalMiss, commitStrip, smbc, ctrlaltdel, spinnerette, userfriendly].
concat(dagbladetComics).concat(heltNormaltComics);

module.exports = comics;
