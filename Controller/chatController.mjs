import mongoose from "mongoose"
import { chatSchema } from "../Model/chatModel.mjs"
import { messageSchema } from "../Model/msgModel.mjs"
import { userSchema } from "../Model/userModel.mjs"

const chat = async (req, res, next) => {
    try{
       const {user,opponent} = req.body
       const obj = {}
       if(!user || !opponent){
            obj.status = false
            obj.message = "Something wrong!"
       }else{
            const isChat = await chatSchema.findOne({
                $and:[{users:{$elemMatch:{$eq:user}}},{users:{$elemMatch:{$eq:opponent}}}]
            }).populate("users")
            
            if(isChat){
               obj.status = true
               obj.chat = isChat 
            }else{
                const chatObj = {
                    users:[user,opponent],
                    displayName:"sender"
                }
                const createdChat = await chatSchema.create(chatObj)
                const fullChat = await chatSchema.findOne({_id:createdChat._id}).populate("users")
                obj.status = false
                obj.chat = fullChat
            }
            res.json(obj)
       }  
    }catch(err){    
        res.json({error:err.message})
    }
}

const getChatList = async (req, res, next) => {
    try{
        const chat_id = req.params.chat_id   
        const fullChat = await chatSchema.find({users:{$in:[chat_id]}}).populate("users").populate("lastMessage").sort({updatedAt:-1})
        console.log(fullChat);
        res.json({status:true,list:fullChat || []})
    }catch(err){
        console.log(err);
        res.json({error:err.message})
    }
}

const getUserExist = async (req, res, next) => {
    try{
        const number = parseInt(req.params.number)  
        console.log(number);
        const fullChat = await userSchema.findOne({number:number})
        console.log(fullChat);
        if(fullChat){
            res.json({status:true, info: fullChat})
        }else{
            res.json({status:false})
        }
    }catch(err){
        console.log(err);
        res.json({error:err.message})
    }
}

const sendMessage = async (req, res, next) => {
    try{
        const {sender,content,chat_id} = req.body.messageData
        const obj = {
            sender:new mongoose.Types.ObjectId(sender),
            content:content,
            chat_id:new mongoose.Types.ObjectId(chat_id)
        }
        let message = await messageSchema.create(obj)
        message = await message.populate("sender")
        message = await message.populate("chat_id")
        message = await message.populate("chat_id.users")
        await chatSchema.updateOne({_id:new mongoose.Types.ObjectId(chat_id)},{$set:{lastMessage:content}})
        res.json({message})
    }catch(err){
        res.json({error:err.message})
    }
}

const getAllMessages = async (req, res, next) => {
    try{
        let messages = await messageSchema.find({chat_id:new mongoose.Types.ObjectId(req.params.chat_id)})
        .populate("sender")
        .populate("chat_id")
        res.json({messages})
    }catch(err){
        res.json({error:err.message})
    }
}

const unreadMessage = async (req, res, next) => {
    try{
        const {receiver,chat, setZero} = req.body
        const findChat = await chatSchema.findOne({_id:new mongoose.Types.ObjectId(chat)})
        let setValue = setZero ? 0 : ((!findChat?.[receiver]) || isNaN(findChat?.[receiver])) ? 0 + 1 : findChat?.[receiver] + 1
        const setNow = setZero ? false : true 
        await chatSchema.updateOne({_id:new mongoose.Types.ObjectId(chat)},{$set:{[receiver]:setValue}},{timestamps:setNow})
        res.json({status:true,unread:setValue})
    }catch(err){
        res.json({error:err.message})
    }
}

export default { chat, getChatList, sendMessage, getAllMessages, getUserExist, unreadMessage }