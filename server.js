
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

// 2017-18 schoolyear parameters
var current_start = moment('2017-08-24');
var current_end = moment('2018-06-01');

// 2018 summer parameters
var summer_start = moment('2018-06-02');
var summer_end = moment('2018-08-22');

var needs_maintenance = false;

var interval = (current_end - current_start) * 0.00001;

// calculate a percentage into the current time interval
function calcPercentage() {
	return (moment() - current_start) / (current_end - current_start) * 100;
}

// get percentage of year complete, switch interval if necessary
function getPercentage() {
	var p = calcPercentage();
	if (p > 100) {
		if (moment().isBefore(summer_end)) {
			// switch to summer data
			current_start = summer_start;
			current_end = summer_end;

			return calcPercentage();
		} else {
			needs_maintenance = true;
			return 0;
		}
	} else {
		return p;
	}
}

// establish socket for dynamic updating
io.on('connection', function(socket) {
	// refresh about every 80sec
	setInterval(function() {
		socket.emit('update', getPercentage().toFixed(3));
	}, interval / 2);
});

app.get('/', function(req, res) {
	res.render('client.html', {
		percentage: getPercentage().toFixed(3),
		start_date: current_start.format('M/D/YYYY'),
		end_date: current_end.format('M/D/YYYY'),
		needs_maintenance: needs_maintenance
	});
});

server.listen(8080, function() {
	console.log("Server listening on port 8080");
});