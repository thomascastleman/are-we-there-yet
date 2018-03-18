
var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var moment			= require('moment');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('views'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var school_start = moment('2017-08-24');
var school_end = moment('2018-06-01');

// get percentage of year complete
function getPercentage() {
	return (moment() - school_start) / (school_end - school_start) * 100;
}

// establish socket for dynamic updating
io.on('connection', function(socket) {
	// refresh about every 80sec
	setInterval(function() {
		socket.emit('update', getPercentage().toFixed(3));
	}, 85000);
});

app.get('/', function(req, res) {
	res.render('client.html', { 
		percentage: getPercentage().toFixed(3),
		start_date: school_start.format('M/D/YYYY'),
		end_date: school_end.format('M/D/YYYY')
	});
});

server.listen(8080, function() {
	console.log("Server listening on port 8080");
});