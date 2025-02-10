const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const admin = require("firebase-admin");
const bcrypt = require('bcrypt');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(require("./firebase-adminsdk.json")), 
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function getAllowedDomains() {
    const [rows] = await pool.query("SELECT domain FROM allowed_domains");
    return rows.map(row => row.domain);
}

async function getUserRoles(username) {
    const [rows] = await pool.query(`
        SELECT roles.name 
        FROM user_roles
        JOIN users ON user_roles.user_id = users.id
        JOIN roles ON user_roles.role_id = roles.id
        WHERE users.username = ?
    `, [username]);

    return rows.map(row => row.name); // Returns an array of roles
}

async function getGoogleUserRoles(email) {
    const [rows] = await pool.query(`
        SELECT roles.name 
        FROM google_user_roles
        JOIN google_users ON google_user_roles.google_user_id = google_users.id
        JOIN roles ON google_user_roles.role_id = roles.id
        WHERE google_users.email = ?
    `, [email]);

    return rows.map(row => row.name); // Returns an array of roles
}
app.get("/", (req, res) => {
  res.json({ message: "Hello World from Backend!" });
});

// Login Route
app.post("/login", async (req, res) => {
    const { idToken, username, password } = req.body;
    if(idToken){    // Firebase
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const email = decodedToken.email;
            const domain = email.split("@")[1];
    
            const allowedDomains = await getAllowedDomains();
            const isAllowed = allowedDomains.includes(domain);
            if(isAllowed){
                console.log("wassup");
            }
            
            if (!isAllowed) {
                return res.status(403).json({ message: "Email domain not allowed" });
            }
            
            const roles = await getGoogleUserRoles(email);

            res.json({email, roles, isAllowed });
        } catch (error) {
            console.error("Error verifying token:", error);
            res.status(401).json({ message: "Unauthorized" });
        }
    } else if (username && password){   //MySql
        try{
            const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
            if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

            const user = rows[0];
            if (!bcrypt.compareSync(password, user.password_hash)) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const roles = await getUserRoles(user.username);
            return res.json({ email: user.email, roles, isAllowed: true });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

});

// Protected Route Example (Admin Only)
app.get("/admin", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });

        res.json({ message: "Welcome, Admin!" });
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
