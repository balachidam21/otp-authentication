
import Twilio from "twilio/lib/rest/Twilio.js";
import dotenv from "dotenv";
import OtpLogRepository from "../repository/otp.repository.js";

dotenv.config();

const twillio_account_sid = process.env.TWILLIO_ACCOUNT_SID;
const twillio_auth_token = process.env.TWILLIO_AUTH_TOKEN;
const twilio_service_sid = process.env.TWILLIO_SERVICE_SID;

const client = new Twilio(twillio_account_sid, twillio_auth_token);
const otpLogRepository = new OtpLogRepository();

export default class OTPService {

    sendOTP = async (pubId, phoneNumber) => {
        //send otp using external service
        const otpResponse = await client.verify.v2
            .services(twilio_service_sid)
            .verifications
            .create({
                to: `${phoneNumber}`,
                channel: "sms",
            });
        //once otp is sent, create a log and mark it as sent!
        var otpRequestedAt = otpResponse['dateCreated']; 
        var status = otpResponse['status'];
        const log = await otpLogRepository.addLog(pubId, otpRequestedAt, status);
        return log;
    }
    verifyOTP = async (phoneNumber, otpLogId, otpValue) => {
        //check if otp has already been verified
        const otplog = await otpLogRepository.getLog(otpLogId);

        if(otplog == null || otplog == undefined) {
            return {
                "otpPubId": otpLogId,
                "success": false,
                "message": "no logs indicate otp was sent to the user!"
            }
        }
        if (otplog.status == "approved" || otplog.status != "pending") {
            return {
                "otpPubId": otpLogId,
                "success": false,
                "message": "otp has already been verified"
            }
        }

        var verificationResponse;
        await client.verify.v2
            .services(twilio_service_sid)
            .verificationChecks
            .create({
                to: phoneNumber,
                code: otpValue,
            })
            .then(response => verificationResponse = response);
        //currently with Twilio trial account we can only check if the otp is correct or incorrect, no functionality to check if they are expired
        //can add manual business logic to check for expiration
        var updatedLog;
        if(verificationResponse.status == "approved") {
            await otpLogRepository.updateLog(otpLogId, verificationResponse.status);
            updatedLog = {
                "otpPubId": otpLogId,
                "success": true,
                "message": "otp verified!"
            }
        } else if (verificationResponse.status == "pending") {
            updatedLog = {
                "otpPubId": otpLogId,
                "success": false,
                "message": "invalid otp entered!"
            }
        }
        return updatedLog;
    }
}