var eio = require("engine.io-client");

var socket = new eio.Socket();

socket.on('open', function () {
  console.log("test");
  socket.send({path:"update",data:{name:"test"}});
});
