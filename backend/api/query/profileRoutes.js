const express = require("express");
const router = express.Router();
const promisePool = require("../../db");
const verifyToken = require("../middleware/verifyToken");
const multer = require('multer'); // Import multer
const path = require('path'); // Import path module

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this directory exists in your backend project root
    cb(null, 'uploads/profile_pics/'); 
  },
  filename: (req, file, cb) => {
    // Use originalname and append timestamp to avoid conflicts
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const showProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const sql = `
      SELECT 
          u.id AS user_id, u.first_name, u.last_name, u.email_id, u.contact_no, u.date_of_birth, u.current_status_id,
          a.id AS address_id, a.address, a.door_no, 
          a.street, a.area, a.city, a.pincode, a.countries_id, a.state_id,
          g.gender_name,
          g.id,
          
          cs.name AS current_status_name,
        
          c.name AS country_name,
          s.name AS state_name
      FROM 
          users AS u
      LEFT JOIN
          gender AS g ON u.gender_id = g.id
      LEFT JOIN
          current_status AS cs ON u.current_status_id = cs.id
      LEFT JOIN 
          addresses AS a ON u.id = a.user_id
      LEFT JOIN
          countries AS c ON a.countries_id = c.id
      LEFT JOIN
          states AS s ON a.state_id = s.id

      WHERE 
          u.id = ?;
    `;

    const [results] = await promisePool.query(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = {
      user_id: results[0].user_id,
      first_name: results[0].first_name,
      last_name: results[0].last_name,
      email: results[0].email_id,
      contact_no: results[0].contact_no,
      gender: results[0].gender_name,
      gender_id: results[0].id,

      date_of_birth: results[0].date_of_birth,
      current_status_id: results[0].current_status_id,
      current_status_name: results[0].current_status_name,
      addresses: [],
    };

    results.forEach((row) => {
      if (row.address_id) {
        userProfile.addresses.push({
          address_id: row.address_id,
          label: row.address,
          door_no: row.door_no,
          street: row.street,
          area: row.area,
          city: row.city,
          pincode: row.pincode,
          country_name: row.country_name,
          countries_id: row.countries_id,
          state_name: row.state_name,
          state_id: row.state_id,
        });
      }
    });

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Profile data fetch error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.userId;
  const {
    first_name,
    last_name,
    email_id,
    contact_no,
    gender_id,
    date_of_birth,
    current_status_id,
    addresses,
  } = req.body;

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    const userUpdateSql = `
            UPDATE users 
            SET first_name = ?, last_name = ?, email_id = ?, contact_no = ?, gender_id = ?, date_of_birth = ?, current_status_id = ?
            WHERE id = ?;
        `;
    await connection.query(userUpdateSql, [
      first_name,
      last_name,
      email_id,
      contact_no,
      gender_id,
      date_of_birth,
      current_status_id,
      userId,
    ]);

    if (addresses && Array.isArray(addresses)) {
      for (const address of addresses) {
        if (address.address_id) {
          const addressUpdateSql = `
                        UPDATE addresses 
                        SET address = ?, door_no = ?, street = ?, area = ?, city = ?, pincode = ?, countries_id = ?, state_id = ?
                        WHERE id = ? AND user_id = ?;
                    `;
          await connection.query(addressUpdateSql, [
            address.label,
            address.door_no,
            address.street,
            address.area,
            address.city,
            address.pincode,
            address.countries_id,
            address.state_id,
            address.address_id,
            userId,
          ]);
        } else {
          const addressInsertSql = `
                        INSERT INTO addresses (user_id, address, door_no, street, area, city, pincode, countries_id, state_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `;
          await connection.query(addressInsertSql, [
            userId,
            address.label,
            address.door_no,
            address.street,
            address.area,
            address.city,
            address.pincode,
            address.countries_id,
            address.state_id,
          ]);
        }
      }
    }

    await connection.commit();
    res
      .status(200)
      .json({ message: "Profile and addresses updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Profile update transaction error:", error);
    res
      .status(500)
      .json({ error: "Database query failed during profile update." });
  } finally {
    connection.release();
  }
};

const insertProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    email_id,
    contact_no,
    gender_id,
    date_of_birth,
    current_status_id,
    password,
    addresses,
  } = req.body;

  if (!first_name || !last_name || !email_id || !password || !contact_no) {
    return res
      .status(400)
      .json({ message: "Required user fields are missing." });
  }

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Insert user details
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userInsertSql =
      "INSERT INTO users (first_name, last_name, email_id, contact_no, gender_id, date_of_birth, current_status_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [userResult] = await connection.query(userInsertSql, [
      first_name,
      last_name,
      email_id,
      contact_no,
      gender_id,
      date_of_birth,
      current_status_id,
      hashedPassword,
    ]);
    const newUserId = userResult.insertId;

    // Step 2: Insert addresses if they exist
    if (addresses && Array.isArray(addresses)) {
      for (const address of addresses) {
        const addressInsertSql = `
          INSERT INTO addresses (user_id, address, door_no, street, area, city, pincode, countries_id, state_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await connection.query(addressInsertSql, [
          newUserId,
          address.label,
          address.door_no,
          address.street,
          address.area,
          address.city,
          address.pincode,
          address.countries_id,
          address.state_id,
        ]);
      }
    }

    await connection.commit();
    res
      .status(201)
      .json({ message: "Profile created successfully.", userId: newUserId });
  } catch (error) {
    await connection.rollback();
    console.error("Profile insert transaction error:", error);
    res
      .status(500)
      .json({ error: "Database query failed during profile creation." });
  } finally {
    connection.release();
  }
};

const getEducation = async (req, res) => {
  const userId = req.userId;

  try {
    const sql = `
        SELECT 
            E.id,
            E.graduation_date,
            d.name AS degree_name,
            E.institute_id,
            i.name AS institute_name,
            E.location AS institute_location,
            E.degree_id
        FROM 
            user_education AS E
        LEFT JOIN 
            institutes AS i ON E.institute_id = i.id
        LEFT JOIN
                    degrees AS d ON E.degree_id = d.id

        WHERE 
            E.user_id = ?
        ORDER BY 
            E.graduation_date DESC;
    `;

    const [results] = await promisePool.query(sql, [userId]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Education GET Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

const insertEducation = async (req, res) => {
  const userId = req.userId;
  const {
    institute_name,
    institute_location,
    institute_id,
    degree_id,
    graduation_date,
    location_id,
  } = req.body;

  if (!degree_id || !graduation_date) {
    return res.status(400).json({
      message:
        "Required education fields (degree_id, graduation_date) are missing.",
    });
  }

  try {
    let instituteId = institute_id;

    // If no institute_id provided, require institute_name and institute_location and find/insert institute
    if (!instituteId) {
      if (!institute_name || !institute_location) {
        return res.status(400).json({
          message:
            "Either institute_id or both institute_name and institute_location are required.",
        });
      }

      const instituteSelectSql =
        "SELECT id FROM institutes WHERE name = ? AND location = ?";
      const [instituteResult] = await promisePool.query(instituteSelectSql, [
        institute_name,
        institute_location,
      ]);

      if (instituteResult.length === 0) {
        const instituteInsertSql = `
          INSERT INTO institutes (name, location)
          VALUES (?, ?)
        `;
        const [newInstituteResult] = await promisePool.query(
          instituteInsertSql,
          [institute_name, institute_location]
        );
        instituteId = newInstituteResult.insertId;
      } else {
        instituteId = instituteResult[0].id;
      }
    }

    const sql = `
      INSERT INTO user_education (user_id, institute_id, degree_id, graduation_date, location_id)
      VALUES (?, ?, ?, ?, ?);
    `;
    const [result] = await promisePool.query(sql, [
      userId,
      instituteId,
      degree_id,
      graduation_date,
      location_id || null,
    ]);

    res.status(201).json({
      message: "Education added successfully.",
      educationId: result.insertId,
    });
  } catch (error) {
    console.error("Education INSERT Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

const updateEducation = async (req, res) => {
  const userId = req.userId;
  const { id, institute_id, degree_id, graduation_date, location } = req.body;

  if (!id || !institute_id || !degree_id || !graduation_date || !location) {
    return res
      .status(400)
      .json({ message: "Required education fields are missing for update." });
  }

  try {
    const sql = `
      UPDATE user_education 
      SET institute_id = ?, degree_id = ?, graduation_date = ?,location=?
      WHERE id = ? AND user_id = ?;
    `;
    await promisePool.query(sql, [
      institute_id,
      degree_id,
      graduation_date,
      location,
      id,
      userId,
    ]);

    res
      .status(200)
      .json({ message: "Education details updated successfully." });
  } catch (error) {
    console.error("Education UPDATE Error:", error);
    res
      .status(500)
      .json({ error: "Database query failed during education update." });
  }
};

const getExperience = async (req, res) => {
  const userId = req.userId;

  try {
    const sql = `
        SELECT 
            E.id,
            E.joining_date,
            E.relieving_date,
            E.company_id,
            c.name AS company_name,
            E.company_location,
            E.designation_id,
            d.name as designation_name
        FROM 
            user_experience AS E
        LEFT JOIN 
            companies AS c ON E.company_id = c.id
        LEFT JOIN
            designations AS d ON E.designation_id = d.id
        WHERE 
            E.user_id = ?
        ORDER BY 
            E.joining_date DESC;
    `;

    const [results] = await promisePool.query(sql, [userId]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Experience GET Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

const insertExperience = async (req, res) => {
  const userId = req.userId;
  const {
    company_name,
    company_location,
    company_id,
    job_title,
    relieving_data,
    location_id,
  } = req.body;

  if (!job_title || !relieving_data) {
    return res.status(400).json({
      message:
        "Required experience fields (job_title, relieving_data) are missing.",
    });
  }

  try {
    let companyId = company_id;

    if (!companyId) {
      if (!company_name || !company_location) {
        return res.status(400).json({
          message:
            "Either company_id or both company_name and company_location are required.",
        });
      }

      const companySelectSql =
        "SELECT id FROM companies WHERE name = ? AND location = ?";
      const [companyResult] = await promisePool.query(companySelectSql, [
        company_name,
        company_location,
      ]);

      if (companyResult.length === 0) {
        const companyInsertSql = `
          INSERT INTO companies (name, location)
          VALUES (?, ?)
        `;
        const [newCompanyResult] = await promisePool.query(companyInsertSql, [
          company_name,
          company_location,
        ]);
        companyId = newCompanyResult.insertId;
      } else {
        companyId = companyResult[0].id;
      }
    }

    const sql = `
      INSERT INTO user_experience (user_id, company_id, job_title, relieving_data, location_id)
      VALUES (?, ?, ?, ?, ?);
    `;
    const [result] = await promisePool.query(sql, [
      userId,
      companyId,
      job_title,
      relieving_data,
      location_id || null,
    ]);

    res.status(201).json({
      message: "Experience added successfully.",
      experienceId: result.insertId,
    });
  } catch (error) {
    console.error("Experience INSERT Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

const updateExperience = async (req, res) => {
  const userId = req.userId;
  const { id, company_id, job_title, relieving_data, location } = req.body;

  if (!id || !company_id || !job_title || !relieving_data || !location) {
    return res
      .status(400)
      .json({ message: "Required experience fields are missing for update." });
  }

  try {
    const sql = `
      UPDATE user_experience
      SET company_id = ?, job_title = ?, relieving_data = ?, location = ?
      WHERE id = ? AND user_id = ?;
    `;
    await promisePool.query(sql, [
      company_id,
      job_title,
      relieving_data,
      location,
      id,
      userId,
    ]);

    res
      .status(200)
      .json({ message: "Experience details updated successfully." });
  } catch (error) {
    console.error("Experience UPDATE Error:", error);
    res
      .status(500)
      .json({ error: "Database query failed during experience update." });
  }
};

const getProfilePic = async (req, res) => {
  const userId = req.userId;

  try {
    const sql = `
      SELECT 
        profile_pic
      FROM 
        user_profile_pics
      WHERE 
        user_id = ?;
    `;

    const [results] = await promisePool.query(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Profile picture not found." });
    }

    res.status(200).json({ profile_pic: results[0].profile_pic });
  } catch (error) {
    console.error("Get profile picture error:", error);
    res
      .status(500)
      .json({ error: "Database query failed to get profile picture." });
  }
};

const updateProfilePic = async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No profile picture file uploaded." });
  }

  const profilePicPath = req.file.path;

  try {
    // Check if a profile picture already exists for the user
    const selectSql = "SELECT id FROM user_profile_pics WHERE user_id = ?";
    const [rows] = await promisePool.query(selectSql, [userId]);

    if (rows.length > 0) {
      // Update existing entry
      const updateSql = "UPDATE user_profile_pics SET profile_pic = ? WHERE user_id = ?";
      await promisePool.query(updateSql, [profilePicPath, userId]);
    } else {
      // Insert new entry
      const insertSql = "INSERT INTO user_profile_pics (user_id, profile_pic) VALUES (?, ?)";
      await promisePool.query(insertSql, [userId, profilePicPath]);
    }

    res.status(200).json({
      message: "Profile picture updated successfully.",
      filePath: profilePicPath,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({ error: "Database query failed to update profile picture." });
  }
};

router.post("/show", verifyToken, showProfile);
router.put("/update", verifyToken, updateProfile);
router.post("/create", insertProfile);
router.get("/education", verifyToken, getEducation);
router.post("/education", verifyToken, insertEducation);
router.put("/education", verifyToken, updateEducation);
router.get("/experience", verifyToken, getExperience);
router.post("/experience", verifyToken, insertExperience);
router.put("/experience", verifyToken, updateExperience);
router.get("/profile-pic", verifyToken, getProfilePic);
router.post("/profile-pic", verifyToken, upload.single('profile_pic'), updateProfilePic);

module.exports = router;
