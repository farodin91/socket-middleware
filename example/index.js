var koa = require('koa')
var app = koa()
var Middleware = require('../index')
var koa_static = require('koa-static')
var http = require('http')

var logger = require('./logger.js')

app.use(koa_static('./public/', { index: 'index.html' }))

var mw = new Middleware()
mw.insert(function * (next) {
  console.log('connection')
  yield next
})
mw.use(logger())
mw.use(function * (next) {
  // this.send('hi')
  this.body = this.path
})

var server = http.Server(app.callback()).listen(8000)
mw.attach(server)
console.log('Server is listen on 8000')
