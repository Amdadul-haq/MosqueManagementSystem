const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Donation = require('../models/Donation');

// POST /donate - Store donation details
router.post('/donate', authMiddleware, async (req, res) => {
    try {
        const { donorName, donationType, donationMonth, amount, paymentMethod } = req.body;

        if (!donorName || !donationType || !donationMonth || !amount || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const donation = new Donation({ donorName, donationType, donationMonth, amount, paymentMethod, userId: req.user.userId });
        await donation.save();

        res.status(201).json({ success: true, message: 'Donation recorded successfully', donation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// router.get('/donations', authMiddleware, async (req, res) => {
//     try {
//         if (req.user.isAdmin) {
//             // Admin can see all donations
//             const donations = await Donation.find().sort({ date: -1 });
//             return res.status(200).json(donations);
//         } else {
//             // Non-admin can only see their donations
//             const donations = await Donation.find({ userId: req.user.userId }).sort({ date: -1 });
//             return res.status(200).json(donations);
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// });

router.get('/donations', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const skip = (page - 1) * size;

        const query = req.user.isAdmin ? {} : { userId: req.user.userId };

        const [donations, totalCount] = await Promise.all([
            Donation.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(size),
            Donation.countDocuments(query)
        ]);

        return res.status(200).json({
            donations,
            currentPage: page,
            totalPages: Math.ceil(totalCount / size),
            totalDonations: totalCount
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
