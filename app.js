// import the http package as an object.
var http = require("http");
var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
  res.send('Hello')
})

app.post('/api/post',function(req,res,next){
  console.log(req.body);
  res.json(req.body);
  res.end();
})

console.log("Server is listening on port 300...\nNavigate to localhost:300")
app.listen(300);
