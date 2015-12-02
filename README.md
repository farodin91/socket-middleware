# socket-middleware
Use Websocket like koa.js


```js
var Middleware = require('socket-middleware');
var http = require('http').createServer().listen(3000);

var mv = new Middleware();

mv.use(function*(next){
  this.send('hi');
  yield next;
});

mv.attach(http);
```
