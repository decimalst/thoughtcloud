var router = require('express').Router();
var request = require('request');
var querystring = require('querystring');


// Handler for url/public/ endpoint
router.get("/",(req, res)=>{
  // tags=test below is what sets the default tag search param
  var url = 'http://localhost:'+process.env.PORT+'/api/posts?tags=test';
  //All this stuff is to handle the default tag search. for now it is Test
  request.get(url,//get posts from API
  (err,resp,body)=>{
    if(!body)err="No body!";
    if(!err&&(resp.statusCode==200)||(resp.statusCode==404)){
      body = body?body:"{}";
      for(post in body){
        post.relevancy = Math.round(post.relevancy);
        console.log(post.relevancy);
      }
      //if we got the posts successfully, print them out. pass tags too
      res.render('home',{posts:JSON.parse(body)});
    }
    else{
      res.status(500).end(err)}
  })
  //res.render("home",{});
});

// Handler for url/public/ endpoint
router.get("/searching",(req, res)=>{
  res.render("search",{title: 'fffff', message: 'searching'});
});

//search request handler
router.get("/search",(req,res)=>{
  var tags = req.query.tags.split(',');
  var url = 'http://localhost:'+process.env.PORT+'/api/posts?';
  tags.forEach((val)=>{
    url+=('&tags='+val);//construct the unique query string for the API to parse
  })
  request.get(url,//get posts from API
  (err,resp,body)=>{
    if(!err&&(resp.statusCode==200)||(resp.statusCode==404)){
      body = body?body:"{}";
      //if we got the posts successfully, print them out. pass tags too
      res.render('posts',{tags:req.query.tags,posts:JSON.parse(body)});
    }
    else{
      res.status(500).end(err)}
  })
});

//get a specific post
router.get('/:id',(req,res)=>{
  var url = 'http://localhost:'+process.env.PORT+'/api/post/'+req.params.id;//construct api request
  request.get(url,(err,resp,body)=>{//send api request
    if(!err&&resp.statusCode==200){
      //render post
      res.render('post',{post:JSON.parse(body)});
    }
    else{res.status(500).end(err)}
  })
});
//add tags to post
router.post('/:id/tag',(req,res)=>{
  var url = 'http://localhost:'+process.env.PORT+'/api/post/'+req.params.id;//construct api route
  var multiSetTags = req.body.tags.split(",");//construct tags array
  var tags = [];
  multiSetTags.forEach((item)=>{
    item = item.trim();
    if(tags.indexOf(item)<0)tags.push(item);
  });
  request.post(url,{form:{tags:tags,ip:req.ip}},(err,resp,body)=>{//fire api request
    console.log('added',tags);
    if(!err&&resp.statusCode==200){//if successful
      res.redirect('/public/'+req.params.id);//reload page
    }
    else{
      console.log(err);
      res.status(500).end()}
  })
})
//create new toast
router.post('/post',(req,res)=>{
  var url = 'http://localhost:'+process.env.PORT+'/api/post'//where to send request
  var multiSetTags= req.body.tags.split(",");//get tags into an array
  var tags = [];
  multiSetTags.forEach((item)=>{
    item = item.trim().replace(/\W/g, '');
    if(tags.indexOf(item)<0)tags.push(item);
  })
  request.post(url,{form:{//construct post form
    title:req.body.title,
    body:req.body.body,
    tags:tags,
    ip:req.ip
  }},(err,resp,body)=>{
    if(!err&&resp.statusCode==200){
      res.redirect('/public/'+JSON.parse(body))//go to new post
    }
  })
})

module.exports = router;
