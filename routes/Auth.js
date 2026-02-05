import express from "express";
import User from "../models/user.js"
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/register', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis"});
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email déjà existant !"});
  }
  else {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User ({
        email : email,
        password : hashPassword,
    })
    await newUser.save();
    return res.status(201).json({ message: "L'utilisateur à été créer." })
  }
})