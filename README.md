# socket-middleware
Use Websocket like koa.js


```js
var Middleware = require('socket-middleware');
var http = require('http').createServer().listen(3000);

var mw = new Middleware();

mw.use(function*(next){
  this.send('hi');
  yield next;
});

mw.attach(http);
```
