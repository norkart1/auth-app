const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../database/models/User");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.send("⚠️ Username already taken!");

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("❌ Error signing up!");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.send("❌ User not found!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Incorrect password!");

    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send("❌ Error logging in!");
  }
});

router.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
