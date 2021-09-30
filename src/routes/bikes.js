const express = require('express');
const router =  express.Router();

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

// #get all bike types
router.post('/bikes/create_type' ,(req , res) => {
    res.send("created bike type")
} )

router.get('/bikes/all_type' ,(req,res)=> {
        res.send("All the bikes")
})

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
