import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const Auth = async (req, res, next) => {
    try{
        const token = req.headers["authorization"]
        console.log(token);
        const obj = {}
        if(token?.split(" ")[1] == null){
            obj.auth = "no"
        }else{
            const auth = jwt.verify(token?.split(" ")[1],process.env.JWT)
            const now = Math.floor(new Date().getTime() / 1000)
            if(auth.exp <= now){
                obj.auth = "no"
            }else{
                obj.auth = "yes"
                next()
            }
        }
    }catch(err){
        res.json({error:err.message})
    }
}