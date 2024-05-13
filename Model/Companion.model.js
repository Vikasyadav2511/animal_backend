import mongoose from "mongoose";
import CategoryModel from "./Category.model";

const Schema = mongoose.Schema;

const CompanionSchema = new Schema({

    title:{
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    comp_category:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:CategoryModel
    },
    image:{
        type:String,
        default:null
    },

    color:{
        type:String,
        required:true
    },

    age:{
        type:Number,
        required:true
    },

    sex:{
        type:String,
        required:true
    },

    Characteristics:{
        type:String,
        required:true
    },

    size:{
        type:String,
        required:true
    },

    Coatlength:{
        type:String,
        required:true
    },

    housetrained:{
        type:String,
        required:true
    },

    Health:{
        type:String,
        required:true
    },

    Good:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Number,
        default:1
    }
})

export default mongoose.model('companion', CompanionSchema);
