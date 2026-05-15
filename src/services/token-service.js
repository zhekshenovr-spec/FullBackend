import  jwt from "jsonwebtoken"
import tokenModel from "../models/token-model.js"

class TokenService{
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn:"30m"})
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {expiresIn:"30d"})
        return{
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({userId})
        if(tokenData){
            tokenData.refreshtoken = refreshToken //refreshtoken
            return tokenData.save()
        }
        const token = await tokenModel.create({user:userId, refreshToken})
        return token
    }
    async removeToken(refreshToken) {
        const result = await tokenModel.deleteOne({ refreshToken })
        return result
    }
    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }
    async validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY)
            return userData
        }catch(e){
            return null
        }
    }
}

export default new TokenService()