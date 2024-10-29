const express=require('express');
const router=express.Router();
const User=require('../models/user');
const { jwtAuthMiddleware,generateToken } = require('../auth/jwt');
const Candidate = require('../models/candidate');


const checkAdminRole=async(userId)=>{
    try{
        const user = await User.findById(userId);
        if(user.role === 'admin'){
            return true;
        }
    }
    catch(err){
        return false;
    }
}
//post router.............................................
router.post ('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message:'user does not have admin role'});
        }
    const data=req.body //assuming request body contains the candidate data
    //create new user using mongoose:
    const newCandidate=new Candidate(data);

    //save the new user to the database;
    const response = await newCandidate.save();
     console.log('Data saved');
 
    res.status(200).json({response:response});
}
catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
}
})
//..........................................................................
 
//...............................................................................

 

//to updation
router.put('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user does not have admin role'});
        }
        const candidateId=req.params.candidateId;//extract the id from url parameters;
        const updatedcandidatedata=req.body;
        const response = await candidate.findByIdAndUpdate(candidateId,updatedcandidatedata,{
          new :true,//returns the update documents;
          runValidators:true,//run mongose validation
        })

        if(!response){
          res.status(403).json({error:'candidate not found'});
        }
        console.log('candidate data updated');
        res.status(200).json(response);
    }
    catch(err){
              console.log(err);
              res.status(500).json({error:'internal server error'});
    }
  })
//to delete

router.delete('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user does not have admin role'});
        }
        const candidateId=req.params.candidateId;//extract the id from url parameters;
       
        const response = await candidate.findByIdAndDelete(candidateId)
        if(!response){
          res.status(403).json({error:'candidate not found'});
        }
        console.log('candidate deleted');
        res.status(200).json(response);
    }
    catch(err){
              console.log(err);
              res.status(500).json({error:'internal server error'});
    }
  })

//lets start voting ........................

//no admin can vote 
//user can only vote for once .

router.post('/vote/:candidateID',jwtAuthMiddleware,async (req,res)=>{
     candidateID=req.params.candidateID;
     userId=req.user.id;
    try{
        //find the candidate document with specified candidateId
        const candidate=await Candidate.findById(candidateID);
    if(!candidate){
        res.status(404).json({message:"candidate not found"})
    }

    const user= await User.findById(userId);
    if(!user){
        res.status(404).json({message:"user not found"})
    }
    if(user.isVoted){
        res.status(400).json({message:"Already voted,come next year"})
    }
    if(user.role==='admin'){
        res.status(400).json({message:"Admins are not allowed"})
    }
    //update the candidate document to record the vote
    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();

//update the user document.
user.isVoted=true;
await user.save;

res.status(200).json({message:"Vote recorded sucessfully"});
}
catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
}
})

//vote count 
router.get('/vote/count',async (req,res)=>{
    try{
    //find all candidate and sort them by votecount in descending order;
    const candidate = await Candidate.find().sort({voteCount:'desc'});

    //map the candidate to only return their name and votecount

    const voteRecord=candidate.map((data)=>{
        return{
            party:data.party,
            count:data.voteCount
        }
    });
    return res.status(200).json(voteRecord);
}
catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
}
});

router.get('/',async(req,res)=>{
    try{
        //find all candidate with only name and party fields
        const candidates= await Candidate.find({},'name party -_id');
        res.status(200).json(candidates);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'});
    }
});

module.exports=router;
