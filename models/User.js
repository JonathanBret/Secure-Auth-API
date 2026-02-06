import express from "express";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    refreshTokens: [],
});

const User = mongoose.model("User", UserSchema);

export default User;