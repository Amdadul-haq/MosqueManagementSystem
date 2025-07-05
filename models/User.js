const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    mosqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mosque', default: null },

    profileImage: { type: String, default: "" }
});

module.exports = mongoose.model("User", UserSchema);
