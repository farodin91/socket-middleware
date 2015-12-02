var compose = require('koa-compose');
var co = require('co');
var Cookies = require('./cookies');
var engine = require('engine.io');

var mv = Middleware.prototype;
module.exports = Middleware;

function Middleware() {
  if (!(this instanceof Middleware)) return new Middleware;
  this.middleware = [];
  this.io = null;
}

mv.use = function(fn){
  this.middleware.push(fn);
  return this;
};

mv.attch = function(server){
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

mv.callback = function(){
  var mw = this.middleware;
  var self = this;

  return function(socket, data){
    var ctx = self.createContext(socket, data);
    var fn = co.wrap(compose(mw));
    fn.call(ctx).catch(function(err){
      logger.error(err)
    });
  }
};

mv.createContext = function(socket, data){
  var context = socket;
  //context.url = context.handshake.url;
  context.url = '/';
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
