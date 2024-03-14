import Twilio from "twilio/lib/rest/Twilio.js";
import dotenv from "dotenv";
import UserRepository from "../repository/user.repository.js";
import errorHandler from "../utils/error.js";
import OTPService from "./otp.service.js";

dotenv.config();

const twillio_account_sid = process.env.TWILLIO_ACCOUNT_SID;
const twillio_auth_token = process.env.TWILLIO_AUTH_TOKEN;
const twilio_service_sid = process.env.TWILLIO_SERVICE_SID;

const client = new Twilio(twillio_account_sid, twillio_auth_token);
const userRepository = new UserRepository();
const otpService = new OTPService();

export default class UserService {

    checkUser = async (username) => {
        try {
            const user = await userRepository.findUser(username);
            if (user == null) {
                var serverResponse = {
                    "status_code": 200,
                    "response": {
                        "responseType": "GET_PHONE_NUMBER",
                        "forUser": username,
                    }
                }
                return serverResponse;
            }
            //call sendOTP to send OTP to particular phone number
            //create a OTP log for phonenumber using the OTP service
            const otpResponse = await otpService.sendOTP(user.pubId, user.phoneNumber);
            // if OTP sent successfully, send a successful message and ask to enter OTP
            var serverResponse = {
                "status_code": 200,
                "response": {
                    "responseType": "GET_OTP",
                    "username": user.username,
                    "phoneNumber": user.phoneNumber,
                    "userPubId": user.pubId,
                    "otpLogId": otpResponse.otpPubId
                }
            }
            return serverResponse;

        }
        catch (error) {
            console.error(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to check the user! Problem Occured";
            throw errorHandler(statusCode, message);
        }
    }

    saveUser = async (username, phoneNumber) => {
        try {
            //check if user is already a exisiting user
            const existing_user = await userRepository.findUser(username);
            if (existing_user != null) {
                var serverResponse = {
                    "status_code": 403,
                    "response": {
                        "responseType": "client error",
                        "message": "User already exists in db!"
                    }
                }
                return serverResponse;
            }
            const user = await userRepository.addUser(username, phoneNumber);
            if (user == null) {
                var serverResponse = {
                    "status_code": 500,
                    "response": {
                        "responseType": "server error",
                        "message": "Error in adding the user! Retry after sometime!"
                    }
                }
                return serverResponse;
            }
            // if user variable is not null, user is saved in DB.
            // next step is to call otp service to send otp to the required phonenumber
            // send response back to client asking for OTP
            const otpResponse = await otpService.sendOTP(user.pubId, user.phoneNumber);

            // if OTP sent successfully, send a successful message and ask to enter OTP
            var serverResponse = {
                "status_code": 200,
                "response": {
                    "responseType": "GET_OTP",
                    "username": user.username,
                    "phoneNumber": user.phoneNumber,
                    "otpLogId": otpResponse.otpPubId
                }
            }
            return serverResponse;
        }
        catch (error) {
            console.error(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to save the user in Database! Problem occured";
            throw errorHandler(statusCode, message);
        }

    }

    verifyUser = async (username, phoneNumber, otpLogId, otpValue) => {
        //first check if the given phonenumber matches with phonenumber in DB
        try {
            //check if user is a valid user
            //if user is valid, check if the given phonenumber matches with phone number in DB!
            const user = await userRepository.findUser(username);
            if (user == null || user.phoneNumber != phoneNumber) {
                var serverResponse = {
                    "status_code": 404,
                    "response": {
                        "responseType": "client error!",
                        "message": "such user does not exist"
                    }
                }
                return serverResponse;
            }

            //call otpservice to verify the otp
            const verifyOtpResponse = await otpService.verifyOTP(phoneNumber, otpLogId, otpValue);

            if (verifyOtpResponse.success == false) {
                //handle response for status with pending or expired value
                var serverResponse = {
                    "status_code": 403,
                    "success": false,
                    "message": verifyOtpResponse.message
                }
                return serverResponse;
            }

            // success = true
            //remaining value for status is only approved, so we return a valid otp response
            var serverResponse = {
                "status_code": 200,
                "success": true,
                "message": verifyOtpResponse.message
            }
            return serverResponse;

        } catch (error) {
            console.error(error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to verify the user; Problem occured!";
            throw errorHandler(statusCode, message);
        }
    }
}