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

