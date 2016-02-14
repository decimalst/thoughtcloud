// import the http package as an object.
var http = require("http");


// making a new server from http.createServer{https://nodejs.org/api/http.html#http_http_createserver_requestlistener}
// Docs on server object here: https://nodejs.org/api/http.html#http_class_http_server
var server = http.createServer();
var router = require("./router.js")(server);
router.on('GET','/main',(req, resp) => {
  resp.end("Main page");
});
router.on('GET','/dicks',(req,resp)=>{
  resp.end("Dicks!");
});


console.log("Server is listening on port 300...\nNavigate to localhost:300")
server.listen(300);
