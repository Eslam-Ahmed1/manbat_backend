import User from '../models/user.ts'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { appError } from '../../utils/appErrors.ts';
//recieve Data transfer object for security and intention
interface userDTO {
    name: string,
    email: string,
    password: string
}
interface loginDTO {
    email: string,
    password: string
}
const register = async (userDTO: userDTO) => {
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

    if (!process.env.SECRET_TOKEN) {
        throw new appError('Server configuration error: Missing secret token', 500);
    }

    const token = JWT.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        { expiresIn: '5d' }
    )
    return token
}
const login = async (loginDTO: loginDTO) => {
    const { email, password } = loginDTO;
    const user = await User.findOne({ email: email });
    const isMatch = user && await bcrypt.compare(password, user.password);
    if (user && isMatch) {
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        if (!process.env.SECRET_TOKEN) {
            throw new appError('Server configuration error: Missing secret token', 500);
        }

        const token = JWT.sign(
            payload,
            process.env.SECRET_TOKEN as string,
            { expiresIn: '5d' }
        );
        return token;
    }
    else {
        throw new appError('Email or Password Incorrect', 401)
    }
}
export { register, login };