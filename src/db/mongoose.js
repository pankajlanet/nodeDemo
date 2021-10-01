const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/bike-register-api' ).then( ()=> {
    console.log("Connection established")
}).catch((e) => {
    console.log("some error occured in db" ,e);
})
