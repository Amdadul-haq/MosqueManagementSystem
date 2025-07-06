const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require('../models/User');
const Mosque = require('../models/Mosque');

const Donation = require('../models/Donation');

// POST /donate - Store donation details
router.post('/donate', authMiddleware, async (req, res) => {
    try {
        const { donorName, donationType, donationMonth, amount, paymentMethod } = req.body;

        if (!donorName || !donationType || !donationMonth || !amount || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // 🟢 Find the user and ensure they belong to a mosque
        const user = await User.findById(req.user.userId);
        if (!user || !user.mosqueId) {
            return res.status(400).json({ success: false, message: 'User must be part of a mosque to donate' });
        }

        // 🟢 Save with mosqueId and userId
        const donation = new Donation({
            donorName,
            donationType,
            donationMonth,
            amount: parseFloat(amount),
            paymentMethod,
            userId: req.user.userId,
            mosqueId: user.mosqueId  // ✅ key point
        });

        await donation.save();

        res.status(201).json({ success: true, message: 'Donation recorded successfully', donation });
    } catch (error) {
        console.error("❌ Donation error:", error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});


// 🔸 GET /api/donations/summary?month=July 2025
router.get('/donations/summary', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const month = req.query.month;

        if (!month) {
            return res.status(400).json({ success: false, message: "Month is required" });
        }

        // 🟢 Build query
        let query = { donationMonth: month };

        if (user.isAdmin) {
            if (!user.mosqueId) {
                return res.status(400).json({ success: false, message: "Admin is not assigned to a mosque" });
            }
            query.mosqueId = user.mosqueId;  // ✅ Only donations of this mosque
        } else {
            query.userId = user._id;
            query.mosqueId = user.mosqueId; // ✅ User's own mosque
        }

        const donations = await Donation.find(query);
        const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

        res.status(200).json({ success: true, totalAmount });
    } catch (error) {
        console.error("❌ Error in summary route:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


router.get('/donations', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const donationMonth = req.query.month;
        const donationType = req.query.type;
        const minAmount = parseFloat(req.query.minAmount);
        const maxAmount = parseFloat(req.query.maxAmount);

        const user = await User.findById(req.user.userId);
        let query = {};

        // ✅ Filter by role
        if (user.isAdmin) {
            if (!user.mosqueId) return res.status(400).json({ message: "Admin does not belong to a mosque" });
            query.mosqueId = user.mosqueId;
        } else {
            query.userId = user._id;
            query.mosqueId = user.mosqueId; // ✅ this ensures correct filtering
        }

        // ✅ Optional filters
        if (donationMonth) query.donationMonth = donationMonth;
        if (donationType) query.donationType = donationType;

        // ✅ Amount filter
        if (!isNaN(minAmount) || !isNaN(maxAmount)) {
            query.amount = {};
            if (!isNaN(minAmount)) query.amount.$gte = minAmount;
            if (!isNaN(maxAmount)) query.amount.$lte = maxAmount;
        }

        const donations = await Donation.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * size)
            .limit(size);

        const totalCount = await Donation.countDocuments(query);

        res.status(200).json({
            success: true,
            donations,
            currentPage: page,
            totalPages: Math.ceil(totalCount / size),
            totalDonations: totalCount
        });

    } catch (error) {
        console.error("❌ Error fetching donations:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
