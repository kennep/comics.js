var express = require('express')
var comics = require('./comics');

var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = app.listen(server_port, server_ip_address, function() {
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

app.use(express.static(__dirname + '/public'));



