import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pubId : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default userSchema;

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     hashedPassword: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: false,
//         unique: true,
//         trim: true
//     },
//     phoneNumber: {
//         type: String,
//         required: false,
//         unique: true,
//         trim: true
//     },
//     otpSecret: {
//         type: String,
//         required: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });