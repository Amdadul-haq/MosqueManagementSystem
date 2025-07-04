const Mosque = require('../models/Mosque');
const User = require('../models/User');
const crypto = require('crypto');

// ✅ Create a mosque
exports.createMosque = async (req, res) => {
    try {
        const {
            name, address, village, union, upazila, zilla, imamName
        } = req.body;

        const mosqueCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-digit code
        const adminId = req.user.userId; // ✅ Corrected

        // ✅ Step 1: Make user an admin
        await User.findByIdAndUpdate(adminId, { isAdmin: true });

        // ✅ Step 2: Create mosque
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

// ✅ Join mosque by code
exports.joinMosque = async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user.userId; // ✅ FIXED here

        const mosque = await Mosque.findOne({ mosqueCode: code });

        if (!mosque) {
            return res.status(404).json({ success: false, message: 'Mosque not found' });
        }

        if (mosque.members.includes(userId)) {
            return res.status(400).json({ success: false, message: 'Already joined' });
        }

        mosque.members.push(userId);
        await mosque.save();

        res.json({
            success: true,
            message: 'Joined mosque successfully',
            mosqueId: mosque._id
        });
    } catch (error) {
        console.error('Join mosque error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ✅ Get all mosques for join list
exports.getAllMosques = async (req, res) => {
    try {
        const mosques = await Mosque.find()
            .select('name mosqueCode address village upazila zilla'); // public info only

        res.status(200).json({ success: true, mosques });
    } catch (error) {
        console.error('❌ Error fetching mosques:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
