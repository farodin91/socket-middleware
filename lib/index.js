var compose = require('koa-compose');
var co = require('co');
var Cookies = require('./cookies');
var engine = require('socket.io');
var events = require('events');
var statuses = require('statuses');
var util = require('util');

var middleware = Middleware.prototype;
module.exports = Middleware;

function Context(socket){
  this.url = '/';
  this.status = 200;
  this.body = null;
  this.cookies = new Cookies(socket.handshake);
  this.socket = socket;
  this.path = "";
  this.data = null;
  events.EventEmitter.call(this);
}
util.inherits(Context, events.EventEmitter);

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
  this.io = engine(server);
  var callback = this.callback();
  this.io.on('connection', function (socket) {
    //console.log(socket);
    socket.on('request', function(data){
      callback(socket, data);
    });
  });
}

middleware.callback = function(){
  var mw = this.middleware;
  var self = this;

  return function(socket, data){
    var ctx = self.createContext(socket, data);
    var fn = co.wrap(compose(mw));
    fn.call(ctx).then(function(){
      respond.call(ctx);
    }).catch(function(err){
      console.error(err)
    });
  }
};

middleware.createContext = function(socket, data){
  var context = new Context(socket);
  if(data != null && data.type != ""){
    context.path = data.path;
    context.data = data.data;
  }
  return context;
};

function respond() {
  // allow bypassing koa
  if (false === this.respond) return;

  var code = this.code;
  var body = this.body;

  if (statuses.empty[code]) {
    return;
  }

  // status body
  if (null == body) {
    this.type = 'text';
    body = this.message || String(code);
  }
  this.socket.emit('response',{
    body:body,
    status:code,
    path:this.path
  });
  this.emit('end');
}
