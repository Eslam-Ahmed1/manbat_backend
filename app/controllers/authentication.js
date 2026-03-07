import {authenticationSevice} from '../services/index.js'
const register=async(req,res)=>{
    try{
        const userDTO={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }
        const token=await authenticationSevice.register(userDTO);
        res.status(201).json({token});

    }
    catch(err){
        console.error(err);
        if (err.message == 'user exist')
            return res.status(400).json({msg:"user exist"})
        res.status(500).json({ message: "server error"});
    }
}
const login=async(req,res)=>{
    try{
        const loginDTO={email:req.body.email,password:req.body.password}
        token =await authenticationSevice.login(loginDTO);
        res.status(200).json({token})
    }
    catch(err){
        console.error(err);
        if (err.message == 'invalid credentials')
            return res.status(400).json({msg:'email  or password incorrect'})
        res.status(500).json({ message: "server error"});
    }
}
const user=async(req,res)=>{
    try{
         //i need get this user from database by using unique email
         let user =req.user;
         res.json(user);
    }
    catch(err)
    {
        //this error may come from database
        res.status(500).json({msg:'server error'});
    }
}
export {register,login,user}