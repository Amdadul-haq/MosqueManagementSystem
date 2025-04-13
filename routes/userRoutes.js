const express = require("express");
const { uploadProfileImage, getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/profile-image", authMiddleware, upload.single("profileImage"), uploadProfileImage);

module.exports = router;
