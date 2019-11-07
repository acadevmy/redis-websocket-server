const WebSocket = require('ws');
const Redis = require("ioredis");
const isAllow = require('./src/blacklist');

const port = 8080;
//https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
const wss = new WebSocket.Server({ 
  port: port,
  maxPayload: process.env.MAX_PAYLOAD ? process.env.MAX_PAYLOAD : 1000,
  verifyClient: function(info) {
    // console.log(process.env);
    console.log('Origin:', info.origin);
    let allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS : 'origin-unknown';
    allowedOrigins = allowedOrigins.split(',');
    console.log('Allowed Origins:', allowedOrigins);
    let verified = false;
    allowedOrigins.forEach(function each(allow) {
      if(info.origin === allow) {
        verified = true;
      }
    });
    return verified;
  }
});
console.log('Start WebSocket.Server on: %s', port);

const createRedisClient = function(data) {
  const sessionId = data.sessionId ? data.sessionId : 'xxxx';
  const client = new Redis({
    keyPrefix: `${sessionId}:`,
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : '127.0.0.1'
  });
  console.log('Create new Redis client with prefix: %s', sessionId);
  return client;
};

const noop = function() {};

const heartbeat = function() {
  console.log('pong heartbeat...');
  this.isAlive = true;
};

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      console.log('terminate ws!');
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);

wss.on('connection', function connection(ws) {

  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('ping', console.info);

  // https://github.com/websockets/ws/issues/1417
  ws.on('error', console.error);

  ws.on('open', function open() {
    console.log('open');
  });
  
  ws.on('close', function close() {
    console.log('close');
  });

  ws.on('message', async function incoming(data) {
    console.log('message: %s', data);
    let request,response = {};
    let client;

    try {
      request = JSON.parse(data);//from string to object
    } catch (ex) {
      response.command = 'unknown';
      response.output = 'Invalid JSON';
      response.status = 'error';
      return ws.send(JSON.stringify(response));
    }

    try {
      client = createRedisClient(request);
      client.on("error", function(error) {
        console.log(error);
      });

      const commandString = request.command;
      const commandArray = commandString.split(" ");
      const command = commandArray[0];
      const args = commandArray.slice(1);
  
      response.command = commandString;//early set
  
      if(!isAllow(command)) {
        throw new Error('Command not allowed'); 
      }

      response.status = '-';
      response.output = await client.send_command(command,args);
      response.status = 'ok';

    } catch (ex) {
      // console.log(ex);
      console.log('Exception on send_command');
      response.output = ex.message;
      response.status = 'error';
    } finally {
      client.quit();
      //send response
      return ws.send(JSON.stringify(response));
    }

  });
});
