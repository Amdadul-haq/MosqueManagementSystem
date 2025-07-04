const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mosqueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mosque",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
