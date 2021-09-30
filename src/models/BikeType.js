const mongoose = require('mongoose')
const bikeTypeSchema = new mongoose.Schema({
    _id :{
        type : String,
        lowercase : true,
        required : true,
    },

    company:{
        type : String,
        lowercase : true,
        required : true,
        
    },
    model : {
        type : String,
        lowercase : true,
        required : true
    },
    type : {
        type : String,
        required : true,
        lowercase : true
    }




})

const BikeType = mongoose.model('BikeType',bikeTypeSchema)
module.exports = BikeType