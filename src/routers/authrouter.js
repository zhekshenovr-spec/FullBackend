import { Router } from 'express'
import userController from '../controllers/user-controller.js'

const authrouter = new Router()

//Аутентификация 
authrouter.post("/register", userController.registration)
authrouter.post("/login", userController.login)
authrouter.post("/logout", userController.logout)
authrouter.get("/activate/:link", userController.activate)
authrouter.get("/refresh", userController.refresh)
authrouter.get("/getall", userController.getAllUser)
authrouter.get("/checkotp", userController.checkOTP)
authrouter.get("/createroles", userController.createRoles) 

export default authrouter