import authMiddleware from "./middlewares/authMiddleware.js";

app.get("/dashboard", authMiddleware, (req, res) => {
    return res.json({ message: "Bienvenue sur le Dashboard.", userId: req.userId});
})