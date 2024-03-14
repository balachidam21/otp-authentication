import mongoose from "mongoose";
import connectionFactory from "../utils/connection.js";
import { nanoid } from "nanoid";


import dotenv from "dotenv";
import errorHandler from "../utils/error.js";

dotenv.config();

export default class UserRepository {

    findUser = async (username) => {
        var conn;
        await connectionFactory()
            .then(connection => conn = connection)
        if (conn == null || conn == undefined) {
            throw errorHandler(500, "Problem connecting with the Database");
        }
        const User = await conn.model('User');
        const search = await User.findOne({ 'username': username });
        // console.log(search);
        if (search == null) {
            return null;
        }
        conn.close()
        return search;
    }

    addUser = async (username, phoneNumber) => {
        var conn;
        await connectionFactory()
            .then(connection => conn = connection)
        if (conn == null || conn == undefined) {
            throw errorHandler(500, "Problem connecting with the Database");
        }
        const User = await conn.model('User');
        const newUser = new User({'username': username, 'phoneNumber': phoneNumber, 'pubId': nanoid(6)})
        await newUser.save();
        conn.close();
        return newUser;

    }
}