// Express
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
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

// Routes
const vendorRouter = require("./routes/vendorRouter");
app.use("/vendors", vendorRouter);
const menuRouter = require("./routes/menuRouter");
app.use("/menu", menuRouter);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("*", (req, res) => {
  res.render("home");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The Snacks in a Van client is listening on port ${port}!`);
});
