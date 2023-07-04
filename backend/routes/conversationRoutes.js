const express = require("express");
const Conversation = require("../models/conversationModel");

const router = express.Router();

// new conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderEmail, req.body.receiverEmail],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:userEmail", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userEmail] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;