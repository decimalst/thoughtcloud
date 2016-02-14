// import the http package as an object.
var http = require("http");
var app = require('express')();
var bodyParser = require('body-parser');
var api = require("./routes/api/api.js")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
  res.send('Hello')
})
app.use('/api',api);

console.log("Server is listening on port 300...\nNavigate to localhost:300")
app.listen(300);
