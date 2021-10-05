const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
    }
},{timestamps : true})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.compositekey
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v
    delete userObject.creatorMail
    return userObject
}


userSchema.methods.generateAuthToken  = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'secret key')
    user.tokens = user.tokens.concat({token})
    // user.token = token
    await user.save()

    return token
    
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error("InvalidUser : user");
  } 

//   const isMatch  = (password === user.password)? true :false;

  const isMatch = await bcrypt.compare(password , user.password);
    //  const isMatch = true  
 console.log( "value of isMatch is : ",  isMatch)

  if (!isMatch) {
    throw new Error("InvalidUser : password");
  }
  return user;
};
//middle ware for mongoose
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
}  )
const User = mongoose.model('User' , userSchema);

module.exports = User