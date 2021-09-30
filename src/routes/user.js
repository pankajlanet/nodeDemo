const express = require("express");
const User = require("../models/User");
const router = express.Router();


// Create User
router.post("/user", async (req, res) => {
    // validating user
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , "email" , "password"]    
    if(!req.body)
    {
        res.status(400).send({
            error : "Please send the info in the body"
        })
    }

    const valid =  updates.every(val =>  allowedUpdates.includes(val))
    if(!valid)
    {
        res.status(401).send({
            error : "extra updates are not allowed"
        })
    }




  console.log(req.body);
  if (!req.body) {
    res.status(400).send({
      error: "please send the info in body",
    });
  }

  try {
    const user = await new User(req.body);
    await user.save();
    res.status(201).send(req.body);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});


// User Login
router.post("/user/login", (req, res) => {
  res.send("user logged in");
});

module.exports = router;
