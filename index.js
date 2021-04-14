var exp= require('express');
var app =exp();
var serve=require('express-static');
var mongoose=require("mongoose");
var normalize = require("normalize-mongoose");
//const urlm=require("url");

//const cors = require('cors');

var request=require('request');
app.set("view engine","ejs");
var bodyParser=require("body-parser");
//app.use(cors());
app.use(bodyParser.json());

//replace xxxxx with your url
mongoose.connect("XXXXXXX",{useNewUrlParser: true,useUnifiedTopology:true })
mongoose.connection.on("error", function(error) {
    console.log(error)
  })
  
  mongoose.connection.on("open", function() {
    console.log("Connected to MongoDB database.")
  })

var memeSchema = new mongoose.Schema({
 name: String,
 url: String,
 caption: String,
});

memeSchema.plugin(normalize);

var Meme=mongoose.model("Meme",memeSchema);
/*
Meme.create(
    {

    name: "Mayur",
    url: "https://preview.redd.it/4ln805k5fvr31.jpg?width=563&format=pjpg&auto=webp&s=c3233d407fdad7b1513480b6f6d8d202cc63afed"

    }, function(err,Meme){
        if(err){
            console.log(err);

        }
        else{
            console.log("newly created meme");
            console.log(Meme);
        }
    }

)
*/


//for CORS POLICY
app.use((req,res,next) => {
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept, Authorization"
);

if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}

next();

});


//get request to retrieve all memes
app.get("/memes",function(req,res){
//res.render("landing",{Meme: Meme});
Meme.find({}, function(err,allmeme){
    if(err){
        console.log(err);
    }
    else{
        res.send({Meme: allmeme});
    }

});
});

//post request to post memes  
app.post("/memes",function(req,res){
    var name=req.body.name;
    var url=req.body.url;
    var caption=req.body.caption;
    var newMeme={
        name: name,
        url: url,
        caption: caption 
    }
/*
    try{
        const a1=await newMeme.save()
        res.json(a1)
    }catch(err){
        res.send('Error')
    }
*/
    Meme.create(newMeme,function(err,newly){
        if(err){
            console.log(err);
        }
        else{
            res.json(newMeme);
       //     res.redirect("/");
        }
    });
   // Meme.push(newMeme);
    

  //  res.redirect("/");


});


//to retreive meme of particular id
app.get("/memes/:id",async(req,res)=>{
var id2=req.params.id;

try{
    const meme=await Meme.findById(id2)
    res.json(meme)
}catch(err){
    res.send('Error' +err)
}
})


//edit request 
app.patch("/memes/:id/",async(req,res)=>{
 try{      
    const change=await Meme.findById(req.params.id)
    change.url=req.body.url
    change.caption=req.body.caption
    const a1=await change.save()
    res.json(a1)
}catch(err){
    res.send(err)
}
})


app.listen(process.env.PORT,process.env.IP)
//function(){
  //console.log("server started!");
  //});
