//becasue ES module handle imported file first we put this two listener in seperated exported file 
import mongoose from "mongoose";
import { Server } from 'http'
let server: Server | null
//we make this function instead of import expressLoader file to avoid infinite loop of call import
function setServer(runingServer: Server) {
    server = runingServer
}
const unhandledRejection = process.on('unhandledRejection', async (err) => {
    console.log('I caught this Error : unhandledRejection 🛑\n',err);
    console.log('some thing got wrong, shutdown...');
    if (server != null)
        await server.close()
    console.log("server closeed successfully")
    if (mongoose.connection.readyState == 1) {
        await mongoose.connection.close();
        console.log("database closeed successfully")
    }
    process.exit(1);
})
const uncaughtException = process.on('uncaughtException', async (err) => {
    console.log('I caught this Error : uncaughtException 🛑\n',err);
    console.log('some thing got wrong, shutdown...');
    if (server != null)
        await server.close()
    console.log("server closeed successfully")
    if (mongoose.connection.readyState == 1) {
        await mongoose.connection.close();
        console.log("database closeed successfully")
    }
    process.exit(1);
})
export { uncaughtException, unhandledRejection, setServer }

