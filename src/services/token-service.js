import jwt from "jsonwebtoken";
import TokenModel from "../models/token-model.js";

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, { expiresIn: "30d" });
        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await TokenModel.create({ user: userId, refreshToken })
        return token
    }

    async findToken(refreshToken) {
        return await TokenModel.findOne({ refreshToken })
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.SECRET_REFRESH_KEY)
        } catch (e) {
            return null
        }
    }

    async removeToken(refreshToken) {
        await TokenModel.deleteOne({ refreshToken })
    }
}

export default new TokenService()