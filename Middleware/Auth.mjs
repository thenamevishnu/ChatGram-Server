import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const Auth = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]
        if(token?.split(" ")[1] == null){
            res.json({auth: "no"})
        }else{
            const auth = jwt.verify(token?.split(" ")[1],process.env.JWT)
            const now = Math.floor(new Date().getTime() / 1000)
            if(auth.exp <= now){
                res.json({auth: "no"})
            }else{
                next()
            }
        }
    }catch(err){
        res.json({error:err.message})
    }
}