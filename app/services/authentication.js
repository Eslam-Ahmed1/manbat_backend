import User from '../models/user.js'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'
//recieve Data transfer object for security and intention
const register=async(userDTO)=>{
    const {name,email,password}=userDTO;
    let userExist=await User.findOne({email:email});
    if(userExist){
        throw new Error('user exist')
    }
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);
    let newUser=new User({name:name,email:email,password:hashPassword});
    const savedUser=await newUser.save();
    const payload = { 
        _id: savedUser._id, 
        name: savedUser.name, 
        email: savedUser.email 
    };
    const token=JWT.sign(
         payload,
         process.env.secret_token,
         {expiresIn:'5d'}
        )
        return token
}
const login=async(loginDTO)=>{
    const {email,password}=loginDTO;
    let checkUserExist=await User.findOne({email:email});
    let isMatch=checkUserExist&&await bcrypt.compare(password,checkUserExist.password);
    if(checkUserExist&&isMatch){
        const user=await User.findOne({email:email},{password:0});
    console.log(typeof user.toJSON());
    const payload = { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
    };
    const token=JWT.sign(
        payload,
        process.env.secret_token,
        {expiresIn:'5d'}
        //use jwt to make token for this user 
        )
        return token;
    }
    else{
        throw new Error ('invalid credentials')
    }
}
export {register,login};