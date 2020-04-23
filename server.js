const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', function connection(ws,req) {
  console.log('WS opened: ' + ws.url);
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
	  if(ws.url == undefined || ws.url == null){
		  console.log("Something fishy is going on. URL is null or undefined");
	  }
      if (client !== ws && client.readyState === WebSocket.OPEN && client.url == ws.url) {
        client.send(data);
      }
    });
  });
});