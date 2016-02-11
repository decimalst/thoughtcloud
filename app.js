var http = require("http");
//basically everything is of an abstract object type
// meaning every defined thing has dot other things with it
// these are called prototypes, I think. Prototypes are just
// the shit that comes with your object. Like a string has a
// .size attribute prototyped or some shit. proto-post-type
// you can override it and get into the nitty gritty details but
// fuck that. for now, just don't worry about that complex stuff.
// more details can be found in the eloquent js book.

// Alright javascript is really cool.
// Super easy to read literally 5 year olds can use this shit

//this is a variable definition, you do var varname. it's easy
// javascript doesn't have types, ``
var a;
var b = 1;
var cuck = "myshitup";

// pretty sure you always use var for any variable name,
// even for defining functions
var adder = function(a,b){
  return a+b;
}

var server = http.createServer(function())
