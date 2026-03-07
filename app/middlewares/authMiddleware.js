import JWT from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config();
let Authorization=(req,res,next)=>{
try{
    //authontication:"bearer token"
    console.log(req.headers)
    let token=req.headers['authorization'].split(' ')[1];
    console.log(token);
    if(!token)
    {
         res.status(401).json({msg:'token empty'});
    }
    // JWT.verify()
    let decodedPayload= JWT.verify(token,process.env.secret_token);
    req.user=decodedPayload;
    next();
    }
catch(err){console.log(err);
        res.status(403).json({msg:'not valid token'});
    }
}
export default Authorization;
