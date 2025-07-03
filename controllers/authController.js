const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            fullName: user.fullName,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};


exports.logout = async (req, res) => {
    try {
        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
// exports.CreateAdminUser = async (req, res) => {
//     const { fullName, email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: "User already exists" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             fullName,
//             email,
//             password: hashedPassword,
//             isAdmin: true, // 👈 Mark this user as admin
//         });

//         await newUser.save();
//         res.status(201).json({ message: "Admin user created successfully" });

//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error });
//     }
// };
