const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const promisePool = require('../../db'); 

const JWT_SECRET = 'ZXERE235SSF'; 

router.post('/register', async (req, res) => {
    const { first_name, last_name, email_id, contact_no, gender_id, date_of_birth, password } = req.body;

    if (!first_name || !last_name || !email_id || !password || !contact_no || !gender_id || !date_of_birth) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const sql = 'INSERT INTO users (first_name, last_name, email_id, contact_no, gender_id, date_of_birth, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await promisePool.query(sql, [first_name, last_name, email_id, contact_no, gender_id, date_of_birth, hashedPassword]);

        res.status(200).json({
            status: 200,
            message: "User registered successfully.",
            userId: result.insertId
        });

    } catch (err) {
        console.error("server error:", err);
    }
});

router.post('/login', async (req, res) => {
    const { email_id: identifier, password } = req.body; 

    if (!identifier || !password) {
        return res.status(400).json({ message: "Email/Contact and password are required." });
    }

    try {
        const sql = 'SELECT id, email_id, password FROM users WHERE email_id = ? OR contact_no = ?';
        const [rows] = await promisePool.query(sql, [identifier, identifier]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ id: user.id, email: user.email_id }, JWT_SECRET, { expiresIn: '18h' });

            res.status(200).json({
                status: 200,
                message: "Login successful.",
                token: token,
                userId: user.id
            });
        } else {
            res.status(401).json({ message: "Invalid credentials." });
        }

    } catch (err) {
       console.error("Login error:", err);

    }
});

router.get('/', async (req, res) => { // This route is now /data
    try {
        const [genders] = await promisePool.query("SELECT id, gender_name FROM gender");
        res.status(200).json(genders);
    } catch (err) {
        console.error("Data fetch error:", err);
        res.status(500).json({ message: "Failed to fetch data." });
    }
});

module.exports = router;