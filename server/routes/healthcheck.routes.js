import express  from "express";
import healthCheck from "../utils/healthCheck.js"

const router = express.Router();

router.get("/healthcheck", healthCheck);

export default router;