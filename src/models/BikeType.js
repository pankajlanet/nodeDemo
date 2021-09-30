const mongoose = require('mongoose')
const bikeTypeSchema = new mongoose.Schema({
 // remove model
    name : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    }
})

const BikeType = mongoose.model('BikeType',bikeTypeSchema)
module.exports = BikeType