# REDIS WEBSOCKET SERVER
## A simple bridge to use [Redis](https://redis.io/) in a WebSocket way!

_REDIS WebSocket Server_ is a simple NodeJS script used as a bridge to interact with [Redis Server](https://redis.io/) via WebSocket.

### Installing with Docker
Running the environment with Docker:
        
    docker-compose up

Check if _Redis WebSocket Server_ responds at _ws://127.0.0.1:8080_ address.

_Redis WebSocket Server_ uses only these dependencies:  
- WebSocket: https://github.com/websockets/ws   
- ioRedis: https://github.com/luin/ioredis

### Send a command to [Redis Server](https://redis.io/) with _Redis WebSocket Server_
It will be necessary to send a WebSocket request with a payload like this:

    { 
        command: 'SET foo 10', 
        sessionId: this.sessionId, // Client Side generated
        date: Date.now() 
    }

The response will be an object like:

    // Standard Response
    {
        response.command = 'SET foo 10';
        response.output = 'OK';
        response.status = 'ok';
    }

    // Response with error
    {
        response.command = 'unknown';
        response.output = 'Invalid JSON';
        response.status = 'error';
    }

### Contribute
If you wish to contribute please read [CONTRIBUTING.md](https://github.com/acadevmy/redis-websocket-server/blob/master/CONTRIBUTING.md) file.
Thanks for your future contributions!

&nbsp;

### 🚀 Redis Patterns Console (Angular SPA) 🚀
_Redis WebSocket Server_ is used, for instance, with _Redis Patterns Project_. It is used for communication between [Redis Server](https://redis.io/) and [_Redis Patterns Console_](https://acadevmy.github.io/redis-patterns-console).

With [_Redis Patterns Console_](https://acadevmy.github.io/redis-patterns-console) you can try and go into the deep of [Redis](https://redis.io/) and its patterns with an interactive (and reactive) online console!  
Visit [https://acadevmy.github.io/redis-patterns-console](https://acadevmy.github.io/redis-patterns-console) and enjoy it!

[_Redis Patterns Console_](https://acadevmy.github.io/redis-patterns-console) is an Angular SPA and an open-source project, so you can contribute if you wish.  
Visit our repo on GitHub:  
[https://github.com/acadevmy/redis-patterns-console](https://github.com/acadevmy/redis-patterns-console)

### 📖 Redis Patterns Cookbook 📖

Furthermore, you can visit [_REDIS Patterns Cookbook repository_](https://github.com/acadevmy/redis-patterns-cookbook) and read some of the most common patterns of [Redis](https://redis.io/), the greatest _in memory database_.

&nbsp;

Maintained with ❤️ by [Acadevmy](https://www.acadevmy.it/intro)
