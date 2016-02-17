var router = require('express').Router();
var request = require('request');
var querystring = require('querystring');


// Handler for url/public/ endpoint
router.get("/",(req, res)=>{
  res.render("search");
});

//search request handler
router.get("/search",(req,res)=>{
  var tags = req.query.tags.split(',');
  var url = 'http://localhost:300/api/posts?';
  tags.forEach((val)=>{
    url+=('&tags='+val);//construct the unique query string for the API to parse
  })
  request.get(url,//get posts from API
  (err,resp,body)=>{
    if(!err&&resp.statusCode==200){
      //if we got the posts successfully, print them out. pass tags too
      res.render('posts',{tags:req.query.tags,posts:JSON.parse(body)});
    }
    else{res.status(500).end(err)}
  })
});

//get a specific post
router.get('/:id',(req,res)=>{
  var url = 'http://localhost:300/api/post/'+req.params.id;//construct api request
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
  var url = 'http://localhost:300/api/post/'+req.params.id;//construct api route
  var tags = req.body.tags.split(",");//construct tags array
  request.post(url,{form:{tags:tags}},(err,resp,body)=>{//fire api request
    if(!err&&resp.statusCode==200){//if successful
      res.redirect('/public/'+req.params.id);//reload page
    }
    else{res.status(500).end(err)}
  })
})
router.post('/post',(req,res)=>{
  var url = 'http://localhost:300/api/post'//where to send request
  var tags= req.body.tags.split(",");//get tags into an array
  request.post(url,{form:{//construct post form
    title:req.body.title,
    body:req.body.body,
    tags:tags
  }},(err,resp,body)=>{
    if(!err&&resp.statusCode==200){
      res.redirect('/public/'+JSON.parse(body))//go to new post
    }
  })
})

module.exports = router;
