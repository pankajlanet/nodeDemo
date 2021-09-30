
require('../src/db/mongoose')
const express = require('express');
const user = require('../src/routes/user')
const bike = require('../src/routes/bikes')
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(user);
app.use(bike)


app.get('/' ,(req,res)=> {
    res.send("Regester Bike API")
})


app.listen(port,()=> {
    console.log("Server is hosted on port : " , port)
}  )

