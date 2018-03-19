
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

var current_start;
var current_end;
var needs_maintenance = false;

var intervals = [
	[moment('2017-08-24'), moment('2018-06-01')],	// schoolyear 2017-18
	[moment('2018-06-02'), moment('2018-08-22')],	// summer 2018
];

// get the interval that fits the current time
function getCurrentInterval() {
	needs_maintenance = true;
	var now = moment();
	for (var i = 0; i < intervals.length; i++) {
		current_start = intervals[i][0];
		current_end = intervals[i][1];

		// if currently in interval
		if (!now.isBefore(current_start) && !now.isAfter(current_end)) {
			needs_maintenance = false;
			break;
		}
	}
}

// calculate a percentage into the current time interval
function calcPercentage() {
	return (moment() - current_start) / (current_end - current_start) * 100;
}

// establish socket for dynamic updating
io.on('connection', function(socket) {
	// refresh every 60s
	setInterval(function() {
		socket.emit('update', calcPercentage().toFixed(3));
	}, 60000);
});

app.get('/', function(req, res) {

	var percentage = calcPercentage();

	// if need new interval, look for one
	if (percentage > 100) {
		getCurrentInterval();
	}

	res.render('client.html', {
		percentage: calcPercentage().toFixed(3),
		start_date: current_start.format('M/D/YYYY'),
		end_date: current_end.format('M/D/YYYY'),
		needs_maintenance: needs_maintenance
	});
});

server.listen(8080, function() {
	console.log("Server listening on port 8080");
	getCurrentInterval();
});