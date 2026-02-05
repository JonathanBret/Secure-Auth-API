import express from "express";
import User from "../models/user.js"

const router = express.Router();

router.post('/register', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis"});
  }
})