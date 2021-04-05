const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
var path = require("path");

const port = 3000;

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/menu", (req, res) => {
  res.render("menu");
});
app.get("/food/:id", (req, res) => {
  res.render("showFood", { id: req.params.id });
});

app.get("*", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log("The Snacks in a Van app is listening on port 3000!");
});
