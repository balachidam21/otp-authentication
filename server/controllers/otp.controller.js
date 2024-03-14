import UserService from "../services/user.service.js";
import errorHandler from "../utils/error.js";

const userService = new UserService()

export const receivePhoneNumber = async (req, res, next) => {
    try {
        const { countryCode, phoneNumber } = req.body;
        const otpResponse = await userService.sendOTP(countryCode, phoneNumber);
        // console.log(otpResponse);
        if (otpResponse == null) {
            res.status(502).json({
                status: 502,
                message: 'Bad Gateway! OTP was not sent! Retry again with a correct phone number!'
            });
        }
        res.json({
            status: 200,
            message: 'OTP has been sent successfully!'
        });
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "OTP was not sent, Problem Occured";
        next(errorHandler(statusCode, message));
    }
}

export const verifyPhoneNumber = async (req, res, next) => {
    try{
        const { countryCode, phoneNumber, otp } = req.body;
        const verificationResponse = await userService.verifyOTP(countryCode, phoneNumber, otp);
        // console.log(verificationResponse);
        if (verificationResponse == null){
            res.status(502).json({
                status: 502,
                message: 'Bad Gateway! OTP was not verified! Resend request.'
            });
        }
        res.json({
            status: 200,
            message: 'OTP has been verified!'
        })
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "OTP was not verified, Problem Occured";
        next(errorHandler(statusCode, message));
    }
}

export const userSignup = async (req, res, next) => {
    const {username, password, phoneNumber} = req.body;
    
}
