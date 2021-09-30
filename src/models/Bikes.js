const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  company: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  maxspeed: {
    type: Number,
  },
  price: {
    type: Number,
  },
  liked: {
    type: Boolean,
    lowercase: true,
    lowercase: true,
    trim: true
  },
  comment: {
    type: Boolean,
    lowercase: true,
    trim: true,
  },
}, {timestamps :true});

const Bike = mongoose.model("Bike", bikeSchema);
module.exports = Bike;
