import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"3mb"}))
app.use(express.urlencoded({extended:true,limit:"3mb"}))
app.use(express.static("public"))
app.use(cookieParser())

dotenv.config();


//routes

import userRouter from './routes/user.routes.js'

//routes declarations
app.use("/api/v1/users",userRouter);



export {app}