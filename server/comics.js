var request = require('request');
var cheerio = require('cheerio');
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
		var img = $('#intelliTXT img').get(1);
		if(img) return $(img).attr('src');
		return null;
	},
	title: function($) {
		var span = $('#intelliTXT');
		return span.children().nextAll().nextAll();
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
	},
	Factory: function(options) {
		common.get(options, function(body, comic) {
			var $ = cheerio.load(body);
			var entries = $("div.excerpt section a");
			if(entries.length == 0) throw new Error("No comic entries found");
			var firstEntry = entries[0];
			options.url = firstEntry.attr('href');
			common.parseComic(options);
		});	
	}
};

var smbc = {
	name: 'SMBC',
	url: 'http://www.smbc-comics.com/',
	img: function($) {
		return $('img#comic').attr('src')
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
		return $('img#cc-comic').attr('src')
	}
};

var userfriendly = {
	name: 'User Friendly',
	url: 'http://www.userfriendly.org/static/',
	img: function($) {
		return $("img[alt='Latest Strip']").attr('src')
	}
};

var dilbertEng = {
	name: 'Dilbert (English)',
	url: 'http://dilbert.com/',
	img: function($) {
		return $("img.img-comic").attr('src')
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

var comics = [xkcd, commitStrip, smbc, ctrlaltdel, spinnerette, userfriendly, dilbertEng].
concat(dagbladetComics).concat(heltNormaltComics);

module.exports = comics;
