const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
const userNameHolder = {
    name: String
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-wassim:joe123sh@cluster0.9lg9eft.mongodb.net/todolistDB", {useNewUrlParser: true});
const itemSchema = {
    name: String
}



const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    list:[itemSchema]
});

const User = new mongoose.model("User", userSchema);


app.get("/", function (req,res) {
    res.render("home"); 
    
});
app.get("/class", function (req,res) {
    res.sendFile(__dirname + "/index.html");
    
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({email: username}, (err, foundUser) => {
        if(err)
            console.log(err);
        else
            if(foundUser){
                if(foundUser.password === password){
                    userNameHolder.name = username;
                    res.render("todolist", {listItems: foundUser.list});
                }
                    
            }
    });
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if(err)
            console.log(err);
        else
            if(!foundUser){
                const user = new User({
                    email: username,
                    password: password,
                });
            
                user.save((err) => {
                    if(err)
                        console.log(err);
                    else
                        res.render("login");
                }); 
            }
    });

    
});
app.get("/todolist", (req, res) => {
    
    User.findOne({email: userNameHolder.name}, (err, foundUser) => {
        if(err)
            console.log(err);
        else
            {
                res.render("todolist", {listItems: foundUser.list});
            }
                
    });
});

app.post("/todolist/new-item", (req,res) => {
    const newItem = req.body.newItem;
    const item = {
        name: newItem
    };
    User.findOne({email: userNameHolder.name}, (err, foundUser) => {
        if(err)
            console.log(err);
        else
            {
                foundUser.list.push(item);
                foundUser.save();
                res.render("todolist", {listItems: foundUser.list});
                //res.redirect("/todolist");
            }
    });
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;

            User.findOneAndUpdate({email: userNameHolder.name}, {$pull: {list: {_id: checkedItemId}}}, function(err, foundList){
                if (!err){
                  res.redirect("/todolist");
                }
              });
        
});

// ----------------------------------------- Features -----------------------------------------------
app.get("/features", (req, res) => {
    res.render("features")
});

let port = process.env.PORT ;
if ( port == null || port == "" ) {
 port = 3000 ;
}


app.listen(port, function () {
    console.log("Server has started successfully.");
    
});