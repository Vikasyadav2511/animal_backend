import express from 'express';
import mongoose from 'mongoose';
import categoryrouter from './Router/category.router';
import companionrouter from './Router/Companion.router';
import newsRouter from './Router/News.router';
import shoprouter from './Router/shopProduct.router'
import userRouter from './Router/user.router'
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads/', express.static('uploads'))

const PORT = 8002;

mongoose.connect("mongodb://127.0.0.1:27017/Animal")
.then(()=>console.log("Connected"))

app.listen(PORT,()=>{
    console.log(`port is running succesfully on ${PORT}`);
})

app.use(categoryrouter);
app.use(companionrouter);
app.use(newsRouter);
app.use(shoprouter);
app.use(userRouter);




