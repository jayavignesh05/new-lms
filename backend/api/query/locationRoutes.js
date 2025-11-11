const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// Get all countries
router.get("/countries", async (req, res) => {
  try {
    const sql = "SELECT id, name FROM countries ORDER BY name ASC";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
    
    res.status(500).json({ error: "Database query failed" });
  }
});

/// Get states by country ID
// 1. Inga 'async' add pannunga
router.post("/states", async (req, res) => {
  try { // 2. 'try' block start pannunga
    const { country_id } = req.body;

    // Oru chinna improvement: country_id illana error anupunga
    if (!country_id) {
        return res.status(400).json({ error: "country_id is required" });
    }

    const query = "SELECT id, name FROM states WHERE country_id = ? ORDER BY name ASC";

    // 3. Ippadi 'await' panni data va vaangunga
    //    'results' la unga data array irukum
    const [results, fields] = await promisePool.query(query, [country_id]);

    // 4. 'results.length' vachi check pannunga (results[0].length illa)
    if (results.length === 0) {
      return res.status(404).json({ message: "No states found for this country" });
    }

    // 5. 'results' ah direct ah anupunga (results[0] illa)
    res.status(200).json(results);

  } catch (err) { // 6. Error vantha, inga 'catch' pannidalam
   
    return res.status(500).json({ error: "Database query failed" });
  }
});

// Get all genders
router.get("/genders", async (req, res) => {
  try {
    const sql = "SELECT * FROM gender";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
    
    res.status(500).json({ error: "Database query failed" });
  }
});

// Get all current statuses
router.get("/currentstatus", async (req, res) => {
  try {
    const sql = "SELECT id, name FROM current_status ORDER BY name ASC";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching current statuses:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Get all institutes
router.get("/institutes", async (req, res) => {
  try {
    const sql = "SELECT id, name FROM institutes ORDER BY name ASC";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
  
    res.status(500).json({ error: "Database query failed" });
  }
});

// Insert a new institute
router.post("/newinstitutes", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name are required" });
  }

  try {
    const sql = "INSERT INTO institutes (name) VALUES (?)";
    const [result] = await promisePool.query(sql, [name]);
    res.status(201).json({
      message: "Institute added successfully",
      instituteId: result.insertId,
    });
  } catch (error) {
   
    res.status(500).json({ error: "Database query failed" });
  }
});

// Get all degrees
router.get("/degrees", async (req, res) => {
  try {
    const sql = "SELECT id, name FROM degrees ORDER BY name ASC";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Insert a new degree
router.post("/newdegrees", async (req, res) => {

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required for insert" });
  }

  try {
    const sql = "INSERT INTO degrees (name) VALUES (?)";
    await promisePool.query(sql, [name]);
    res.status(200).json({ message: "Degree updated successfully" });
  } catch (error) {
    console.error("Error updating degree:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Get all companies
router.get("/companies", async (req, res) => {
  try {
    const sql = "SELECT id, name FROM companies ORDER BY name ASC";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Insert a new company
router.post("/newcompanies", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required for insert" });
  }

  try {
    const sql = "INSERT INTO companies (name) VALUES (?)";
    const [result] = await promisePool.query(sql, [name]);
    res.status(201).json({
      message: "Company added successfully",
      companyId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting company:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Get all designations
router.get("/designations", async (req, res) => {
  try {
    const sql = "SELECT id, name FROM designations ORDER BY name ASC";
    const [results] = await promisePool.query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching designations:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Insert a new designation
router.post("/newdesignations", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required for insert" });
  }

  try {
    const sql = "INSERT INTO designations (name) VALUES (?)";
    const [result] = await promisePool.query(sql, [name]);
    res.status(201).json({
      message: "Designation added successfully",
      designationId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting designation:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;