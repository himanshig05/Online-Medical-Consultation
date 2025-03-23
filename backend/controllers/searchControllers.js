const redisClient = require("../utils/redis");

// Store a search term for a user
const storeSearch = async (req, res) => {
  try {
    const { userId, searchTerm } = req.body;
    if (!userId || !searchTerm) {
      return res.status(400).json({ error: "userId and searchTerm are required" });
    }

    const key = `user:${userId}:searches`;
    const existingSearches = await redisClient.lRange(key, 0, -1);

    if (!existingSearches.includes(searchTerm)) {
      await redisClient.lPush(key, searchTerm); // Add to the start of the list
      await redisClient.lTrim(key, 0, 9); // Keep only the last 10 searches
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error storing search:", error);
    res.status(500).json({ error: "Failed to store search term" });
  }
};

const getPastSearches = async (req, res) => {
  try {
    console.log("Received request for past searches.");

    const userId = req.params.userId;
    const query = req.params.query;
    
    console.log("Extracted userId:", userId);
    console.log("Extracted query:", query);

    if (!userId) {
      console.error("Error: userId is missing");
      return res.status(400).json({ error: "userId is required" });
    }

    
    const key = `user:${userId}:searches`;
    console.log(`Generated Redis key: ${key}`);

    console.log(`Fetching search history from Redis for key: ${key}`);
    const searches = await redisClient.lRange(key, 0, -1);

    console.log("Raw searches from Redis:", searches);
    if (!searches || searches.length === 0) {
      console.warn(`No searches found for user: ${userId}`);
    }

    
    const filteredSearches = query
      ? searches.filter((search) =>
          search.toLowerCase().startsWith((query || "").toLowerCase())
        )
      : searches;

    console.log("Filtered searches ");
    res.json(filteredSearches);
    console.log("Response sent successfully.");
  } catch (error) {
    console.error("Error fetching past searches:", error);
    res.status(500).json({ error: "Failed to fetch past searches" });
  }
};




module.exports = { storeSearch, getPastSearches };

