require('dotenv').config()

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Add sessions
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//Initialize passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/carDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const carSchema = {
    stock_num: String,
    make: String,
    model: String,
    year: Number,
    price: Number,
    color: String
};

const Car = mongoose.model('Car', carSchema);

// using passport plugin
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            minlength: 3,
            require: true
        },
        password: {
            type: String,
            minlength: 5,
            require: true
        },
        fullname: {
            type: String,
            require: true
        },
        brand: {
            type: String,
            require: true
        },
        profile: {
            type: String
        },
        liked: [
            {make: String, model: String, year: Number, price: Number}
        ]
    }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

//configure passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/get_all_cars", function (req, res) {
    Car.find(function (err, data) {
        if (err) {
            res.send({
                "message": "error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});

// given a URL /register, the user is redirected to the registration page
app.get('/register', (req, res) => {
    if (req.query.error) {
        console.log("REGISTRATION ERROR line 122");
        res.redirect("/register.html?error=" + req.query.error);
    } else {
        res.redirect("/register.html");
    }
});

// when posting on the register page, a new passport user is authenticated based on data entered in
// request body
app.post('/register', (req, res) => {
    const newUser = {
        username: req.body.username,
        fullname: req.body.fullname,
        brand: req.body.brand,
        profile: req.body.profile,
        liked: []
    };
    console.log("pw: ", req.body.password);
    User.register(
        newUser,
        req.body.password,
        function (err, user) {
            if (err) {
                console.log("REGISTRATION ERROR line 161");
                res.redirect("/register?error=" + err);
            } else {
                //write into cookies
                const authenticate = passport.authenticate("local");
                authenticate(req, res, function () {
                    res.redirect("/")
                });
            }
        }
    );
});

app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

// when a login is attempted, the request body username and password are authenticated using passport.js
app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(
        user,
        function (err) {
            //invalid user input for log in
            if (err) {
                console.log(err);
                res.redirect('login?error=Invalid username or password')
            } else {
                const authenticate = passport.authenticate(
                    "local",
                    {
                        successRedirect: "/account",
                        failureRedirect: "/login?error=Username and password don't match"
                    });
                authenticate(req, res);
            }
        }
    )
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get("/account", (req, res) => {
    //A page can be viewed only after login
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/src/account.html");
    } else {
        res.redirect("/login.html?error=You need to login first");
    }
});

app.get('/get_current_user', function (req, res) {
    // check if session id exists
    if (req.isAuthenticated()) {
        //successful user authentication
        console.log("getting user");
        res.send({
            message: "success",
            data: req.user
        });
    } else {
        //failed user authentication
        res.send({
            message: "no login",
            data: {}
        });
    }
});

// when a user likes a car once signed in, it is pushed to the mongo database into the user's liked list
app.post("/like_car", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("authenticated");
        const currentUser = req.body.user;
        const carModel = req.body.infolist[0]
        console.log("iList: ", req.body.infolist);

        const pushCar = {
            make: req.body.infolist[0],
            model: req.body.infolist[1],
            year: parseInt(req.body.infolist[2]),
            price: parseInt(req.body.infolist[3])
        }

        User.updateOne(
            {username: currentUser.username, 'liked.price': {$ne: pushCar.price}},
            {
                $push: {liked: pushCar}
            },
            {},
            (err, info) => {
                if (err) {
                    res.send({
                        message: "database error"
                    });
                } else {
                    res.send({
                        message: "success"
                    });
                }
            }
        )
    } else {
        console.log("not authenticated");
        //navigate to login screen "need to be logged in to like movies!!!"
        res.send({
            message: "login required to like cars",
            data: "/login.html"
        });
    }
});