import express from "express";
import User from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const SECRET = process.env.SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.post('/register', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis"});
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email déjà existant !"});
  }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User ({
        email : email,
        password : hashPassword,
    })
    await newUser.save();
    return res.status(201).json({ message: "L'utilisateur à été créer." })
  });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis"});
      }

      const user = await User.findOne({ email });
      if (!user){
        return res.status(400).json({ message: "Email ou mot de passe incorrect."})
      }
        const matchPassword = await bcrypt.compare( password, user.password)
        if (!matchPassword) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect."})
        }
            const userId = user._id;
            const accessToken = jwt.sign({ userId}, SECRET, { expiresIn: '15m'});
            const refreshToken = jwt.sign({ userId}, REFRESH_SECRET, { expiresIn: '7d'});
            user.refreshTokens.push(refreshToken);
            await user.save();


            return res.json({ accessToken, refreshToken});
    });

    router.post('/refresh', async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Non autorisé." });
        }
    
        try {
            const payload = jwt.verify(refreshToken, REFRESH_SECRET);
            const userId = payload.userId;
    
            const user = await User.findOne({ _id: userId, refreshTokens: refreshToken });
            if (!user) {
                return res.status(401).json({ message: "Token invalide ou révoqué." });
            }
    
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    
            const newRefreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
            user.refreshTokens.push(newRefreshToken);
            await user.save();
    
            const newAccessToken = jwt.sign({ userId }, SECRET, { expiresIn: '15m' });
    
            return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (err) {
            return res.status(401).json({ message: "Token invalide." });
        }
    });
    

    export default router;