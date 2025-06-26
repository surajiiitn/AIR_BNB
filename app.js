const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const port = 8080;
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires : Date.now() + 1000 * 24 * 7 * 60 * 60,
    maxAge : 1000 * 24 * 7 * 60 * 60,
    httpOnly : true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not Found !"));
});

//Middle ware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs",{ err });

});

app.listen(port, () => {
  console.log("server is listening to port 8080");
});