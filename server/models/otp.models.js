import mongoose from "mongoose";

const otpLogSchema = new mongoose.Schema({
    otpPubId : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userPubId: {
        type: String,
        ref: 'User',
        required: true
    },
    otpRequestedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum:['pending', 'approved', 'cancelled']
    }
});


export default otpLogSchema;