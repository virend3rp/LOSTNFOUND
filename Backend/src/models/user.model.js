import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim:true,
      index:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
    },
    password:{
        type:String,
        required: [true,"Password is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
  },{timestamps:true});

export const User=mongoose.model("User",userSchema)
