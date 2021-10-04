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
  likes:{
    type : Array
  },
  name : {
      type : String,
      required:true,
      lowercase : true,
      trim : true
  },
  comments: {
    type : Array,
  },

  compositekey : {
    type : String,
    lowercase : true,
    trim : true
  }
}, {timestamps :true});

const Bike = mongoose.model("Bike", bikeSchema);
module.exports = Bike;
