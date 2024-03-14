import UserService from "../services/user.service.js";
import errorHandler from "../utils/error.js";

const userService = new UserService()

export const checkUser = async (req, res, next) => {
    try {
        const username = req.params['username'];
        const userResponse = await userService.checkUser(username);
        return res.status(userResponse.status_code).json(userResponse);
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "Server Error, Problem Occured";
        next(errorHandler(statusCode, message));
    }

}

export const addUser = async (req, res, next) => {
    try {
        const { username, phoneNumber } = req.body;
        const response = await userService.saveUser(username, phoneNumber);
        return res.status(response.status_code).json(response);
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "Server Error, Problem Occured";
        next(errorHandler(statusCode, message));
    }
}

export const verifyCredentials = async (req, res, next) => {
    try {
        const { username, phoneNumber, otpLogId, otpValue } = req.body;
        const response = await userService.verifyUser(username, phoneNumber, otpLogId, otpValue);
        return res.status(response.status_code).json(response);
    } catch (error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "Server Error, Problem Occured";
        next(errorHandler(statusCode, message));
    }
}

