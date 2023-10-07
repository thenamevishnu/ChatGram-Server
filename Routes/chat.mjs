import express from "express"
const router = express.Router()
import chat from "../Controller/chatController.mjs"
import { Auth } from "../Middleware/Auth.mjs"

router.get("/getChatList/:chat_id", Auth, chat.getChatList)
router.post("/createChat", Auth, chat.chat)
router.get("/getUserExist/:number", Auth, chat.getUserExist)
router.get("/get-all-messages/:chat_id", Auth, chat.getAllMessages)
router.post("/send-message", Auth, chat.sendMessage)
router.post("/unreadMessage", Auth, chat.unreadMessage)

export default router