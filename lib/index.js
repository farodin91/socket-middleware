var compose = require('koa-compose')
var co = require('co')
var Cookies = require('./cookies')
var engine = require('socket.io')
var events = require('events')
var statuses = require('statuses')
var util = require('util')

var middleware = Middleware.prototype
module.exports = Middleware

function Context (socket, globals) {
  this.url = '/'
  this.globals = globals || null
  this.status = 200
  this.body = null
  this.cookies = new Cookies(socket.handshake)
  this.socket = socket
  this.path = ''
  this.data = null
  events.EventEmitter.call(this)
}
util.inherits(Context, events.EventEmitter)
function GlobalContext (socket) {
  this.url = '/'
  this.cookies = new Cookies(socket.handshake)
  this.socket = socket
}

function Middleware () {
  if (!(this instanceof Middleware)) return new Middleware()
  this.middleware = []
  this.insert_middleware = []
  this.io = null
}

middleware.use = function (fn) {
  this.middleware.push(fn)
  return this
}

middleware.insert = function (fn) {
  this.insert_middleware.push(fn)
  return this
}

middleware.attach = function (server) {
  var self = this
  this.io = engine(server)
  this.io.on('connection', function (socket) {
    let global_ctx = new GlobalContext(socket)
    if (self.insert_middleware.length !== 0) {
      var fn = co.wrap(compose(self.insert_middleware))
      fn.call(global_ctx).then(function () {
        socket.on('request', function (data) {
          var ctx = self.createContext(socket, data, global_ctx)
          var fn = co.wrap(compose(self.middleware))
          fn.call(ctx).then(function () {
            respond.call(ctx)
          }).catch(function (err) {
            console.error(err)
          })
        })
      }).catch(function (err) {
        console.error(err)
      })
    }
  })
}

middleware.createContext = function (socket, data, globals) {
  var context = new Context(socket)
  if (data !== null && data.type !== '') {
    context.path = data.path
    context.data = data.data
  }
  return context
}

function respond () {
  // allow bypassing koa
  if (this.respond === false) return

  var code = this.status
  var body = this.body

  if (statuses.empty[code]) {
    return
  }

  // status body
  if (body === null) {
    this.type = 'text'
    body = this.message || String(code)
  }
  this.socket.emit('response', {
    body: body,
    status: code,
    path: this.path
  })
  this.emit('end')
}
