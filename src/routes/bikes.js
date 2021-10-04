const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Bikes = require("../models/Bikes");
const BikeType = require("../models/BikeType");
const BikesType = require("../models/BikeType");

// #create bike
router.post("/bike", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  if (updates.length === 0) {
    res.status(400).send({error: "Send_Info_in_Body"});
  }

  const allowedUpdates = [ "company",  "maxspeed",  "price",  "liked",  "comment",  "name",];
  const valid = updates.every((val) => allowedUpdates.includes(val));
  if (!valid) {
    res.status(401).send({
      error: "Extra_Entry_Not_Allowed",
    });
  }
  ///  Validating the bike type
  try {
    const checkBike = await BikesType.find({ name: req.body.name });
    console.log(checkBike);
    if (checkBike.length === 0) {
      res.status(400).send("Bike_Type_Invalid");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }

  // validating bike is already present or not
  try {
    const alreadypresentCheck = await Bikes.find({
      compositekey: req.body.company + req.body.name,
    });
    if (alreadypresentCheck.length !== 0) {
      res.status(403).send({
        error: "Bike_Already_Present",
      });
    } else {
      try {
        const bike = await new Bikes({
          ...req.body,
          compositekey: req.body.company + req.body.name,
          creatorName : req.user.name,
          creatorMail : req.user.email

        });
        await bike.save();
        res.status(201).send({ status: "bike created ", ...req.body });
      } catch (e) {
        // sending reponse when some error occured
        res.status(400).send({ error: e.message });
      }
    }
  } catch (e) {
    res.status(500).send({error :"Internal_Server_Error(DataBase)"})
  }

  //creating the new bike
});

// #edit bike

router.patch("/bike/:id", auth, async (req, res) => {

  try{
    const bike = await Bikes.findById(req.params.id)
    if(!bike)
    {
      res.status(400).send({error : "No_Bike_present_With_this_id"})
    }
    if(bike.creatorMail !== req.user.email)
    { 
      res.status(401).send({ error : "User_Not_Allowed_to_Update"})
    }

  }
  catch(e){
    res.status(400).send({error : e.message})
  }


  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "company",
    "maxspeed",
    "price",
    "liked",
    "comment",
    "name",
  ];

  if (updates.length === 0) {
    res.status(400).send({ error: "Send_Info_in_Body" });
  }

  const isValid = updates.every(update => allowedUpdates.includes(update))
  if(!isValid)
  {
    res.status(404).send({error : "Extra_Entry_Not_Allowed"})
  }

  try {
    const bike = await Bikes.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      status: "Details updated",
      ...req.body,
    });
  } catch (e) {
    if (e.message.includes("Cast to ObjectId failed for value")) {
      res.status(400).send({ error: "Invalid_Bike_Id" });
    }
    res.send({ error: e.message });
  }
});

// #delete bike
router.delete("/bike/:id", auth, async (req, res) => {
  try{
    const bike = await Bikes.findById(req.params.id)
    if(!bike)
    {
      res.send({error : "No bike is present with this id"})
    }
    if(bike.creatorMail !== req.user.email)
    { 
      res.send({ error : "You are not allowed to Delete"})
    }

  }
  catch(e){
    res.status(400).send({error : e.message})
  }


  try {
    const bike = await Bikes.findByIdAndDelete(req.params.id);
    if (!bike) {
      res.send({ error: "no bike is present with this id" });
    }

    res.send({
      status: "bike deleted",
    });
  } catch (e) {
    if (e.message.includes("Cast to ObjectId failed for value")) {
      res.send({ error: "invalid bike Id" });
    }
    res.send({ error: e.message });
  }
});

// #get all bikes
router.get("/bikes", auth, async (req, res) => {
  try {
    const bikes = await Bikes.find();
    res.send(bikes);
  } catch (e) {
    res.send(error, e);
  }
});

// #get bikes by bike types
router.get("/bikes/:biketype", auth, async (req, res) => {
  // validating the bike type
  try {
    const bikeTypte = await BikeType.find({ name: req.params.biketype });
    if (bikeTypte.length === 0) {
      res.status(400).send({error: "Invalid_Bike_Type"  });
    }
  } catch (e) {
    res.status(400).send({ error: e });
  }

  try {
    const bike = await Bikes.find({ name: req.params.biketype });
    res.status(200).send(bike);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// #get most recent regestered bikes
router.get("/bike/recent", auth, async (req, res) => {
    try{

  const latest = await Bikes.find().sort({ createdAt: -1 }).limit(1);
  res.send(latest);
    }
    catch(e)
    {
      res.status(500).send({error : e.message})
    }
});

// #get most liked bikes

router.get("/bike/mostlike", auth, async (req, res) => {
  const bikesList = [];
  try {
    // getting the list of bikes
    const bikeTypeslist = await BikesType.find();
    for (const i of bikeTypeslist) {
      bikesList.push(i.name);
    }

    res.status(200).send(bikesList);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }

  res.send("most liked bikes");
});

// comment handler

router.post("/bike/comment/", auth, (req, res) => [
  res.status(400).send({ error: "Please_Enter_Id" }),
]);

// #comment on bike
router.post("/bike/comment/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["comment"];
  if (updates.length === 0) {
    res.status(400).send({error : "Send_Info_in_Body" })
  }
  const valid = updates.every((val) => allowedUpdate.includes(val));
  if (!valid) {
    res.status(401).send({error : "Extra_Entry_Not_Allowed"})
  }

  try {
    const bike = await Bikes.findById(req.params.id);
    bike.comments = bike.comments.concat({
      _id: req.user.email,
      name: req.user.name,
      comment: req.body.comment,
    });
    await bike.save();
    res.status(200).send(bike);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//  Like a bike

router.get("/bike/like/:bikeid", auth, async (req, res) => {

  try {
    const bike = await Bikes.findById(req.params.bikeid);
    const object = {
      _id: req.user.email,
      name: req.user.name,
      liked: true,
    };

    const isPresent = bike.likes.filter((val) => val._id === req.user.email);
    if (isPresent.length === 0) {
      bike.likes = bike.likes.concat(object);
      await bike.save();
      res.send({ status: "liked" });
    }
    res.status(403).send("Already_Liked");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//dislike bike
router.get("/bike/dislike/:bikeid", auth, async (req, res) => {
  try {
    const bike = await Bikes.findById(req.params.bikeid);
    if (!bike) {
      res.status(400).send("invalid id");
    }

    const object = {
      _id: req.user.email,
      name: req.user.name,
      liked: false,
    };

    const isPresent = bike.likes.filter((val) => val._id === req.user.email);
    if (isPresent.length !== 0) {
      
        const filtered = bike.likes.filter((val) => val._id !== req.user.email)
        res.send(filtered)
      //   bike.likes = bike.likes.concat(object)
      // await bike.save()
      // res.send({status : "liked"})
    }
    res.status(400).send("Noting to unlike");
  } catch (e) {
    res.send({ error: e.message });
  }
});

module.exports = router;
