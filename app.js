//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express();

console.log(process.env.API_KEY)

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
      email: String,
      password:String
})


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"]});



const User = new mongoose.model("User", userSchema)


app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})


app.post("/register", async(req, res)=>{
    const newUser =  await new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    if(newUser)
    res.render("secrets");
    else{
        res.send("Error")
    }
})


app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

     let data  = await User.findOne({email: username})
        if(!data){
            console.log(err)
        } else {
            if (data) {
                if(data.password === password){
                   res.render("secrets");
                }
            }
        }   
})


app.listen(3000, function(){
    console.log("Server stated on post 3000")
})