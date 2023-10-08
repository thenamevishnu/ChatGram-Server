import express from "express"
const router = express.Router()
import user from "../Controller/userController.mjs"

router.post("/send_otp", user.sendOtp)
router.post("/verify_otp", user.verifyOtp)
router.get("/usernameCheck/:username", user.usernameCheck)
router.post("/profileUpdate", user.profileUpdate)

export default router