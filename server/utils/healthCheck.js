import errorHandler from "./error.js";
const healthCheck = (req, res, next) => {
    try{
        res.status(200).json({
            success: true,
            message: "System Health-Check!! All good!!",
            status: 200
        });
    } catch(error) {
        console.error(error);
        const statusCode = error.statusCode || 500;
        const message  = error.message || "Interval Server Error";
        next(errorHandler(statusCode, message));
    }
};

export default healthCheck;