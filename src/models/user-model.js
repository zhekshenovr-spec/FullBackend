import {Schema, model} from 'mongoose'

const UserModel = new Schema({
    email:{type:String, unique:true, required:true},
    password:{type:String, required:true},
    isActicated:{type:Boolean, default:false},
    activationLink:{type:String},
    otpCode:{type:String},
    role:{type:String, default:"USER", ref:"RoleModel"}
})
export default model("UserModel", UserModel)