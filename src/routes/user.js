const express = require("express");
const User = require("../models/User");
const router = express.Router();
const auth  = require('../middleware/auth')


// Create User
router.post("/user", async (req, res) => {
    // validating user
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , "email" , "password"]    
    if(updates.length === 0)
    {
        res.status(400).send({
            error : "Send_Info_in_Body"
        })
    }

    const valid =  updates.every(val =>  allowedUpdates.includes(val))
    if(!valid)
    {
        res.status(401).send({
            error : "Extra_Entry_Not_Allowed"
        })
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
      //resource cannot be created becouse it is already present
      res.status(403).send({error : "Email_Already_Exist"})
    }
    else if('User validation failed: password: weak password')
    {
      res.send({error : "Weak_Password"})
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
    res.status(400).send({error : "Send_Info_in_Body"})
  }
  const isValid = updates.every(val => allowedUpdates.includes(val)) 
  if(!isValid)
  {
    res.status(401).send({error : "Extra_Entry_Not_Allowed"})
  }

  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
} catch (e) {
    res.status(400).send({error : e.message})
}

});

//User Logout

router.get( '/user/logout', auth  , async(req,res)=> {

  // try {
  //   req.user.tokens = req.user.tokens.filter((token) => {
  //     return token.token !== req.token
  //   })
  //   await req.user.save()

  //   res.send({status : "User Logged Out"})
  // } catch (e) {
  //   res.status(500).send({ error: e.message })
  // }

   try {
    req.user.tokens = []
    await req.user.save()

    res.status(200).send({status : "User_LoggedOut_Sucessfully"})
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
  

})

module.exports = router;
