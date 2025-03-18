const express = require("express");
const { countUnreadNotifications } = require("../controllers/patient");
const Notification = require("../models/notificationModel");

const router = express.Router();

// Get notifications for a specific email (doctor or patient)
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({
      $or: [{ doctorEmail: email }, { patientEmail: email }]
    });

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.json({ notifications });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a specific notification
router.delete("/deleteNotification", async (req, res) => {
  try {
    const { doctorEmail, patientEmail } = req.body;
    if (!doctorEmail || !patientEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const deletedNotification = await Notification.findOneAndDelete({ doctorEmail, patientEmail });
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add this route
router.get("/unread/count/:patientEmail", countUnreadNotifications);

module.exports = router;
