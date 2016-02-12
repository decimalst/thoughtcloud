// import the http package as an object.
var http = require("http");

// making a new server from http.createServer{https://nodejs.org/api/http.html#http_http_createserver_requestlistener}
// Docs on server object here: https://nodejs.org/api/http.html#http_class_http_server
var server = http.createServer(function(req, resp){
  // So this is going to just blindly send the content of myObj
  // to every single endpoint on url:300. We could add conditional
  // logic to handle different endpoints differently

  // print the req object so we can see the information we have access to
  // this is basically just for development
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
  /*
  So thinking of the terminology, CRUD, we'll need at least 4 endpoints per operation
  One for each operation. We'll also need to define our data.
  Will we have accounts, or is it totally anon?

  we'll have to think about tags, should we just define a small set of tags,
  or should users be able to define their own?

  here's an example of an api
  CREATE: POST -> /api/content/post
    request content:
      {
        name: "anonID",
        tags: [gay, comedy, space],
        content: "Long format text with tons of stuff, probably doesn't need line breaks"
      }
      // note: on this endpoint we'll just write it into the DB
  READ: GET -> /api/content/{unique post ID}
  UPDATE: UPDATE -> /api/content/{unique post ID}/update
  DELETE: DELETE -> /api/content/{unique post ID}/delete
  */
});



console.log("Server is listening on port 300...\nNavigate to localhost:300")
server.listen(300);
