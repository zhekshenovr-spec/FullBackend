import {Schema, model} from 'mongoose'

const tokenModel = new Schema({
    user:{type:Schema.Types.ObjectId, ref:"User"},
    refreshtoken:{type:String, required:true},
})

export default model("Token", tokenModel)