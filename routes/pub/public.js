var router = require('express').Router();
var request = require('request');
var querystring = require('querystring');

router.get("/",(req, res)=>{
  res.render("search");
});
router.get("/search",(req,res)=>{
  var tags = req.query.tags.split(',');
  var url = 'http://localhost:300/api/posts?';
  tags.forEach((val)=>{
    url+=('&tags='+val);
  })
  request.get(url,
  (err,resp,body)=>{
    if(!err&&resp.statusCode==200){
      res.render('posts',{tags:req.query.tags,posts:JSON.parse(body)});
    }
    else{res.status(500).end(err)}
  })
  //res.json(tags);
});
router.get('/:id',(req,res)=>{
  var url = 'http://localhost:300/api/post/'+req.params.id;
  request.get(url,(err,resp,body)=>{
    if(!err&&resp.statusCode==200){
      res.render('post',{post:JSON.parse(body)});
    }
    else{res.status(500).end(err)}
  })
});
router.post('/:id/tag',(req,res)=>{
  var url = 'http://localhost:300/api/post/'+req.params.id;
  var tags = req.body.tags.split(",");
  request.post(url,{form:{tags:tags}},(err,resp,body)=>{
    if(!err&&resp.statusCode==200){
      res.render('post',{post:JSON.parse(body)});
    }
    else{res.status(500).end(err)}
  })
})

module.exports = router;
