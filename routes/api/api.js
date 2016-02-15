var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.connect("localhost","thoughts");
var Post = require('../../models/posts.js');

router.get('/posts',(req,res)=>{
  //res.json(req.query);
  Post.find({tags:{$all:req.query.tags}},(err,post)=>{
    if(err) return res.status(404).end("no posts found");
    console.log(req.query.tags,post);
    res.json(post);
    res.status(200).end("OK");
  })
})

router.post('/post',(req,res,next)=>{
  // Here we will write to the database.
  Post.create({
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags
  },(err, post)=>{
    if(err) return res.status(500).end("post failed");
    res.json(post._id);
    res.status(200).end("OK");
  });
})

router.get('/post/:id',(req, res)=>{
  Post.findById(req.params.id,(err,post)=>{
    if(err) return res.status(404).end("post not found");
    res.json(post);
    res.status(200).end("OK");
  });
});

router.post('/post/:id',(req,res)=>{
  Post.findByIdAndUpdate(req.params.id,
  {$push: {"tags": {$each:req.body.tags}}},
  {safe: true, new : true},
  (err,post)=>{
    if(err) return res.status(404).end("post not found"+err);
    res.json(post);
    res.status(200).end("OK")
  })
});

module.exports = router;
