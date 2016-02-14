var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.connect("localhost");
var Post = require('../../models/posts.js');

router.post('/post',(req,res,next)=>{
  // Here we will write to the database.
  Post.create({
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags
  },(err, small)=>{
    if(err) return res.status(500).end("post failed");
    console.log("aight")
    res.json(small._id);
    res.status(200).end("OK");
  });
})

module.exports = router;
