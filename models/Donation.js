const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorName: { type: String, required: true },
    donationType: { type: String, enum: ['Regular', 'Mosuhimu Collection', 'Eid Collection', 'Others'], required: true },
    donationMonth: { type: String, required: true },
    amount: { type: String, required: true },
    paymentMethod: { type: String, enum: ['Bkash', 'Nagad', 'Rocket', 'ByHand'], required: true },
    date: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
