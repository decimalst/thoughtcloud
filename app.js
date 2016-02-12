// import the http package as an object.
var http = require("http");

// making a new server from http.createServer{https://nodejs.org/api/http.html#http_http_createserver_requestlistener}
// Docs on server object here: https://nodejs.org/api/http.html#http_class_http_server
var server = http.createServer(function(req,resp){
  console.log("Pong!")
  resp.end("hello world! -ping");
});

console.log("Server is listening on port 300...")
server.listen(300);
