const { Router } = require("express");
const User = require("../models/user");
const router = Router();

//  GET ROUTES

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/signin", (req, res) => {
    return res.render("signin");
});

//POST ROUTES

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await User.matchPassword(email, password);
      return res.cookie("token", token).redirect("/");

    } catch (error) {
      return res.render("signin", {
        error: "Incorrect Email or Password",
      });
    }
  });

router.post("/signup", async (req, res) => {
  //for making a user, get data from frontend
  const { name, email, password } = req.body;

  await User.create({
    name,
    email,
    password,
  });

  return res.redirect("/");
});

//to logout, clear cookies of user 
router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
  });

module.exports = router;
