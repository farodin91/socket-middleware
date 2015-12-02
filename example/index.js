
var koa = require('koa');
var app = koa();
var Middleware = require('../index');
var koa_static = require('koa-static');
var http = require('http');


app.use(koa_static('./public/', { index: 'index.html' }));

var mw = new Middleware();
mw.use(function*(next){
  console.log("test2");
  //this.send('hi');
  yield next;
});

var server = http.Server(app.callback()).listen(8000);
mw.attach(server);
