// import the http package as an object.
var http = require("http");

// making a new server from http.createServer{https://nodejs.org/api/http.html#http_http_createserver_requestlistener}
// Docs on server object here: https://nodejs.org/api/http.html#http_class_http_server
var server = http.createServer(function(req, resp){
  // So this is going to just blindly send the content of myObj
  // to every single endpoint on url:300. We could add conditional
  // logic to handle different endpoints differently

  // print the req object so we can see the information we have access to
  console.log(req);

  // make an example object. Something like this could come from mongodb
  var myObj = {
    name: "jack",
    age: 12
  }

  //we close the connection and send the obj as JSON
  // json is a string representation of javascript objects.
  // JSON is JavaScript Object Notation
  resp.end(JSON.stringify(myObj));
});



console.log("Server is listening on port 300...\nNavigate to localhost:300")
server.listen(300);
