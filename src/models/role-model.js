import {Schema, model} from 'mongoose'

const RoleModel = new Schema({
    value:{type:String, unique:true, default:"USER"}
})
export default model("RoleModel", RoleModel)