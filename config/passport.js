const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
let ObjectId = require("mongoose").Types.ObjectId;

// our  model
const { customer } = require("../data/models/customerModel");
const { vendors } = require("../data/models/Vendor");
const { menuitems } = require("../data/models/MenuItem");
const { menuItemsSchema } = require("../data/models/Vendor");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (_id, done) {
    done(null, _id);
  });

  // ths passport strategy for customer login
  passport.use(
    "local-customer-login",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          // see if the user with the email exists
          customer.findOne({ email: req.body.username }, function (err, user) {
            if (err) {
              console.log("err");
              return done(err);
            }
            if (!user) {
              console.log("no user");
              return done(null, false, req.flash("loginMessage", "No user found."));
            }

            //check if the password is valid
            if (!user.validPassword(req.body.password)) {
              return done(null, false, req.flash("loginMessage", "Oops! Wrong password."));
            }

            // this is a valid email and valid password
            else {
              req.session.email = req.body.username;
              req.session.type_of_user = "customer";

              return done(null, user, req.flash("loginMessage", "Login successful"));
            }
          });
        });
      }
    )
  );

  // for signup
  passport.use(
    "local-customer-signup",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          // to see if there are one already exist, email have to be unique
          customer.findOne({ email: req.body.username }, function (err, existingUser) {
            if (err) {
              return done(err);
            }
            if (existingUser) {
              return done(null, false, req.flash("signupMessage", "That email is already taken."));
            } else {
              var newUser = new customer();
              newUser.email = req.body.username;
              newUser.password = newUser.generateHash(req.body.password);
              newUser.familyName = req.body.familyName;
              newUser.givenName = req.body.givenName;
              // and save the user
              newUser.save(function (err) {
                if (err) throw err;

                return done(null, newUser);
              });
              req.session.email = req.body.username;
              req.session.type_of_user = "customer";
            }
          });
        });
      }
    )
  );
  // ths passport strategy for vendor login
  passport.use(
    "local-vendor-login",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        console.log(req.body);
        process.nextTick(function () {
          // see if the user with the email exists
          vendors.findOne({ name: req.body.username }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, req.flash("loginMessage", "Invalid username or password"));
            }

            //check if the password is valid
            // if(user.password != req.body.password){
            if (!user.validPassword(req.body.password)) {
              // checks if password entered is in plain text and matches hashed user password
              var testStringPassword = new vendors();
              if (!testStringPassword.generateHash(req.body.password == user.password)) {
                return done(
                  null,
                  false,
                  req.flash("loginMessage", "Invalid username or password.")
                );
              }
            }

            // this is a valid email and valid password
            req.session.name = req.body.username;
            req.session.type_of_user = "vendor";
            return done(null, user, req.flash("loginMessage", "Login successful"));
          });
        });
      }
    )
  );

  // for vendor signup
  passport.use(
    "local-vendor-signup",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          // to see if there are one already exist, email have to be unique
          vendors.findOne({ email: req.body.username }, async function (err, existingUser) {
            if (err) {
              return done(err);
            }
            if (existingUser) {
              return done(null, false, req.flash("signupMessage", "That email is already taken."));
            } else {
              // a new user, therefore create a new Vendor in database
              var newUser = new vendors();
              newUser.email = req.body.username;
              newUser.password = newUser.generateHash(req.body.password);
              newUser.name = req.body.vanName;
              newUser.active = false;
              newUser.menu = [];
              await menuitems.find({}, function (err, menus) {
                menus.forEach(function (menu) {
                  var newMenuItem = new menuItemsSchema();
                  newMenuItem.menuitem = new ObjectId(`${menu._id}`);
                  newMenuItem.quantity = 0;
                  newUser.menu.push(newMenuItem);
                });
              });
              console.log("newUser.menu = ", newUser.menu);
              // and save the user
              newUser.save(function (err) {
                if (err) throw err;

                return done(null, newUser);
              });
              req.session.name = req.body.vanName;
              req.session.type_of_user = "vendor";
            }
          });
        });
      }
    )
  );
};
