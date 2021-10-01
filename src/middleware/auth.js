const jwt = require('jsonwebtoken')
const User = require('../models/User')


const auth = async(req,res,next)=> {

    try{
    const token =  req.header('Authorization').replace('Bearer ', '')
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTU2ZGMyZjFhNWI3MTVjMTYxOTYwMzAiLCJpYXQiOjE2MzMwODI0MTV9.DtEVwiozYEDt_tpciAvhqjhaFlrikuI0AZEFemxv1O0'
    console.log(token)
    const decode  = jwt.verify(token, 'secret key');
    const user = await User.find({_id : decode._id , 'tokens.token' : token })
    console.log(user)
    if(!user)
    {
        throw new Error();
    }
        req.user = user;
        next()
}
    catch(e)
    {
        res.send({error : "Please authenticate" , message  : e.message })
    }
}


module.exports = auth