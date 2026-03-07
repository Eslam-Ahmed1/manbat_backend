import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config();
let connectDB=async function(){
    try{
    await mongoose.connect(process.env.database_connection_url);
    console.log('database connected');
    }
    catch(err){
        console.error(err);
    }

}
export default connectDB ;