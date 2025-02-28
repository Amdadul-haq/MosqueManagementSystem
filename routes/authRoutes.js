const express = require("express");
const { signup, login,logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/homepage", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to Homepage!" });
});
router.post("/logout", logout);

module.exports = router;
