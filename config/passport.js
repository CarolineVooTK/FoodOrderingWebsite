
// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

// our user model
const { customer } = require('../customer/models/customerModel');

module.exports = function(passport) {

    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        customer.findById(_id, function(err, user) {
            done(err, user);
        });
    });


    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('local-customer-login', new LocalStrategy({
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, email, password, done) {
            
            // you can read more about the nextTick() function here: 
            // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
            // we are using it because without it the User.findOne does not work,
            // so it's part of the 'syntax'
            process.nextTick(function() {
                // see if the user with the email exists
                customer.findOne({ 'email' :  req.body.username }, function(err, user) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    console.log("user: "+user);
                    if (err){
                        console.log("err")
                        return done(err);
                    }
                    if (!user){
                        console.log("no user")
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }

                    // if (!user.validPassword(req.body.password)){\\
                    if (user.password!= req.body.password){
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        console.log("wrong pass")
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the user's email in the session
                    else {
                        console.log("else")
                        req.session.email = email; 
                        req.session.type_of_user = "Customer"; 

                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));



    // for signup
    passport.use('local-customer-signup', new LocalStrategy({
            passReqToCallback : true }, // pass the req as the first arg to the callback for verification 
            
         function(req, email, password, done) {             
            process.nextTick( function() {
                customer.findOne({'email': req.body.username}, function(err, existingUser) {
                    // search a user by the username (email in our case)
                    // if user is not found or exists, exit with false indicating
                    // authentication failure
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingUser) {
                        console.log("existing");
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        // otherwise
                        // create a new user
                        var newUser = new customer();
                        newUser.email = req.body.username;
                        newUser.password = req.body.password;
                        newUser.familyName = req.body.familyName;
                        newUser.givenName = req.body.givenName;

                        // and save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });

                        // put the user's email in the session so that it can now be used for all
                        // communications between the client (browser) and the FoodBuddy app
                        req.session.email=email;
                        req.session.type_of_user = "Customer"
                    }
                });
            });
        }));

    

//     //Create a passport middleware to handle User login
//     passport.use('login', new LocalStrategy({
//         usernameField : 'email',
//         passwordField : 'password'
//     }, async (email, password, done) => {
//         try {
//             //Find the user associated with the email provided by the user
//             User.findOne({ 'email' :  email }, function(err, user) {

//                 if (err)
//                     return done(err);
//                 if (!user)
//                     return done(null, false, {message: 'No user found.'});

//                 if (!user.validPassword(password))
//                     return done(null, false, {message: 'Oops! Wrong password.'});


//                 else {
//                     return done(null, user, {message: 'Login successful'});
//                 }
//             });
//         } catch (error) {
//             return done(error);
//         }
//     }));


};



