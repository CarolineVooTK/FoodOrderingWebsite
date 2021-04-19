// MongoDB
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

// Express
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();

app.set("views", path.join(__dirname, "./views"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// const customerRouter = require("./customer/routes/customer-router");
// app.use("/customers", customerRouter);
const vendorRouter = require("./vendor/routes/vendor-router");
app.use("/vendors", vendorRouter);
// const menuRouter = require("./menu/routes/menu-router");
// app.use("/menu", menuRouter);
const orderRouter = require("./order/routes/order-router");
app.use("/orders", orderRouter);

app.get("*", (req, res) => {
  res.render("home");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`The Snacks in a Van server is listening on port ${port}!`);
});
