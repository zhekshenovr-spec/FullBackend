import userModel from "../models/user-model.js"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import MailService from "./mail-service.js"
import tokenService from "./token-service.js"
import UserDto from "../dtos/user-dto.js"

const mailService = new MailService()
class UserService{
    async registration(email, password){
        const condidat = await userModel.findOne({email})
        if(condidat){
            throw new Error("такой пользователь уже сущ")
        }
        const hashPassword = bcrypt.hashSync(password, 3)
        const activationLink = uuidv4() ///domen/5000/auth/activate/v32-vfdsvsdf-vdfvfssfdjk
        const user = await userModel.create({email, password:hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user:userDto}

    }
    async activate(activationLink){
        const user = await userModel.findOne({activationLink})
        if(!user){
           throw new Error("некоректная ссылка")
        }
        user.isActicated = true
        await user.save()
   }
   
   async checkOTP(OTP_CODE, email){
    const user = await userModel.findOne({ email })
    if(user.otpCode == OTP_CODE){
        user.otpCode = null
        await user.save()
            const userDto = new UserDto(user)
            const tokens = tokenService.generateToken({...userDto})
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            return {...tokens, user:userDto}
        }
        throw new Error("Неправильный код")
    }

   async login(email, password){
        const user = await userModel.findOne({ email })
        if (!user) {
            throw new Error("Пользователя не существует")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error("Неправильный пароль")
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        const OTP_CODE = Math.floor(100000 + Math.random() * 900000).toString()
        user.otpCode = OTP_CODE
        await user.save()

        await mailService.sendOtpCode(email,OTP_CODE)
        return {...tokens, user:userDto}
    }
   

    async getAllUsers() {
        const users = await userModel.find()
        return users
    }
    async logout(refreshToken) {
        await tokenService.removeToken(refreshToken)
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error("Пользователь не авторизован")
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw new Error("Пользователь не авторизован")
        }
        const user = await userModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user:userDto}
    }
}
export default new UserService()