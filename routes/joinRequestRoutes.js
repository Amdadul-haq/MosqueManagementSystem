const express = require("express");
const router = express.Router();
const joinRequestController = require("../controllers/joinRequestController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send", authMiddleware, joinRequestController.sendJoinRequest);
router.get("/pending", authMiddleware, joinRequestController.getPendingRequests);
router.put("/approve/:requestId", authMiddleware, joinRequestController.approveRequest);
router.put("/reject/:requestId", authMiddleware, joinRequestController.rejectRequest);

module.exports = router;
