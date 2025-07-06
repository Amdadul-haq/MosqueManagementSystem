const Expense = require("../models/Expense");
const Mosque = require("../models/Mosque");
const User = require("../models/User");

// 🔸 POST /api/expenses
exports.createExpense = async (req, res) => {
    try {
        const { title, amount, type, description, date, mosqueId } = req.body;

        if (!title || !amount || !type || !date || !mosqueId) {
            return res.status(400).json({ success: false, message: "All required fields must be filled" });
        }

        const user = await User.findById(req.user.userId);
        const mosque = await Mosque.findById(mosqueId);

        if (!mosque) {
            return res.status(404).json({ success: false, message: "Mosque not found" });
        }

        const isMember = mosque.members.includes(user._id);
        const isAdmin = user.isAdmin && user.mosqueId?.toString() === mosqueId;

        if (!isMember && !isAdmin) {
            return res.status(403).json({ success: false, message: "You are not authorized for this mosque" });
        }

        const newExpense = new Expense({
            title,
            amount: parseFloat(amount),
            type,
            description,
            date: new Date(date), // string from frontend → JS Date
            mosqueId,
            createdBy: user._id
        });

        await newExpense.save();

        res.status(201).json({ success: true, message: "Expense recorded successfully", expense: newExpense });
    } catch (error) {
        console.error("❌ Error creating expense:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getExpensesByMonth = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const { mosqueId, month, type } = req.query;

        if (!mosqueId || !month) {
            return res.status(400).json({ success: false, message: "mosqueId and month are required" });
        }

        const mosque = await Mosque.findById(mosqueId);
        if (!mosque) {
            return res.status(404).json({ success: false, message: "Mosque not found" });
        }

        const isMember = mosque.members.includes(user._id);
        const isAdmin = user.isAdmin && user.mosqueId?.toString() === mosqueId;

        if (!isMember && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized for this mosque" });
        }

        // 🗓️ Parse month string: "July 2025"
        const startDate = new Date(month);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // 📦 Build query
        const query = {
            mosqueId,
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        };

        if (type) {
            query.type = type;
        }

        const expenses = await Expense.find(query).sort({ date: -1 });

        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        res.status(200).json({
            success: true,
            expenses,
            totalExpense,
        });

    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
  
