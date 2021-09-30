const express = require('express');
const router =  express.Router();
const BikesType = require('../models/BikeType')



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
router.post('/bikes/create_type' ,async(req , res) => {

    //validation
    const check = Object.keys(req.body)
    const allowedUpdates = ["company", "model", "type"]
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
    const newBikeType = await new BikesType({...req.body , _id : req.body.company.toLowerCase() + req.body.model.toLowerCase()})
    await newBikeType.save()
    res.status(201).send({status : "created a new bike type" , ...req.body } )
    }
    catch(e)
    {
        res.send({
            error : e.message
        })
    }
} )

router.get('/bikes/all_type' ,async(req,res)=> {
    const bikeslist = await BikesType.find()
    res.send(bikeslist)
})

//********************************************************************************************** */
                                    // Bikes
//********************************************************************************************** */

// #create bike
router.post('/bike' , (req,res)=> {
    res.send("New bike created") 

})


// #edit bike

router.patch('/bike/:id' , (req,res)=> {
    res.send("updating bike")
})

// #delete bike
router.delete('/bike/:id' ,(req ,res)=> {
    res.send('bike deleted');
})


// #get all bikes
router.get('/bikes' , (req,res)=> {
    res.send('getting all bikes')
})

// #get bikes by bike types
router.get('/bikes/:biketype' ,(req,res) => [
    res.send("bikes by bike types")
] )
    
// #get most recent regestered bikes 
router.get('/bike/recent', (req,res)=> {
    res.send("List of recent bikes")
} )

// #get most liked bikes

    router.get('/bike/mostlike' , (req,res)=> [
        res.send("most liked bikes")
    ])


// #comment on bike
    router.post('/bike/comment' , (req,res) => {
        res.send("comment on bike")
    })






module.exports = router
