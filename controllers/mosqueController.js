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


// // ✅ Get all mosques for join list
// exports.getAllMosques = async (req, res) => {
//     try {
//         const mosques = await Mosque.find()
//             .select('name mosqueCode address village upazila zilla'); // public info only

//         res.status(200).json({ success: true, mosques });
//     } catch (error) {
//         console.error('❌ Error fetching mosques:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };
// ✅ Updated Get All Mosques with isMember flag
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
