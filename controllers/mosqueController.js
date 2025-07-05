const Mosque = require('../models/Mosque');
const User = require('../models/User');
const crypto = require('crypto');

exports.createMosque = async (req, res) => {
    try {
        const {
            name, address, village, union, upazila, zilla, imamName
        } = req.body;

        const adminId = req.user.userId;

        // 🔐 Step 1: Check if the user already has a mosque
        const existingUser = await User.findById(adminId);
        if (existingUser.mosqueId) {
            return res.status(400).json({
                success: false,
                message: "You already have a mosque. Only one mosque is allowed per admin."
            });
        }

        // ✅ Step 2: Generate mosque code
        const mosqueCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // ✅ Step 3: Create mosque
        const newMosque = new Mosque({
            name,
            address,
            village,
            union,
            upazila,
            zilla,
            imamName,
            mosqueCode,
            adminId,
            members: [adminId]
        });
        await newMosque.save();

        // ✅ Step 4: Make user an admin and assign mosqueId
        existingUser.isAdmin = true;
        existingUser.mosqueId = newMosque._id;
        await existingUser.save();

        return res.status(201).json({
            success: true,
            message: 'Mosque created successfully',
            mosqueId: newMosque._id,
            mosqueCode
        });

    } catch (error) {
        console.error('❌ Error creating mosque:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getAllMosques = async (req, res) => {
    try {
        const userId = req.user?.userId; // Only present if token provided

        const mosques = await Mosque.find()
            .select('name mosqueCode address village upazila zilla members');

        const result = mosques.map(mosque => ({
            _id: mosque._id,
            name: mosque.name,
            mosqueCode: mosque.mosqueCode,
            address: mosque.address,
            village: mosque.village,
            upazila: mosque.upazila,
            zilla: mosque.zilla,
            isMember: userId ? mosque.members.includes(userId) : false
        }));

        res.status(200).json({ success: true, mosques: result });
    } catch (error) {
        console.error('❌ Error fetching mosques:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET /api/mosques/:id
exports.getMosqueById = async (req, res) => {
    const mosqueId = req.params.id;

    try {
        const mosque = await Mosque.findById(mosqueId);

        if (!mosque) {
            return res.status(404).json({ message: 'Mosque not found' });
        }

        res.status(200).json(mosque);
    } catch (err) {
        console.error('Error fetching mosque:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
// GET /api/my-mosque
exports.getMyMosque = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user || !user.mosqueId) {
            return res.status(404).json({ success: false, message: "You don't belong to any mosque yet." });
        }

        const mosque = await Mosque.findById(user.mosqueId).populate('adminId', 'fullName email');
        if (!mosque) {
            return res.status(404).json({ success: false, message: "Mosque not found" });
        }

        res.status(200).json({ success: true, mosque });
    } catch (error) {
        console.error("❌ Error fetching my mosque:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

