const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const donationRoutes = require('./routes/donationRoutes');
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));

app.use('/api', donationRoutes);

app.get("/", (req, res) => {
    res.send("Mosque Management System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
