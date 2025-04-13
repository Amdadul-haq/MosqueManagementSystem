const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const image = req.file.filename;

        const user = await User.findByIdAndUpdate(userId, { profileImage: image }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile image updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get user profile (name + image)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("fullName profileImage");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
