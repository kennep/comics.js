var express = require('express')
var comics = require('./comics');

var app = express();

app.get('/', function (req, res) {
	res.send('Hello world!');
});

var server = app.listen(8080, function() {
	var host = server.address().address
	var port = server.address().port
	
	console.log('Comics server listening at http://%s:%s', host, port);
})

app.get('/api/comics', function(req, res) {
	var count = comics.length;
	var response = [];
	comics.forEach(function(comic) {
		comic(function(comicData) {
			response.push(comicData);
			count--;
			if(count==0) {
				response.sort(function(a, b) {
					return a.name.localeCompare(b.name);
				});
				res.send(response);
			}
		})
	});
});


