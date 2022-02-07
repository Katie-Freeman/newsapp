const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const checkAuthorization = require("./middlewear/checkAuthorization");

const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

const PORT = process.env.PORT || 8080;
const connection_string =
  "postgres://zggfflrgbldoyz:448622141daf8564ba525031234f9d0cbf6ba0d279b6fb053b2903734f8d6e4c@ec2-44-196-250-191.compute-1.amazonaws.com:5432/dcpgvj8k96u11h?ssl=true";

const VIEWS_PATH = path.join(__dirname, "/views");

app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");
app.use("/css", express.static("css"));

app.use(
  session({
    secret: "lskdgjgl",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.authenticated = req.session.user == null ? false : true;
  next();
});

db = pgp(connection_string);

app.use("/users", checkAuthorization, userRoutes);
app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});
