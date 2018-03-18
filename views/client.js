
$(document).ready(function() {
	var socket = io();
	var $title = $('#title');
	var $progressbar = $('#bar');

	socket.on('update', function(percentage) {
		console.log(percentage);
		$title.text(percentage + '%');
		$progressbar.css('width', percentage + '%');
		$progressbar.attr('aria-valuenow', percentage);
	});
})