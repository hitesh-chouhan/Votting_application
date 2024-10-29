const express=require('express');
const app=express();
require('dotenv').config();
const db = require('./db');
const bodyParser=require('body-parser');
app.use(bodyParser.json());//req.body;

 
//import route file
const userRoutes=require('./Routes/userRoutes');
const candidateRoutes=require('./Routes/candidateRoutes');

//use route files
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


//running server
const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log('listening on port')
})