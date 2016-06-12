$(function(){
	var socket = io.connect();
	var $messageForm = $('#sendmessage');
	var $messageBox = $('#message');
	var $chat = $('#chat');

	$messageForm.submit(function(e) {
		e.preventDefault();
		socket.emit('send message', $messageBox.val(''));
	});

	socket.on('new message', function(data){
		$chat.append(data + "<br/>");
	});
}());