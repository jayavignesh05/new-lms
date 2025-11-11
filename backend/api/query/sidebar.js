const express = require("express");
const router = express.Router();
const promisePool = require("../../db");


router.get("/sidebar", async (req, res) => {
  try {
    const sql = "SELECT * FROM master_app_module";
    const [rows] = await promisePool.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching sidebar data:", err);
    res.status(500).json({ message: "Failed to fetch sidebar data." });
  }
});

module.exports = router;