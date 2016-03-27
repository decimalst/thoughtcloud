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

router.all('/*',(req,res,next)=>{
  //if(req.hostname!="localhost")res.status(500).end("err");
  //else
  next();
})

//Acutal routing below
//get posts that match req.query.tags
router.get('/posts',(req,res)=>{
  //find a query. The matched post will include
  // all tags defined in req.query.tags
  var query = {$or:[]}
  var tags= [].concat(req.query.tags);
  tags.forEach((tag)=>{//convert tags array into a mongodb query.
    var obj = {};
    obj['tags.'+tag+".count"]={$gt:0};
    query.$or.push(obj);
  })
  Post.find(query,(err,posts)=>{//query= {$or:[{tags.*:{$gt:0}}]}
  // query line means any post who has more than zero tags named tag.* where *
  // is one of several tag names from the request. Each tag from request is pushed
  // into the $or array, so each is tested.
    if(err) return res.status(404).end("no posts found");

    var relPosts = [];

    //Here's the relevancy checker
    for(var i=0;i<posts.length;i++){//check all matched posts
      var post = {post:posts[i], relevancy:0};//make new object
      for(var j=0;j<tags.length;j++){//check all the search tags
        var total=0;
        for(var t in post.post.tags){//sum up total votes
          if(post.post.tags.hasOwnProperty(t))total+=post.post.tags[t].count;
        }
        for(var t in post.post.tags){//compute relevancy for all tags
          if(t==tags[j]){//only matched tags matter
            //if relevancy already exists(one search term was already matched)
            //then increment the relevancy by the next search term relevancy.
            if(post.relevancy>0)post.relevancy+=(post.post.tags[t].count/total);

            //otherwise, just set relevancy to the current weight of tag wrt total.
            else post.relevancy=(post.post.tags[t].count/total);
          }
        }
      }
      post.relevancy*=100;
      //add the computed posts to relPosts for export
      relPosts.push(post);
    }

    relPosts.sort((a,b)=>{//sort relPosts by most relevant first
      if(a.relevancy>b.relevancy)return -1;
      if(a.relevancy<b.relevancy)return 1;
      return 0;
    })
    res.json(relPosts);//Ship it!
    res.status(200).end("OK");
  })
})

//make a new post
router.post('/post',(req,res,next)=>{
  var tags = {};
  req.body.tags.forEach((tag)=>{//make tags into an object for saving into db
    tags[tag]={count:1,ips:[req.body.ip]};
    //when posts are first created the tags can't be added more than once.
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
  Post.findById(req.params.id,(err,post)=>{//get the post by the id from the url
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
    if(!req.body.tags)req.body.tags=[];
    req.body.tags.forEach((tag)=>{//for each tag
      if(!post.tags[tag]){
        post.tags[tag] = {count:1,ips:[req.body.ip]}
      }
      else{
        if(post.tags[tag].ips.indexOf(req.body.ip)!=-1)return;
        post.tags[tag].count++;//increment if it does exist
        post.tags[tag].ips.push(req.body.ip);
      }
    })
    post.markModified('tags');//since tags is a multitype, we have to mark it for update
    post.save((err)=>{//save new post.
      if(err) {console.log(err); return res.status(500).end(err);}
      res.json(post);//give updated post back
      res.status(200).end("OK");
    })
  })
});

module.exports = router;
