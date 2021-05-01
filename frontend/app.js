// Express
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const LocalStrategy = require('passport-local').Strategy;
const myapi = require("./routes/api.js");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

app.set("views", path.join(__dirname, "./views"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
    helpers: require(__dirname + "/public/js/helpers.js").helpers,
  })
);

app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(flash());
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport.use('local-signin', new LocalStrategy(
//   {passReqToCallback : true}, //allows us to pass back the request to the callback
//   function(req, username, password, done) {
//   myapi.customerAuth(req,res)
//   .then(function (user) {
//       console.log("user = ",user)
//       if (user) {
//       console.log("LOGGED IN AS: " + user.email);
//       req.session.success = 'You are successfully logged in ' + user.email + '!';
//       done(null, user);
//       }
//       if (!user) {
//       console.log("COULD NOT LOG IN");
//       req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
//       done(null, user);
//       }
//   })
//   .fail(function (err){
//       console.log(err.body);
//   });
//   }
// ));



app.use(function(req, res, next) {
  // console.log("app.js, app.use, flash")
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// app.use(function(req, res, next){
//   var err = req.session.error,
//       msg = req.session.notice,
//       success = req.session.success;

//   delete req.session.error;
//   delete req.session.success;
//   delete req.session.notice;

//   if (err) res.locals.error = err;
//   if (msg) res.locals.notice = msg;
//   if (success) res.locals.success = success;

//   next();
// });

// passport.use('local-signin', new LocalStrategy(
//   {passReqToCallback : true}, //allows us to pass back the request to the callback
//   function(req, username, password, done) {
//   myapi.customerAuth(req,res)
//   .then(function (user) {
//       console.log("user = ",user)
//       if (user) {
//       console.log("LOGGED IN AS: " + user.email);
//       req.session.success = 'You are successfully logged in ' + user.email + '!';
//       done(null, user);
//       }
//       if (!user) {
//       console.log("COULD NOT LOG IN");
//       req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
//       done(null, user);
//       }
//   })
//   .fail(function (err){
//       console.log(err.body);
//   });
//   }
// ));
// Routes
const vendorRouter = require("./routes/vendorRouter");
app.use("/vendors", vendorRouter);
const menuRouter = require("./routes/menuRouter");
app.use("/menu", menuRouter);
const customerRouter = require("./routes/customerRouter");
app.use("/customer", customerRouter);

app.get("/login", (req, res,next) => {
  res.render("login");
});

app.get("/", (req, res,next) => {
  res.render("home");
});

// app.get("*", (req, res, next) => {
//   res.render("home");
// });

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null
  if(res.locals.user) {
    // console.log(res.locals.user);
  }
  next();
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The Snacks in a Van client is listening on port ${port}!`);
});
