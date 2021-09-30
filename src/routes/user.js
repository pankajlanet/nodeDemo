const express = require('express');
const User = require('../models/User')

const router = express.Router()


router.post('/user' ,async(req,res)=> {

    console.log(req.body)
    if(!req.body)
    {
        res.status(400).send({
            error : "please send the info in body"
        })
    }

    try{
        const user = await new User(req.body)
        await user.save()
         res.send("user created")
    }catch(e)
    {
        res.status(400).send({error : e.message})
    }
    
})

 router.post('/user/login' , (req,res)=> {
     // user login
     res.send("user logged in")
 })   

module.exports = router;