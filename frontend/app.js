// Express
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
// const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


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
// app.use(logger('dev'));
app.use(cookieParser());
app.use(flash());
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());



app.use(function(req, res, next) {
  // console.log("app.js, app.use, flash")
  res.locals.success = req.flash('success');
  if (req.session.passport){
    res.locals.customer_name = req.session.passport.user.givenName
  }
  // console.log("res local cus = ", req.session.passport)
  res.locals.customer_id = req.session
  // console.log("res.locals= ",res.locals)
  res.locals.error = req.flash('error');
  next();
})



// Routes
const vendorRouter = require("./routes/vendorRouter");
app.use("/vendors", vendorRouter);
const menuRouter = require("./routes/menuRouter");
app.use("/menu", menuRouter);
const customerRouter = require("./routes/customerRouter");
app.use("/customer", customerRouter);

// app.get("/login", (req, res,next) => {
//   console.log(req.session.passport)
//   res.render("login");
// });

app.get("/", (req, res,next) => {
  res.render("home");
});

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
