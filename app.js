//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Establish connection with db
mongoose.connect('mongodb://localhost:27017/postsDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Creating a schema
const postSchema = mongoose.Schema({
      title: String,
      post: String
});

//Creating a model/collection
const Post = mongoose.model('Post', postSchema);


let posts = [];
app.get('/', function(req, res){
  Post.find({}, function(err, newPost){
    if(err){
      console.log(err);
    }else{
      res.render('home', {startingContent: homeStartingContent, posts: newPost});
      
    }
  })
  
})

app.get('/about', function(req, res){
  res.render('about', {aboutContent: aboutContent })
})


app.get('/contact', function(req, res){
  res.render('contact', {contactContent: contactContent })
})

app.get('/compose', function(req, res){
  res.render('compose');
})

app.post('/compose', function(req, res){
  const post = {
    title: req.body.title,
    post: req.body.postMessage
  }
  //posts.push(post)
  //creating a post and saving it in a database
  const postEntry = new Post(post);
  postEntry.save(function(err){
    if(!err){
      res.redirect('/');
    }
  });
  
})

app.get('/posts/:id', function(req, res){
  
  let requestedTitle = _.upperFirst(req.params.postName);
  console.log(requestedTitle);
  let id = req.params.id;
  Post.find({_id:id}, function(err, posts){
    if(err){
      console.log(err);

    }else{
      res.render('post', {data:posts});
      console.log(posts);
    }
  })
  // posts.forEach(post => {
  //   let postTitle = _.lowerCase(post.title);
  //   if( postTitle === requestedTitle){
  //     res.render('post', {title: post.title, content: post.content});
  //   }else{
  //     alert('Invalid Post Name');
  //   }
  // })
})

app.post('/',function(req, res){
  //go to the database
  //find the post to delete and delete it
  //render user to homepage
  Post.findOneAndDelete({}, {sort:{id: -1}}, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/');
    }
  })

})








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
