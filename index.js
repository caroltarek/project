var express = require('express');
var app=express();
var path=require ('path');
var bodyParser = require('body-parser');
var multer = require('multer');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/project');
var fs = require('fs');
module.exports = app;


//connect to local mongodb database
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
});

//attach lister to connected event
mongoose.connection.once('connected', function() {
  console.log("Connected to database")
});
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
var Schema=mongoose.Schema;
var StudentSchema  = new Schema({
    username: String,
  password:String
 
});
 


var ClientSchema =new Schema({
  firstname:String,
  lastname:String,
   description:String,
 profilePicture : { data: Buffer, contentType: String },
 
   yourwork:String,
 screenshots : { data: Buffer, contentType: String }

});



module.exports=mongoose.model('reg',StudentSchema);
var   reg = mongoose.model("reg", StudentSchema);




module.exports=mongoose.model('clients',ClientSchema);
var   clients = mongoose.model("clients", ClientSchema);



// view engine
app.set('view engine','ejs');




app.engine('html',require('ejs').renderFile);


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(upload.array()); // for parsing multipart/form-data
app.use(express.static('public'));
//app.use(imgPath, express.static(__dirname + '/public'));

// var storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, 'public')
//   },
//   filename: function(req, file, callback) {
//     console.log(file)
//    // callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
// callback(null,file.originalname);
//   }

// });

// var upload = multer({
//  storage: storage
// });

app.get('/', function(req, res,next){
   res.render('welcome.ejs');
   next();
   });




app.post('/home.html',function(req, res) {
var firstname =req.body.firstname;

 var lastname = req.body.lastname;
 var profilePicture = req.body.profilePicture ;
 var description= req.body.description;
   var yourwork=req.body.yourwork;
  var screenshots = req.body.screenshots;

var newclient=new clients();

  console.log('hii2');
newclient.firstname=firstname;
newclient.lastname=lastname;
newclient.profilePicture=profilePicture;
newclient.description=description;
newclient.yourwork=yourwork;
newclient.screenshots=screenshots;
newclient.save(function(err,savedUser){
  if (err){
    console.log('errr');
    return res.status(500).send();
  }
console.log(newclient.firstname);
  return res.render('welcome.ejs');
});

  
      
});




  






app.get('/visitor.html',function  (req,res) {
res.render('visitor.ejs');

});












app.post('/login.html',function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  reg.findOne({username:username ,password :password},function(err,user){
    if(err){
      console.log("pl");
      return res.status(500).send();
    }
    if(!user){
        console.log("pla");
       res.send("incorrect password or username , try again !!");
      return res.status(404).send();
    }
   
    return res.render('home.ejs');
  })
});
app.get('/login.html', function(req, res){
   res.render('login.ejs');
  
    
});
app.get('/home.html',function(req,res){
  res.render('try.ejs');
})

app.post('/register.html',function(req,res){
  
   var username=req.body.username; 
   var password=req.body.password;



var newuser=new reg();
newuser.username=username;
newuser.password=password;
newuser.save(function(err,savedUser){
  if (err){
    return res.status(500).send();
  }
  console.log(newuser.username);
  return res.render('welcome.ejs');
})

 	
      
});
app.use('/register.html', function(req, res){
   res.render('register.ejs');
  
    
});




app.get('/vs.html', function(req , res){

    


 clients.find({},function(err,docs){

res.render('visiting.ejs',{docs:docs});
 });    
  
});
    // });






app.get('/welcome.html', function(req, res){
   res.render('welcome.ejs');
 
    

});




app.listen(3000);






 

