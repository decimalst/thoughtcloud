//this is where the API control flow lives

//router is like a mini-app.
var router = require('express').Router();
//mongoose handles js talking to mongodb
var mongoose = require('mongoose');
//connect to the db, use collection "thoughts"
mongoose.connect("localhost","thoughts");
//We need to bring in Post objects as
// mongoose document objects,
var Post = require('../../models/posts.js');


//Acutal routing below
//get posts that match req.query.tags
router.get('/posts',(req,res)=>{

  //find a query. The matched post will include
  // all tags defined in req.query.tags
  Post.find({tags:{$all:req.query.tags}},(err,post)=>{
    if(err) return res.status(404).end("no posts found");
    res.json(post);
    res.status(200).end("OK");
  })
})

//make a new post
router.post('/post',(req,res,next)=>{
  // Here we will write to the database.
  Post.create({ //make a new Post from the req.body
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags
  },(err, post)=>{
    if(err) return res.status(500).end("post failed");
    res.json(post._id);//resp with new post ID
    res.status(200).end("OK");
  });
})

//find post by ID
router.get('/post/:id',(req, res)=>{
  Post.findById(req.params.id,(err,post)=>{
    if(err) return res.status(404).end("post not found");
    res.json(post);//send entire post back
    res.status(200).end("OK");
  });
});

//add tags to post by ID
router.post('/post/:id',(req,res)=>{
  Post.findByIdAndUpdate(req.params.id,
  {$push: {"tags": {$each:req.body.tags}}},//push tags to array
  {safe: true, new : true},
  (err,post)=>{
    if(err) return res.status(404).end("post not found"+err);
    res.json(post);//give updated post back
    res.status(200).end("OK")
  })
});

module.exports = router;
