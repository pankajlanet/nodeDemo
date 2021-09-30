const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema( { 
    name : {
        type : String,
        required : true,
        trim : true,
        lowercase:true
    },
    email : {
        type :String,
        required : true,
        lowercase: true,
        trim:true,
        unique : true,
        validate (value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("invalid email")
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value)
        {   
            if(value.length < 8)
            {
                 throw new Error("weak password")   
            }   
        }

    }
})

const User = mongoose.model('User' , userSchema)

module.exports = User