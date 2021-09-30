
require('../src/db/mongoose')
const express = require('express');
const user = require('../src/routes/user')
const bikeType = require('./routes/bikesType')
const bikes = require('../src/routes/bikes')
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(user);
app.use(bikeType)
app.use(bikes)

app.get('/' ,(req,res)=> {
    res.send("Regester Bike API")
})


app.listen(port,()=> {
    console.log("Server is hosted on port : " , port)
}  )

