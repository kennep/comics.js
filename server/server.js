var fs = require('fs');
var express = require('express');
var comics = require('./comics');
var common = require('./common');

var app = express();

var server_port = 8080;
var server_ip_address = '0.0.0.0';
var comics_json = '/tmp/comics.json';

var server = app.listen(server_port, server_ip_address, function() {
	var host = server.address().address
var port = server.address().port
	
	console.log('Comics server listening at http://%s:%s', host, port);
})

var lastComics = {};
try {
	console.log("Loading data from " + comics_json);
	lastComics = JSON.parse(fs.readFileSync(comics_json));
	for(comicName in lastComics) {
		var comic = lastComics[comicName];
		if(comic.lastUpdated) {
			comic.lastUpdated = new Date(Date.parse(comic.lastUpdated));
		}
	}
} catch(error) {
	if(error.code == 'ENOENT') {
		console.log(comics_json + " does not exist.")
	} else {
		console.log("Error reading from " + comics_json + ": " + error + ", file will be ignored.");
	}
}

app.get('/api/comics', function(req, res) {
	var count = comics.length;
	var now = new Date();
	var response = [];
	comics.forEach(function(comic) {
		var comicFactory = comic.Factory;
		if(!comicFactory) comicFactory = common.parseComic;
		
		comic.now = now;
		comic.callback = function(comicData) {
			response.push(comicData);
			count--;
			if(count==0) {
				lastComics = fixLastUpdated(response, lastComics);
				response.sort(function(a, b) {
					if(a.lastUpdated == b.lastUpdated) {
						return a.name.localeCompare(b.name);
					} else {
						return b.lastUpdated.getTime() - a.lastUpdated.getTime();
					}
				});
				res.send(response);
				fs.writeFile(comics_json, JSON.stringify(lastComics), function(err) {
					if(err) {
						console.log("Error writing " + console_json + ": " + err);
					}
				});
			}
		};
		comicFactory(comic);
	});
});

app.use(express.static(__dirname + '/public'));

function fixLastUpdated(currentComics, lastComics) {
	var updatedLastComics = {};
	currentComics.forEach(function(comic) {
		lastComic = lastComics[comic.name];
		if(lastComic && lastComic.url == comic.url) {
			comic.lastUpdated = lastComic.lastUpdated;
		}
		updatedLastComics[comic.name] = comic;
	});
	return updatedLastComics;
}

