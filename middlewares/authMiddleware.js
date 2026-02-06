import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Non autorisé."})
    }
        try {
        const payload = jwt.verify(token, SECRET);
        req.userId = payload.userId;
        next();
        }

        catch(err) {
        return res.status(401).json({ message: "Token invalide."})
        }
    }