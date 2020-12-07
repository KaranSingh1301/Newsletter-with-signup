
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
let posts=[];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true,  useUnifiedTopology: true});

const postSchema={
  title:String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// const listSchema ={
//   name:String,
//   posts: [postSchema];
// }

app.get("/",function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


app.get("/home", function(req, res){
  res.render("home",{
    HomeSc:homeStartingContent,
    postsContent: posts
})
  });


  // routing parameters
  app.get("/post/:page", function(req, res){

  const requestPara= _.lowerCase(req.params.page);

  posts.forEach(function(post){
    var stored = _.lowerCase(post.title);
    if(requestPara===stored){
    res.render("post",{
    headTitle : post.title,
    bodyContent: post.content
    })
  }

  });

  });


  text_truncate = function(str, length, ending) {
      if (length == null) {
        length = 100;
      }
      if (ending == null) {
        ending = '...';
      }
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
      } else {
        return str;
      }
    };

    // get for about
    app.get("/about", function(req, res){
      res.render("about",{
        contentAbout: aboutContent
      })
    });

    // get for contact
    app.get("/contact", function(req, res){
      res.render("contact",{
        contentContact: contactContent
      })
    });

    app.get("/compose", function(req, res){
    res.render("compose");
    });



app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postsBody
  });
     console.log(req.body.postBody);
  // const post ={
  //     title: req.body.postTitle,
  //     content: req.body.postBody
  //   };
  // posts.push(post);
  post.save();


  res.redirect("/home");

});


app.post("/",function(req,res){

  var firstName = req.body.fname;
    var lasttName = req.body.lname;
      var emailUser = req.body.email;

  console.log(firstName, lasttName, emailUser);

 var data={
   members: [
     {
      email_address : emailUser,
      status: "subscribed",
      merge_fields:{
        FNAME : firstName,
        LNAME : lasttName

      }
     }
   ]
 };

 const jsonData = JSON.stringify(data);
const url = "https://us7.api.mailchimp.com/3.0/lists/1288aa5bbb";

const options ={
  method: "POST",
  auth : "karan13:a0da58fb70269c2ba847993609507e85-us7"

}
 const request =https.request(url, options, function(response){
   if(response.statusCode===200){
     res.sendFile(__dirname + "/success.html");
   }
   else {
     res.sendFile(__dirname + "/failure.html");
   }
   response.on("data",function(data){
     console.log("ok");
   });
 });

request.write(jsonData);
request.end();
res.redirect("home");

});





app.post("/failure",function(req,res){
  res.redirect("/");
});











app.listen(process.env.PORT || 3000, function(){
  console.log("sever is running at 3000.");
});

//api key
// a0da58fb70269c2ba847993609507e85-us7

//list key
// 1288aa5bbb
