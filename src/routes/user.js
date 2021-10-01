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
    const token = await user.generateAuthToken()
    console.log(token)
    await user.save();
    res.status(201).send({...req.body , token});
  } catch (e) {
    if(e.message.includes('E11000 duplicate key error collection: bike-register-api.users index: email_1 dup key:'))
    {
      res.send({error : "Email id already exist"})
    }

    res.status(400).send({ error: e.message });
  }
});


// User Login
router.post("/user/login", async(req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['email', 'password']

  if(updates.length === 0)
  {
    res.send({error : "Please send the information in body"})
  }
  const isValid = updates.every(val => allowedUpdates.includes(val)) 
  if(!isValid)
  {
    res.send({error : "extra values are not allowed"})
  }

  try{
  const user = await User.findByCredentials(req.body.email , req.body.password)
  res.send(user)
  }
  catch(e)
  {
    res.send({error : e.message})
  }

});

module.exports = router;
