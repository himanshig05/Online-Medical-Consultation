const express = require("express");
const { getPastSearches, storeSearch} = require("../controllers/searchControllers");

const router = express.Router();

router.post("/storeSearch", storeSearch);
router.get("/getPastSearches/:userId/:query", getPastSearches);

module.exports = router;