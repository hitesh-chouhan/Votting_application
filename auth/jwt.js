const jwt=require('jsonwebtoken');

const jwtAuthMiddleware=(req,res,next)=>{
     // first check request headers has authorization or not
     const authorization = req.headers.authorization
     if(!authorization) return res.status(401).json({ error: 'Token Not Found' });
 
     // Extract the jwt token from the request headers
     const token = req.headers.authorization.split(' ')[1];
     if(!token) return res.status(401).json({ error: 'Unauthorized' });
 
        try{
            //verify jwt token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //attach user info. to the request object;
            req.user=decoded; //user ki place pr kuchh bhi likh skte he
            next();
    }catch(err){
        console.log(err);
        res.status(401).json({error:"invalid token"});
    }
}

// Generating jwt token

const generateToken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:30000});
}
module.exports={jwtAuthMiddleware,generateToken};