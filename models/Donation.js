const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorName: { type: String, required: true },
    donationType: { type: String, enum: ['Regular', 'Mosuhimu Collection', 'Eid Collection', 'Others'], required: true },
    donationMonth: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Bkash', 'Nagad', 'Rocket', 'By Hand'], required: true },
    date: { type: Date, default: Date.now },
    mosqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mosque', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
