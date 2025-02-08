require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("./database/connection");
const authRoutes = require("./routes/auth");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
