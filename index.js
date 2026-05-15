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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/post", router)   
app.use("/auth", authrouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.URL_DB);
        console.log("✅ MongoDB подключена успешно");

        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Ошибка запуска сервера:", error.message);
        process.exit(1); 
    }
};

start();