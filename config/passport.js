const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

// our  model
const { customer } = require('../customer/models/customerModel');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        done(null,_id)
    });


    // ths passport strategy for customer login
    passport.use('local-customer-login', new LocalStrategy({
            passReqToCallback : true}, 
        function(req, email, password, done) {
            process.nextTick(function() {
                // see if the user with the email exists
                customer.findOne({ 'email' :  req.body.username }, function(err, user) {
                    if (err){   
                        console.log("err")
                        return done(err);
                    }
                    if (!user){
                        console.log("no user")
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }

                    //check if the password is valid
                    if (!user.validPassword(req.body.password)){
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }

                    // this is a valid email and valid password
                    else {
                        req.session.email = email; 
                        req.session.type_of_user = "Customer"; 

                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));



    // for signup
    passport.use('local-customer-signup', new LocalStrategy({
            passReqToCallback : true },     
         function(req, email, password, done) {             
            process.nextTick( function() {
                // to see if there are one already exist, email have to be unique
                customer.findOne({'email': req.body.username}, function(err, existingUser) {
                    if (err) {
                        return done(err);
                    }
                    if (existingUser) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        // a new user, therefore create a new Customer in database
                        var newUser = new customer();
                        newUser.email = req.body.username;
                        newUser.password = newUser.generateHash(req.body.password);
                        newUser.familyName = req.body.familyName;
                        newUser.givenName = req.body.givenName;

                        // and save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                        req.session.email=email;
                        req.session.type_of_user = "Customer"
                    }
                });
            });
        }));
};



