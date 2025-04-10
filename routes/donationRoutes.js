const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Donation = require('../models/Donation');

// POST /donate - Store donation details
router.post('/donate', authMiddleware, async (req, res) => {
    try {
        const { donorName, donationType, donationMonth, amount, paymentMethod } = req.body;

        if (!donorName || !donationType || !donationMonth || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const donation = new Donation({ donorName, donationType, donationMonth, amount, paymentMethod, userId: req.user.userId });
        await donation.save();

        res.status(201).json({ message: 'Donation recorded successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET /donations - Retrieve all donations
// router.get('/donations', authMiddleware, async (req, res) => {
//     const donations = await Donation.find({ userId: req.user.userId }).sort({ date: -1 });
//     res.status(200).json(donations);
// });

// GET /donations - Retrieve donations for a specific user or all donations for admin
router.get('/donations', authMiddleware, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            // Admin can see all donations
            const donations = await Donation.find().sort({ date: -1 });
            return res.status(200).json(donations);
        } else {
            // Non-admin can only see their donations
            const donations = await Donation.find({ userId: req.user.userId }).sort({ date: -1 });
            return res.status(200).json(donations);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
