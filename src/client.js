import WebSocket from 'ws';
import readlineSync from 'readline-sync';
import env from 'dotenv';
env.config();

// --- CONFIG
let SERVER_IP = process.env.SERVER_IP;
let CLIENT_NAME = process.env.CLIENT_NAME;

while (true) {
  if(!SERVER_IP){
    SERVER_IP = readlineSync.question('Enter the Server IP: ');
  }
  if(!CLIENT_NAME){
    CLIENT_NAME = readlineSync.question('Enter your name: ');
  }
  

  try {
    const ws = new WebSocket(`ws://${SERVER_IP}:1337`);

    ws.on('open', function open() {
      console.log('Connected to the server');
      ws.send(JSON.stringify({channel:"register", payload: CLIENT_NAME})) // Let the server know you exist

      ws.on('message', data => {
        data = Buffer.from(data, 'base64').toString('utf-8');
        const { channel, payload } = JSON.parse(data);
        console.log(`<---- [${channel}] - ${payload}`);
        // channel: event you're listening to
        // payload: data that comes with the event

        // Sample "Microservice" for Ping Channel
        if(channel === "ping"){
          console.log(`----> [pong]`);
          ws.send(JSON.stringify({channel:"pong", payload: CLIENT_NAME}))
        }

        // Add more "Microservices"


      });


    });

    ws.on('error', function error(err) {
      console.error('Failed to connect to the server:', err.message);
      throw err; // This will trigger the catch block
    });

    // Exit the loop if connection is successful
    break;
  } catch (error) {
    console.log('Retrying...');
  }
}