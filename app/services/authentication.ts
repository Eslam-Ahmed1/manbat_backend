import User from '../models/user.ts'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { appError } from '../../utils/appErrors.ts';
//recieve Data transfer object for security and intention
const register = async (userDTO) => {
    const { name, email, password } = userDTO;
    let userExist = await User.findOne({ email: email });
    if (userExist) {
        throw new appError('user exist', 400)
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    let newUser = new User({ name: name, email: email, password: hashPassword });
    const savedUser = await newUser.save();
    const payload = {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
    };
    const token = JWT.sign(
        payload,
        process.env.secret_token as string,
        { expiresIn: '5d' }
    )
    return token
}
const login = async (loginDTO) => {
    const { email, password } = loginDTO;
    const user = await User.findOne({ email: email });
    const isMatch = user && await bcrypt.compare(password, user.password);
    if (user && isMatch) {
        if (user instanceof User) {
            console.log(typeof user.toJSON());
            const payload = {
                _id: user._id,
                name: user.name,
                email: user.email
            };
            const token = JWT.sign(
                payload,
                process.env.secret_token as string,
                { expiresIn: '5d' }
                //use jwt to make token for this user 
            )
            return token;
        }
    }
    else {
        throw new appError('Email or Password Incorrect', 401)
    }
}
export { register, login };