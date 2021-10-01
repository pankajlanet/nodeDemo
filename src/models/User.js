const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        trim: true,
        validate(value)
        {   
            if(value.length < 8)
            {
                 throw new Error("weak password")   
            }   
        }

    },
    tokens  :[{
        token : {
            type : String,
            required : true
        }
    }] , 
    token :{
        type : String,
        required : true
    }
},{timestamps : true})


userSchema.methods.generateAuthToken  = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'secret key')
    user.tokens = user.tokens.concat({token})
    user.token = token
    await user.save()

    return token
    
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error("user name not matched");
  }
  console.log(password)
  console.log(user.password)
  const isMatch =  bcrypt.compare( password.trim(),user.password);
    // const isMatch = true  
 console.log(isMatch)

  if (!isMatch) {
    throw new Error("password does not match");
  }
  return user;
};
//middle ware for mongoose
userSchema.pre('save', async function (next) {
    const user = this;
    console.log("This middle ware is called")
    user.password = await bcrypt.hash(user.password.trim(), 8)

    next()
}  )
const User = mongoose.model('User' , userSchema)

module.exports = User