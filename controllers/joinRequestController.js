const JoinRequest = require("../models/JoinRequest");
const Mosque = require("../models/Mosque");
const User = require("../models/User");

// 🟡 1. Send Join Request
exports.sendJoinRequest = async (req, res) => {
    const userId = req.user.userId; // ✅ FIXED HERE
    const { mosqueId } = req.body;

    try {
        // Check if mosque exists
        const mosque = await Mosque.findById(mosqueId);
        if (!mosque) {
            return res.status(404).json({ success: false, message: "Mosque not found" });
        }

        // Check if already a member
        if (mosque.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "You are already a member of this mosque" });
        }

        // Check if request already exists
        const existingRequest = await JoinRequest.findOne({ userId, mosqueId, status: "pending" });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: "Join request already sent" });
        }

        // Save new join request
        const newRequest = new JoinRequest({ userId, mosqueId });
        await newRequest.save();

        res.status(201).json({ success: true, message: "Join request sent successfully" });
    } catch (error) {
        console.error("Send join request error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 🟡 2. Get Pending Join Requests for Admin
exports.getPendingRequests = async (req, res) => {
    const adminId = req.user.userId; // ✅ FIXED

    try {
        const mosques = await Mosque.find({ adminId });
        const mosqueIds = mosques.map(m => m._id);

        const requests = await JoinRequest.find({
            mosqueId: { $in: mosqueIds },
            status: "pending"
        })
            .populate("userId", "fullName email")
            .populate("mosqueId", "name");

        res.json({ success: true, requests });
    } catch (error) {
        console.error("Get join requests error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 🟡 3. Approve Join Request
exports.approveRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await JoinRequest.findById(requestId);
        if (!request || request.status !== "pending") {
            return res.status(404).json({ success: false, message: "Join request not found or already processed" });
        }

        const mosque = await Mosque.findById(request.mosqueId);
        if (!mosque) {
            return res.status(404).json({ success: false, message: "Mosque not found" });
        }

        if (!mosque.members.includes(request.userId)) {
            mosque.members.push(request.userId);
            await mosque.save();
        }

        request.status = "approved";
        await request.save();

        res.json({ success: true, message: "Join request approved and user added" });
    } catch (error) {
        console.error("Approve join request error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 🟡 4. Reject Join Request
exports.rejectRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await JoinRequest.findById(requestId);
        if (!request || request.status !== "pending") {
            return res.status(404).json({ success: false, message: "Join request not found or already processed" });
        }

        request.status = "rejected";
        await request.save();

        res.json({ success: true, message: "Join request rejected" });
    } catch (error) {
        console.error("Reject join request error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
