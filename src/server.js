import { WebSocketServer } from 'ws';
import { getIpAddresses } from './utils/network.utils.js';

const SERVER = new WebSocketServer({ port: 1337 });
const CLIENT_MAP = {}

let idStart = 0
console.log("Server started on port 1337 at these addresses", getIpAddresses())


SERVER.on('connection', function connection(client, req) {
  client.id = idStart++;
  const clientIp = req.socket.remoteAddress;
  console.log(clientIp)
  CLIENT_MAP[client.id] = {
    name: "Anonymous",
    ip: clientIp,
    ws : client
  };
  let { ws, ip, name } = CLIENT_MAP[client.id]
  console.log(`Connection established with client: [${ws.id}_${ip}_${name}]`)
  
  client.on('message', function message(data) {
    try{
      data = Buffer.from(data, 'base64').toString('utf-8');
      const { channel, payload } = JSON.parse(data);
      let { ws, ip, name } = CLIENT_MAP[client.id]
      console.log(`\n\n<---- [${channel}] [${ws.id}_${ip}_${name}]`)
      switch(channel){
        case "register": 
          console.log("Registering client: ", payload)
          CLIENT_MAP[client.id].name = payload
          break;
        case "pingStart":
          publishMessage("ping", "are you there")
          break;
        case "publish":
          publishMessage("publish", payload)
          break;

        // --- "Microservice" channels
        case "verseOne":
          sing(payload)
          publishMessage("verseTwo", payload)
          break;
        case "verseTwo":
          sing(payload)
          publishMessage("verseThree", payload)
          break;
        case "verseThree":
          sing(payload)
          publishMessage("verseFour", payload)
          break;
        case "verseFour":
          sing(payload)
          publishMessage("verseFive", payload)
          break;
      }
    }catch(err){
      console.error(`ERROR [${client.id}] - ${err}`);
    }
  });
  client.on('error', (err) => console.error(`ERROR [${ws.id}] - ${err}`));

  client.on('close', () => {
    let { ws, ip, name } = CLIENT_MAP[client.id]
    console.log(`Client disconnected: [${ws.id}_${ip}_${name}]`);
    delete CLIENT_MAP[client.id];
  });
});

const publishMessage = (channel = "publish", payload)=> {
  Object.keys(CLIENT_MAP).map(id=>{
    const { ws, ip, name } = CLIENT_MAP[id]
    console.log(`----> [${channel}] [${ws.id}_${ip}_${name}]`)
    ws.send(JSON.stringify({channel, payload}));
  })
}

function sing(lyrics){
  console.log(`\n 🎶 ${lyrics} 🎶\n`)
}
