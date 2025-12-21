const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // Database connection
const app = express();
// Render assigns a port automatically in process.env.PORT, fallback to 7000 for local
const PORT = process.env.PORT || 7000; 

// 1. Increase Payload Limit (For Images/Files)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 2. Enable CORS with Specific Origins (More Secure & Reliable)
const allowedOrigins = [
  "https://students-learning-web.vercel.app", // Your Production Frontend
  "http://localhost:5173",                    // Your Vite Localhost
  "http://localhost:7000"                     // Alternative Localhost
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Important if you add login/cookies later
}));

// 3. Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    // DB Connection Check (Optional debug log)
    console.log("⏳ Connecting to Database...");
    
    // Mount API Routes
    app.use("/api", require("./api/query/index"));

    app.listen(PORT, () => {
      console.log(`✅ Server running on Port: ${PORT}`);
      console.log(`✅ Database Status: Connected`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err);
  }
})();