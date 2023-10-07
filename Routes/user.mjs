import express from "express"
const router = express.Router()
import user from "../Controller/userController.mjs"
import { Auth } from "../Middleware/Auth.mjs"

router.post("/send_otp", user.sendOtp)
router.post("/verify_otp", user.verifyOtp)

export default router