// It all starts here

//Using express now. Read about it.
//http://expressjs.com/en/guide/routing.html

// import the depdencies as objects.
//express is a framework for http servers in node
var app = require('express')();
//bodyParser is a middleware for processing POST requests
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//API is the control interface router
var api = require("./routes/api/posts.js");
var pub = require("./routes/pub/public.js");

//requests will pass through bodyParser middleware first
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('dudeffflmao'));
app.use(require('express').static('public'));

app.set('view engine', 'jade');

//Defines what happens at the homepage
app.get('/',function(req,res){
  //for now we just write Hello into the body.
  //We can use some rendering engines to do cooler things
  // res.render('home',{title: 'fffff', message: 'home'})
  res.redirect('/public'); //screw this, handle it only in the public router

})

app.get('/searching',function(req,res){
  //Show searching page
  res.render('search',{title: 'fffff', message: 'search'})
})

app.get('/posting',function(req,res){
  //Show searching page
  res.render('posting',{title: 'fffff', message: 'post'})
})

app.get('/contact',function(req,res){
  //Show searching page
  res.render('contact',{title: 'fffff', message: 'post'})
})

//use our API router
app.use('/api',api);

app.use('/public',pub);

console.log("Server is listening on port "+process.env.PORT+"...\nNavigate to localhost:"+process.env.PORT)
app.listen(process.env.PORT||300,'0.0.0.0');
