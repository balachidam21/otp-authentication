import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(cors());


app.use("/api", healthCheckRouter);
app.use("/user", userRouter);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, message, statusCode });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});