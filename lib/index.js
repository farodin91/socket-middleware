var compose = require('koa-compose');
var co = require('co');
var Cookies = require('./cookies');
var engine = require('engine.io');

var middleware = Middleware.prototype;
module.exports = Middleware;

function Middleware() {
  if (!(this instanceof Middleware)) return new Middleware;
  this.middleware = [];
  this.io = null;
}

middleware.use = function(fn){
  this.middleware.push(fn);
  return this;
};

middleware.attach = function(server){
  var self = this;
  this.io = engine.attach(server);
  var callback = this.callback();
  this.io.on('connection', function (socket) {
    socket.on('message', function(data){
      callback(socket, data);
    });
    //socket.on('close', function(){ });
  });
}

middleware.callback = function(){
  var mw = this.middleware;
  var self = this;

  return function(socket, data){
    var ctx = self.createContext(socket, data);
    console.log(data)
    var fn = co.wrap(compose(mw));
    fn.call(ctx).then(function(){
      console.log("test")
    }).catch(function(err){
      console.error(err)
    });
  }
};

middleware.createContext = function(socket, data){
  var context = socket;
  context.url = '/';
  context.status = 200;
  context.body = null;
  context.cookies = new Cookies(context.handshake);
  if(data != null && data.type != ""){
    context.path = data.path;
    context.data = data.data;
  } else {
    context.path = "";
    context.data = null;
  }
  return context;
};
