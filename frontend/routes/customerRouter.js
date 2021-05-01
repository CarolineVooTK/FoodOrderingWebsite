const express = require("express");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const customerRouter = express.Router();

const myapi = require("./api");

// customerRouter.post("/login", async (req, res) => {
//     // console.log("here")
//     // console.log("cusRouter, req.body = ", req.body)
//     await myapi
//       .customerAuth(req,res)
//       .then((data) => {
//         // console.log("herre")
//         // console.log(data)
//         if (data){
//             res.render("home");
//         }
//         else{
//             res.render("login",{fail:1})
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });

const redirectTodashboard = (req, res, next) => {
    console.log(req.session);
    if(!req.session.passport) {
        next();
    } else {
        res.redirect('/dashboard');
    }
  }
  

// customerRouter.post('/login', passport.authenticate('local', {
// //   successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }),(req, res, next) =>{
//     // console.log("user",req.user);
//     req.flash('success', 'Login Success..');
//     res.redirect('/');
// });

customerRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), function (req, res, next) {
    // console.log("user",req.user);
    req.flash('success', 'Login Success..');
    res.redirect('/');
  });
    
// customerRouter.post('/login', passport.authenticate('local'),(req,res)=>{
//     console.log
// }

    //// passport strategy
// passport.use('local-signin', new LocalStrategy(
//     {passReqToCallback : true}, //allows us to pass back the request to the callback
//     function(req, username, password, done) {
//     myapi.customerAuth(req,res)
//     .then(function (user) {
//         // console.log("user = ",user)
//         if (user) {
//         console.log("LOGGED IN AS: " + user.email);
//         req.session.success = 'You are successfully logged in ' + user.email + '!';
//         done(null, user);
//         }
//         if (!user) {
//         console.log("COULD NOT LOG IN");
//         req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
//         done(null, user);
//         }
//     })
//     .fail(function (err){
//         console.log(err.body);
//     });
//     }
// ));

passport.use('local',new LocalStrategy(function(username,password, done){
    console.log("first here")
    console.log("passport: req = ",username)
    console.log("username = ",username)
    let req= {"username":username, "password":password}
    // req.body.username = username
    // req.body.password = password
    let res = ""
    myapi.customerAuth(req,res)
    .then((data) => {
        console.log("herre")
        // console.log(data)
        if (data){
            return done(null, data);
        }
        else{
            return done(null, false, {
                message: `Invalid Username or password`
            });
        }
        })
        .catch((err) => {
        console.log(err);
        });
  }));


// passport.use(new LocalStrategy(function(req,res, done){
//     console.log("here")
//     // myapi.customerAuth(req,res)
//     return done(null, myapi.customerAuth(req,res));
// }));


passport.serializeUser(function (user, done) {
  // console.log("serialize")
  // console.log("user = ", user)
  done(null, user.data);
});

passport.deserializeUser(function (obj, done){
  // console.log("unserialize")
  done(null, obj);
});

module.exports = customerRouter;