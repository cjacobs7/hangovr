var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    

mongoose.connect("mongodb://localhost/auth_demo_app");


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "This is the secret string that will encode our stuff",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//comes from passport.local.mongoose
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================
//ROUTES
//=================

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});


//===============
//Auth Routes
//===============

app.get("/register", function(req, res){
    res.render("register");
})
//handling user sign up
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    });
});

//================
//LOGIN ROUTES
//================

app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", passport.authenticate("local" , {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//MIDDLEWARE
//almost always take 3 parameters
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect("/login");
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Login Test Server Started")
});