// MongoDB connection
const mongoose = require("mongoose");
mongoose.set("debug", true);

let CONNECTION_URI =
  "mongodb+srv://admin:g_3_pass@cluster0.nvrgb.mongodb.net/snacks?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // for uniqueness constraints on fields
    useFindAndModify: false,
    dbName: "snacks",
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));



// require packages
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");



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
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);

// initialize the passport and session
app.use(passport.initialize());
app.use(passport.session());



// this middleware is used for the locals variable 
// for render in the page
app.use(function (req, res, next) {

  // if someone is authenticated
  if (req.session.passport) {
    // req.session.type_of_user can be in three states, which is{ undefined , "customer", "vendor"}
    if (req.session.type_of_user){
      res.locals.type_of_user = req.session.type_of_user;
      // we make the res.locals.customer_id to be the customer_id(passport.user)
      if (req.session.type_of_user == "customer"){
        res.locals.customer_id = req.session.passport.user;
      }
      else{
        // we make the res.locals.vendor_id to be the vendor_id(passport.user)
        res.locals.vendor_id = req.session.passport.user;
      }
    }
  }
  if(req.session.orderlist){
    console.log("app.use: req.session.orderlist = ",req.session.orderlist)
  }
  res.locals.error = req.flash("error");
  next();
});


// Routes
const vendorRouter = require("./vendor/routes/vendor-router");
app.use("/vendors", vendorRouter);
const menuRouter = require("./menu/routes/menu-router");
app.use("/menu", menuRouter);
const orderRouter = require("./order/routes/order-router");
app.use("/orders", orderRouter);
const customerRouter = require("./customer/routes/customer-router");
app.use("/customer", customerRouter);

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// port 
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`The Snacks in a Van App is listening on port ${port}!`);
});
