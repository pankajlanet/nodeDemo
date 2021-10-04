const express = require('express');
const router =  express.Router();
const BikesType = require('../models/BikeType')
const auth = require('../middleware/auth')



// #create bike types
        // #create bike types
//       #get all bike types
//       #create bike
//       #edit bike
//       #delete bike
//       #get all bikes
//       #get bikes by bike types
//       #get most recent regestered bikes 
//       #get most liked bikes

//       #comment on bike


//********************************************************************************************** */
                                    // Bikes Type
//********************************************************************************************** */
// #get all bike types
router.post('/bikes/create_type' , auth, async(req , res) => {

    //validation
    const check = Object.keys(req.body)
    const allowedUpdates = ["name"]
    if(check.length === 0)
    {
        res.status(400).send({error : "Please enter the information in body"})
    }   
    const validCheckArr =  check.every(val => allowedUpdates.includes(val))
    if(!validCheckArr)
    {
        res.status(403).send({ err: "extra updates are not allowed"})
    }



    // saving bike information in db
    try{
    const newBikeType = await new BikesType(req.body)
    await newBikeType.save()
    res.status(201).send({status : "created a new bike type" , ...req.body } )
    }
    catch(e)
    {
        if(e.message.includes('E11000 duplicate key error collection: bike-register-api.biketypes index: name_1 dup key: '))
        {
            res.send({error : "This model is already present"})
        }

        res.send({
            error : e.message
        })
    }
} )

router.get('/bikes/all_type' ,auth,async(req,res)=> {
    try{
    const bikeslist = await BikesType.find()
    res.send(bikeslist)
    }
    catch(e)
    {
        res.send({error : e})
    }
})






module.exports = router
