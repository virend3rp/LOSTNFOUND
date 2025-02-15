import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const getPublicIdFromUrl = (url) => {
    // Assuming the URL has the format: "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/user_avatars/profile_pic.jpg"
    const regex = /\/upload\/v\d+\/(.*?)(\.\w+)$/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];  // Return the public_id part (without the extension)
    }
    return null;  // Return null if no match found
};

const registerUser = asyncHandler(async (req, res) => {
    const {name, email,phone, password } = req.body;

  
    // Validate input fields
    if ([name, email, phone, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }
    const existedUser= await User.findOne({email})
    if(existedUser){
        throw new ApiError(409, "email or phone number already exists");
    }
    console.log(req.file);
    const avatarLocalPath=await req.file?.path;
    console.log(avatarLocalPath);
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    const newUser=await User.create({
        name,
        email,
        phone,
        password,
        avatar:avatar.url,
    })
    const createdUser=await User.findById(newUser._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser)
    )
      
  });  

const loginUser=asyncHandler(async (req,res)=>{

    const{email,username,password}=req.body;
    if(!username && !email){
        throw new ApiError(400,"Username or email is required")
    }
    const userExist=await User.findOne({
        $or : [{username},{email}]
    })
    if(!userExist){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid=await userExist.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user Credentials")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(userExist._id)

    const loggedinUser=await User.findById(userExist._id).select("-password -refreshToken")

    const options ={
        httpOnly: true,
        secure:true
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedinUser,accessToken,refreshToken
        })
    )
})

const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true,
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options)
            .clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out"))
});  

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword}=req.body
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    const passwordMatch=await user.isPasswordCorrect(oldPassword);
    if(!passwordMatch){
        throw new ApiError(401,"Invalid credentials");
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json(new ApiResponse(200,{},"Password Changed successfully"))
})

const getCurrentUser=asyncHandler(async(req,res)=>{
        return res.status(200).json(200,req.user,"Current User Fetched Succesfully");
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name, email,phone} = req.body

    if (!name || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                email: email,
                phone
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const oldurl=req.user.avatar.url;
    const puclicId=getPublicIdFromUrl(oldurl);
    if(puclicId){
        await cloudinary.uploader.destroy(puclicId)
    }
    //TODO: delete old image - assignment
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
} 