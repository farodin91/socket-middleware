var socket = io.connect('http://localhost:8000');

socket.on('response', function (data) {
  console.log(data)
});
socket.emit('request',{path:"test1",data:{name:"test"}});
socket.emit('request',{path:"test2",data:{name:"test"}});
socket.emit('request',{path:"test3",data:{name:"test"}});
socket.emit('request',{path:"test4",data:{name:"test"}});
socket.emit('request',{path:"test5",data:{name:"test"}});
socket.emit('request',{path:"test6",data:{name:"test"}});
