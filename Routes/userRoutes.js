const express=require('express');
const router=express.Router();
const user=require('./../models/user');
const { jwtAuthMiddleware,generateToken } = require('../auth/jwt');

//singup router.............................................
router.post ('/signup',async(req,res)=>{
    try{
    const data=req.body //assuming request body contains the user data

    //create new user usind mongoose:
    const newUser=new user(data);

    //save the new user to the database;
    const response = await newUser.save();
    await console.log('Data saved');

    const payload={
        id:response.id,
    }
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : ",token);
    res.status(200).json({response:response,toke:token});
}
catch(err){
    console.log("Signup error",err);
    res.status(500).json({error:'Internal/signup server errror'});
}
});
//..........................................................................

//login router..............................................................

router.post('/login',jwtAuthMiddleware,async(req,res)=>{
    try{
    //extract adharCardNumber from reuest body
    const{adharCardNUmber,password}=req.body;
    //find the user by adharCardNumber
    const user = await user.finOne({adharCardNUmber:adharCardNUmber})
    if(!user || !(await user.comparePassword(password) ))
        {
          console.log('Invalid username or password');
          return res.status(401).json({error:'Invalid username or password'});
        }
    const payload={
        id:user.id
    }
    // generateToken
    const token=generateToken(payload);
    //return token as response
    res.json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal/login server errror'});
    }
});
//...............................................................................

//profile route
router.get('/profile',async(req,res)=>{
    try{
    const userData = req.user;
    const userId=userData.id;
    const user=user.findById(userId);
    res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal/login server errror'});
    }
});

//to updation
router.put('/profile/password',async(req,res)=>{
    try{
        const userId=req.user;//extract the id from token;
        const{currentPassword,newPassword} = req.body;//extract the current and new password grom the req.body;
        
        //find the user by UserID
        const user = await user.findById(userId);
        //check the password if password doesn't match;

        if(!(await user.comparePassword(currentPassword)))
            {
              console.log('password');
              return res.status(401).json({error:'Invalid username or password'});
            }
             user.password = newPassword;
             await user.save();

        console.log('data updated');
        res.status(200).json({message:"password updated"});
    }
    catch(err){
              console.log(err);
              res.status(500).json({error:'internal server error'});
    }
  })
module.exports=router;
