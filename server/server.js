const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const comics = require('./comics');
const common = require('./common')
const tokenverify = require('./tokenverify');

var app = express();

// set up rate limiter
const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 30 // per minute
});

app.use(morgan('combined'));
app.use(limiter);

var server_port = process.env.NODE_PORT || 8080;
var server_ip_address = process.env.NODE_IP || '0.0.0.0';
var comics_json = process.env.OPENSHIFT_DATA_DIR || '/usr/src/app/data/comics.json';

var server = app.listen(server_port, server_ip_address, function() {
	var host = server.address().address;
	var port = server.address().port;

	common.log('Comics server listening at http://%s:%s', host, port);
})

var lastComics = {};
try {
	common.log("Loading data from " + comics_json);
	lastComics = JSON.parse(fs.readFileSync(comics_json).toString());
	for(let comicName in lastComics) {
		var comic = lastComics[comicName];
		if(comic.lastUpdated) {
			comic.lastUpdated = new Date(Date.parse(comic.lastUpdated));
		}
	}
} catch(error) {
	if(error.code == 'ENOENT') {
		common.log(comics_json + " does not exist.")
	} else {
		common.log("Error reading from " + comics_json + ": " + error + ", file will be ignored.");
	}
}

function clone(obj) {
	var newObj = {}
	Object.keys(obj).forEach(function(prop) {
		if(obj.hasOwnProperty(prop)) {
			newObj[prop] = obj[prop];
		}
	});
	return newObj;
}

app.get('/health', function(req, res) {
    res.send("OK");
});

app.get('/api/comics', function(req, res) {
    var authorization = req.headers['authorization'];
    if(authorization) {
        tokenverify.verifyUser(authorization, (userdata) => {
            if(userdata) {
                console.log("Allowing request from: " + userdata['email']);
                performRequest(req, res);
            } else {
                res.status(403).send("Access denied").end();
                return;
            }
        });
    } else {
        res.status(401).send("Unauthorized").end();
        return;
    }
});

function performRequest(req, res) {
	var count = comics.length;
	var now = new Date();
	var response = [];
	comics.forEach(function(origComic) {
		var comic = clone(origComic);
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
						common.log("Error writing " + comics_json + ": " + err);
					}
				});
			}
		};
		comicFactory(comic);
	});
}

app.use(express.static(__dirname + '/public'));

function fixLastUpdated(currentComics, lastComics) {
	var updatedLastComics = {};
	currentComics.forEach(function(comic) {
		let lastComic = lastComics[comic.name];
		if(lastComic && lastComic.url == comic.url) {
			comic.lastUpdated = lastComic.lastUpdated;
		}
		updatedLastComics[comic.name] = comic;
	});
	return updatedLastComics;
}
