import userService from "../services/user-service.js"
import roleModel from "../models/role-model.js"

class UserController {
    async registration(req, res) {
        try {
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            return res.status(400).json({ message: e.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password); 
            return res.json(result); 
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies
            await userService.logout(refreshToken)
            res.clearCookie("refreshToken")
            return res.json({ message: "Logged out successfully" })
        } catch (e) {
            return res.status(400).json({ message: e.message })
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token is missing" });
            }
            const userData = await userService.refresh(refreshToken)
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            return res.status(400).json({ message: e.message })
        }
    }

    async getAllUser(req, res) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            return res.status(400).json({ message: e.message })
        }
    }

    async activate(req, res) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_API)
        } catch (e) {
            return res.status(400).json({ message: e.message })
        }
    }

    async checkOTP(req, res) {
        try {
            const { OTP_CODE, email } = req.body;
            const userData = await userService.checkOTP(OTP_CODE, email);
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });       
            return res.json(userData);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async createRoles(req, res) {
        try {
            const existingRoles = await roleModel.find()
            if (existingRoles.length > 0) {
                return res.json({ message: "Roles already exist" })
            }
            const user = new roleModel()
            const admin = new roleModel({ value: "ADMIN" })
            await user.save()
            await admin.save()
            return res.json({ message: "Roles created successfully" })
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: "Error in creating roles" })
        }
    }
}

export default new UserController()