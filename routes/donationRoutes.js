const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// POST /donate - Store donation details
router.post('/donate', async (req, res) => {
    try {
        const { donorName, donationType, donationMonth, amount, paymentMethod } = req.body;

        if (!donorName || !donationType || !donationMonth || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const donation = new Donation({ donorName, donationType, donationMonth, amount, paymentMethod });
        await donation.save();

        res.status(201).json({ message: 'Donation recorded successfully', donation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET /donations - Retrieve all donations
router.get('/donations', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
