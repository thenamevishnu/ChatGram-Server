import NodeCache from "node-cache"
const chache = new NodeCache()
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userSchema } from "../Model/userModel.mjs"
import mongoose from "mongoose"

dotenv.config()

const sendOtp = async (req, res) => {
    try{
        const obj = {}
        const {number} = req.body
        if(!number){
            obj.status = false
            obj.color = "red"
            obj.message = "Number is empty"
        }else{
            const result = {ok: true, code: 1030}
            if(result.ok){
                obj.status = true
                obj.color = "green"
                obj.message = "Verification code: "+result.code+" sent!"
                chache.set(`${number}`, result.code)
            }else{
                obj.status = false
                obj.color = "red"
                obj.message = "Error happend!"
            }
        }
        res.json(obj)
    }catch(err){
        res.json({error:err.message})
    }
}

const verifyOtp = async (req, res) => {
    try{
        const obj = {}
        const {number, otp} = req.body
        const findUser = await userSchema.findOne({number: number})
        if(!number || !otp){
            obj.status = false
            obj.color = "red"
            obj.message = "Number or Otp is empty"
        }else{
            const val = await chache.get(`${number}`)
            if(val == otp){
                obj.status = true
                obj.color = "green"
                obj.message = "Mobile number verified!"
                obj.token = jwt.sign({sub: number}, process.env.JWT, {expiresIn:"10y"})
                const user = {
                    user: findUser ? findUser.user : "ChatGramUser", 
                    number: number, 
                    pic: findUser ? findUser.pic : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PyKYrBKAWWy6YCbQzWQcwIRqH8wYMPluIZiMpV1w0NYSbocTZz0ICWFkLcXhaMyvCwQ"
                }
                obj.user = {
                    token: obj.token,
                    user: user
                }
                if(!findUser){
                    const response = await userSchema.create(user)
                    obj.user.user.id = response._id
                }else{
                    obj.user.user.id = findUser._id
                }
            }else{
                obj.status = false
                obj.color = "red"
                obj.message = "Invalid verification code!"
            }
        }
        res.json(obj)
    }catch(err){
        res.json({error:err.message})
    }
}

const usernameCheck = async (req, res) => {
    try{
        const findUserName = await userSchema.findOne({user: req.params.username})
        if(findUserName)
            res.json({status: true})
        else
            res.json({status: false})
    }catch(err){
        res.json({error:err.message})
    }
}

const profileUpdate = async (req, res) => {
    try{
        const {profile, user} = req.body
        await userSchema.updateOne({_id: new mongoose.Types.ObjectId(user)},{$set:{user: profile.username, pic: profile.pic}})
        res.json({status: true})
    }catch(err){
        res.json({error:err.message})
    }
}

export default {sendOtp, verifyOtp, usernameCheck, profileUpdate}