import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./src/routers/router.js";
import authrouter from "./src/routers/authrouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: [], 
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/post", router)   
app.use("/auth", authrouter)

async function start() {
    try {
        await mongoose.connect(process.env.URL_DB);
        console.log("MongoDB is work");
    } catch (e) {
        console.log("CRUD with static is work");
    }
    app.listen(PORT, () => console.log(`Server work on http://localhost:${PORT}`));
}

start();