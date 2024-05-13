import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        required:true,
    },

    avatar:{
        type:String,
        default:null,
    },
    role:{
        type:Number,
        default:0
    },

    status:{
        type:Number,
        deafult:1
    },
},{timestamps:true});

export default mongoose.model('user',userSchema)