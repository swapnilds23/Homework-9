var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
console.log('websockets server started');

ws.on('connection', function(socket) {
  console.log('client connection established');

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on('message', function(data) {
    console.log('message received: ' + data);

    var command = '/topic';
    var stringArray = data.split(' ');
    var firstWord = stringArray[0];

    if (firstWord == command) {
      // The code will execute only when client changes the topic
      var result = data.substr(data.indexOf(' ') + 1);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send('*** Topic has changed to ' + '\'' + result + '\'');
      });
      var new_msg = '*** Topic is ' + '\'' + result + '\'';

      if (messages.length > 0) {
        if (~messages[0].indexOf('Topic')) {
          messages.shift();
          messages.unshift(new_msg);
        }
      } else {
        messages.unshift(new_msg);
      }
    } else {
      // The code will execute in all other scenarios
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }
  });
});
