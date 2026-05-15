import userService from "../services/user-service.js"

class UserController{
    async registration(req,res){
        try{
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            res.cookie("refreshtoken",userData.refreshToken,{maxAge:30*24*60*60*1000})
            return res.json(userData)
        }catch(e){
            throw new Error(e.message)
        }
    }

    async login(req,res){
        try{
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            res.cookie("refreshtoken", userData.refreshToken, {maxAge:30*24*60*60*1000})
            return res.json(userData)
        }catch(e){
            throw new Error(e.message)
        }
    }
    async logout(req,res){
        try{
            const { refreshtoken } = req.cookies
            await userService.logout(refreshtoken)
            res.clearCookie("refreshtoken")
            return res.json({ message: "Logged out successfull" })

        }catch(e){
            throw new Error(e.message)
        }
    }
    async refresh(req,res){
        try{
            const { refreshtoken } = req.cookies
            const userData = await userService.refresh(refreshtoken)
            res.cookie("refreshtoken", userData.refreshToken, {maxAge:30*24*60*60*1000})
            return res.json(userData)

        }catch(e){
            throw new Error(e.message)
        }
    }
    async getAllUser(req,res){
        try{
            const users = await userService.getAllUsers()
            return res.json(users)
        }catch(e){
            throw new Error(e.message)
        }
    }
    async activate(req,res){
        try{
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redict(process.env.CLIENT_API)
        }catch(e){
            throw new Error(e.message)
        }
    }
    async checkOTP(req,res){
        try{
            const { OTP_CODE, email } = req.body
            const userData = await userService.checkOTP(OTP_CODE, email)
            res.cookie("refreshtoken", userData.refreshToken, {maxAge:30*24*60*60*1000})
            return res.json(userData)
        }catch(e){
            throw new Error(e.message)
        }
    }
    async createRoles(req, res){
        try{
            const user = new roleModel()
            const admin = new roleModel({value: "ADMIN"})
            await user.save()
            await admin.save()
            res.json({message: "roles created successfully"})
        }
        catch(e){
            console.log(e)
            res.status(400).json({message: "error in create roles"})
        }
    }
}
export default new UserController()