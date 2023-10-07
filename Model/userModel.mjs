import mongoose from "mongoose"

const user = new mongoose.Schema({
    user:{
        type:String
    },
    number:{
        type:Number,
        required: true,
    },
    pic:{
        type:String
    }
},{
    timestamps:true
})

export const userSchema = mongoose.model("users",user)