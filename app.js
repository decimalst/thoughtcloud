// It all starts here

//Using express now. Read about it.
//http://expressjs.com/en/guide/routing.html

// import the depdencies as objects.
//express is a framework for http servers in node
var app = require('express')();
//bodyParser is a middleware for processing POST requests
var bodyParser = require('body-parser');
//API is the control interface router
var api = require("./routes/api/posts.js")

//requests will pass through bodyParser middleware first
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Defines what happens at the homepage
app.get('/',function(req,res){
  //for now we just write Hello into the body.
  //We can use some rendering engines to do cooler things
  res.send('Hello')
})

//use our API router
app.use('/api',api);

console.log("Server is listening on port 300...\nNavigate to localhost:300")
app.listen(300);
