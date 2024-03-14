import mongoose from "mongoose";
import dotenv from "dotenv";
import userSchema from "../models/user.models.js";
import otpLogSchema from "../models/otp.models.js";

dotenv.config()

const DB_URI = process.env.MONGO_URI;

// const connectionFactory = async (maxRetries = 3) => {
//     try {
//        const conn =  await mongoose
//             .createConnection(DB_URI).asPromise();
//         console.log("Connected to DB!")
//         conn.model('User', userSchema);
//         return conn;
//     }
//     catch (err) {
//         if (maxRetries > 0) {
//             console.log(`Connection to DB failed! Retrying to connect ${maxRetries} more times...`);
//             // wait for 3 seconds before trying to connect again
//             await setTimeout(connectionFactory, 3000, maxRetries - 1);
//         } else {
//             console.log(err.message);
//             console.log("Cannot connect to DB.")
//         }
//         return null;
//     }
// };

const connectionFacade = async () => {
    const conn = await mongoose
        .createConnection(DB_URI).asPromise();
    conn.model('User', userSchema);
    conn.model('OtpLog', otpLogSchema);
    return conn;
};

export default connectionFacade;