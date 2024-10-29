const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    age : {
        type: Number,
        require: true,
    },
     email: {
        type:String,
     }, 
     Mobile: {
        type:String,
        require:true
     },
     address: {
        type: String,
        require:true
     },
     adharCardNumber: {
        type: Number,
        require:true
     },
     password: {
        type: String,
        require: true
     },
     role: {
        type:String,
        enum:['voter','admin'],
        default:'voter'
     },
     isVoted:{
        type:Boolean,
        default:false
     }
});
UserSchema.pre('save', async function(next){
   const person=this;
   //Hash the password only if it has been modified(or is new)
   if(!person.isModified('password')) return next();
   try{
       const salt=await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(person.password,salt);
       person.password=hashedPassword;
       next();
   }catch(err){
       return next(err);
   }
})

UserSchema.methods.comparePassword=async function(candidatePassword){
   try{
       const isMatch =await bcrypt.compare(candidatePassword,this.password);
       return isMatch;
   }catch(err){
       throw err;
   }
} 

const User=mongoose.model('User',UserSchema);
module.exports=User;