
var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var moment			= require('moment');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('views'));

// get percentage of year complete
function getPercentage() {
	return (moment() - school_start) / (school_end - school_start) * 100;
}

var school_start = moment('2017-08-24');
var school_end = moment('2018-06-01');

app.get('/', function(req, res) {
	res.render('client.html', { 
		percentage: getPercentage().toFixed(3),
		start_date: school_start.format('M/D/YYYY'),
		end_date: school_end.format('M/D/YYYY')
	});
});

app.listen(8080, function() {
	console.log("Server listening on port 8080");
});