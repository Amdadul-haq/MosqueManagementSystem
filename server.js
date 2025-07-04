const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const donationRoutes = require('./routes/donationRoutes');
const userRoutes = require("./routes/userRoutes");
const mosqueRoutes = require('./routes/mosqueRoutes');
const joinRequestRoutes = require('./routes/joinRequestRoutes');
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/mosques', mosqueRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRoutes);


app.use('/api', donationRoutes);

app.get("/", (req, res) => {
    res.send("Mosque Management System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
