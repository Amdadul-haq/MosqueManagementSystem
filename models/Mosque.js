const mongoose = require('mongoose');

const mosqueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    village: String,
    union: String,
    upazila: String,
    zilla: String,
    imamName: String,
    mosqueCode: { type: String, required: true, unique: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Mosque', mosqueSchema);
