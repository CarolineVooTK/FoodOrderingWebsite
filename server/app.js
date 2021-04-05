const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();

const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "../client/views"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/menu", (req, res) => {
  res.render("menu");
});
app.get("/food/:id", (req, res) => {
  res.render("showFood", { id: req.params.id });
});

// will need to do something like this
// const customerRouter = require("./data/customer/routes/customer-router");
// app.use("/customer", customerRouter)
// and same for the vendor routes
// and then make routes off /customer.. and /vendor..

app.get("*", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`The Snacks in a Van app is listening on port ${port}!`);
});
