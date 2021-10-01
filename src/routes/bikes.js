const express  =require('express')
const router = express.Router()
const Bikes = require('../models/Bikes')
const BikesType = require('../models/BikeType')


// #create bike
router.post("/bike", async (req, res) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    res.status(400).send({
      error: "Please enter dome details in body",
    });
  }

  const allowedUpdates = ["company","maxspeed","price","liked","comment",  "name"];
  const valid = updates.every((val) => allowedUpdates.includes(val));
  if (!valid) {
    res.status(400).send({
      error: "extra updates are not allowed",
    });
  }
  ///  Validating the bike type
  try {
    const checkBike = await BikesType.find({ name: req.body.name });
    console.log(checkBike);
    if (checkBike.length === 0) {
      res.send("bike with certain model is not present");
    }
  } catch (e) {
    res.send({ error: e.message });
  }

  // validating bike is already present or not
  try {
    const alreadypresentCheck = await Bikes.find({
      compositekey: req.body.company + req.body.name,
    });
    if (alreadypresentCheck.length !== 0) {
      res.send({
        error: "This bike is already present",
      });
    }
  } catch (e) {}

  //creating the new bike
  try {
    const bike = await new Bikes({
      ...req.body,
      compositekey: req.body.company + req.body.name,
    });
    await bike.save();
    res.status(201).send({ status: "bike created ", ...req.body });
  } catch (e) {
    // sending reponse when some error occured
    res.status(400).send({ error: e.message });
  }
});


// #edit bike

router.patch('/bike/:id' , (req,res)=> {
    res.send("updating bike")
})

// #delete bike
router.delete('/bike/:id' ,(req ,res)=> {
    res.send('bike deleted');
})


// #get all bikes
router.get('/bikes' ,async(req,res)=> {
   try{
        const bikes = await Bikes.find();
        res.send(bikes)
   }catch(e){
       res.send("error" , e)
   }
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


// comment handler

    router.post('/bike/comment/' , (req,res) => [
        res.send({error :"Please enter the id in paramas" })
    ])

// #comment on bike
    router.post('/bike/comment/:id' , async(req,res) => {
        const updates = Object.keys(req.body)
        const allowedUpdate = ['comment']
        if(updates.length === 0)
        {
            res.send({error : "Please send the comment in body"})
        }    
        const valid = updates.every(val => allowedUpdate.includes(val))
        if(!valid)
        {
            res.send({
                error : "extra updates are not allowed"
            })
        }

        try{
            const bike = await Bikes.findByIdAndUpdate(req.params.id , req.body)
            
            res.send({...req.body , status : "comment updated for the bike"})

        }catch(e){
            res.status(400).send({error : e.message})
        }
       
    })



    module.exports = router