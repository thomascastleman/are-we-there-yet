
var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var moment			= require('moment');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('views'));

app.get('/', function(req, res) {
	res.render('client.html');
});

app.listen(8080, function() {
	console.log("Server listening on port 8080");
});