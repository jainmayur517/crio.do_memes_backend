var exp= require('express');
var app =exp();
var serve=require('express-static');
var mongoose=require("mongoose");

const cors = require('cors');

var request=require('request');
app.set("view engine","ejs");
var bodyParser=require("body-parser");
app.use(cors());
app.use(bodyParser.json());

//mongoose.connect("mongodb+srv://crio_user:Mj123@cluster0.lass7.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect("mongodb+srv://crio:1234@cluster0.lass7.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology:true })
mongoose.connection.on("error", function(error) {
    console.log(error)
  })
  
  mongoose.connection.on("open", function() {
    console.log("Connected to MongoDB database.")
  })

var memeSchema = new mongoose.Schema({
 name: String,
 url: String,
});

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

app.post("/memes",function(req,res){
    var name=req.body.name;
    var url=req.body.url;
    var newMeme={
        name: name,
        url: url
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

app.get("/memes/:id",async(req,res)=>{
var id2=req.params.id;

try{
    const meme=await Meme.findById(id2)
    res.json(meme)
}catch(err){
    res.send('Error' +err)
}
})


app.listen(process.env.PORT,process.env.IP)
//function(){
  //console.log("server started!");
  //});