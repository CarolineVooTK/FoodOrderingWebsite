// Express
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");

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
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const vendorRouter = require("./routes/vendorRouter");
app.use("/vendors", vendorRouter);
const menuRouter = require("./routes/menuRouter");
app.use("/menu", menuRouter);
const customerRouter = require("./routes/customerRouter");
app.use("/customer", customerRouter);

app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

app.get("/login", (req, res) => {
  res.render("login");
});

// app.post('/login', passport.authenticate('local-signin', {
//   successRedirect: '/',
//   failureRedirect: '/login'
//   })
// );

app.get("*", (req, res) => {
  res.render("home");
});



// passport strategy
// passport.use('local-signin', new LocalStrategy(
//   {passReqToCallback : true}, //allows us to pass back the request to the callback
//   function(req, username, password, done) {
//     routes.localAuth(username, password)
//     .then(function (user) {
//       if (user) {
//         console.log("LOGGED IN AS: " + user.username);
//         req.session.success = 'You are successfully logged in ' + user.username + '!';
//         done(null, user);
//       }
//       if (!user) {
//         console.log("COULD NOT LOG IN");
//         req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
//         done(null, user);
//       }
//     })
//     .fail(function (err){
//       console.log(err.body);
//     });
//   }
// ));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The Snacks in a Van client is listening on port ${port}!`);
});
