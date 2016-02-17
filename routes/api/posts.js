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
  var query = {$or:[]}
  var tags= [].concat(req.query.tags);
  tags.forEach((tag)=>{
    var obj = {}
    obj['tags.'+tag]={$gt:0};
    query.$or.push(obj);
  })
  Post.find(query,(err,posts)=>{
    if(err) return res.status(404).end("no posts found");

    var relPosts = [];

    for(var i=0;i<posts.length;i++){
      var post = {post:posts[i], relevancy:0};
      for(var j=0;j<tags.length;j++){
        var total=0;
        for(var t in post.post.tags){
          if(post.post.tags.hasOwnProperty(t))total+=post.post.tags[t];
        }
        for(var t in post.post.tags){
          if(t==tags[j]){
            if(post.relevancy>0)post.relevancy+=(post.post.tags[t]/total);
            else post.relevancy=(post.post.tags[t]/total);
          }
        }
      }
      relPosts.push(post);
    }
    console.log(relPosts);
    relPosts.sort((a,b)=>{
      if(a.relevancy>b.relevancy)return -1;
      if(a.relevancy<b.relevancy)return 1;
      return 0;
    })
    res.json(relPosts);
    res.status(200).end("OK");
  })
})

//make a new post
router.post('/post',(req,res,next)=>{
  var tags = {};
  req.body.tags.forEach((tag)=>{
    tags[tag]=1;
  });
  // Here we will write to the database.
  Post.create({ //make a new Post from the req.body
    title: req.body.title,
    body: req.body.body,
    tags: tags
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
  Post.findOne({_id:req.params.id},
  (err,post)=>{
    if(err) return res.status(404).end("post not found"+err);
    req.body.tags.forEach((tag)=>{
      if(!post.tags[tag])post.tags[tag]=1;
      else post.tags[tag]++;
    })
    post.markModified('tags');
    post.save((err)=>{
      if(err) {console.log(err); return res.status(500).end(err);}
      res.json(post);//give updated post back
      res.status(200).end("OK");
    })
  })
});

module.exports = router;
