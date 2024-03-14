import { nanoid } from "nanoid";
import dotenv from "dotenv";

import errorHandler from "../utils/error.js";
import connectionFacade from "../utils/connection.js";

dotenv.config();

export default class OtpLogRepository {

    getLog = async (otpLogId) => {
        var conn;
        await connectionFacade()
            .then(connection => conn = connection)
        if (conn == null || conn == undefined) {
            throw errorHandler(500, "Problem connecting with the Database");
        }
        const otpLog = await conn.model('OtpLog');
        const log = await otpLog.findOne({'otpPubId': otpLogId});
        conn.close();
        return log;
    }
    addLog = async (userPubId, otpRequestedAt, status) => {
        var conn;
        await connectionFacade()
            .then(connection => conn = connection)
        if (conn == null || conn == undefined) {
            throw errorHandler(500, "Problem connecting with the Database");
        }
        const otpLog = await conn.model('OtpLog');
        const newLog = new otpLog({ 'otpPubId': nanoid(6), 'userPubId': userPubId, 'otpRequestedAt': otpRequestedAt, 'status': status })
        await newLog.save();
        conn.close();
        return newLog;
    }

    updateLog = async (otpLogId, status) => {
        var conn;
        await connectionFacade()
            .then(connection => conn = connection);
        if (conn == null || conn == undefined) {
            throw errorHandler(500, "Problem connecting with Database");
        }
        const otpLog = await conn.model('OtpLog');
        const log = await otpLog.updateOne({'otpPubId': otpLogId}, {'status': status});
        conn.close();
        return log;
    }

}