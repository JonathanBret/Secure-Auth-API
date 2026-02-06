import express from "express";
import authMiddleware from "./middlewares/authMiddleware.js";
import router from './routes/Auth.js';
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Trop de requête depuis cet IP, réesaye après 15 minutes."
});

app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);
app.use("/auth/refresh", authLimiter);

app.get("/dashboard", authMiddleware, (req, res) => {
    return res.json({ message: "Bienvenue sur le Dashboard.", userId: req.userId});
})

app.use("/auth", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
