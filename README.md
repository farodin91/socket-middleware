# socket-middleware
Use Websocket like koa.js


```js
var Middleware = require('middleware');
var http = require('http').createServer().listen(3000);

var socket = new Middleware();

socket.use(function*(next){
  yield next;
});

socket.attach(http);
```
