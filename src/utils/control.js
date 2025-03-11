const WebSocket = require('ws')

const SERVER_IP = "localhost"
const ws = new WebSocket(`ws://${SERVER_IP}:1337`); // connect to "event bus"
ws.on('open', () => {
  console.log('Successfully connected to the server');

  ws.send(JSON.stringify({channel: 'publish', payload: 'Bahay Kubo'}));
});