import { Router } from "express";
import { checkUser, addUser, verifyCredentials}  from "../controllers/user.controller.js";

const router = Router();


router.get("/check-user/:username", checkUser);
router.post("/add-user", addUser);
router.post("/verify-user", verifyCredentials);

export default router;