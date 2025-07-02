const Mosque = require('../models/Mosque');
const crypto = require('crypto');

exports.createMosque = async (req, res) => {
    try {
        const {
            name, address, village, union, upazila, zilla, imamName
        } = req.body;

        const mosqueCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-digit code
        const adminId = req.user.userId;

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
        console.error('Error creating mosque:', error);
        console.error('❌ Error creating mosque:', error); // ✅ Add this
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.joinMosque = async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user._id;

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
