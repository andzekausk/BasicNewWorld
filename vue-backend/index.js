const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const admin = require("firebase-admin");
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

// const users = [
//     { id: 1, username: "user", password: bcrypt.hashSync("user123", 10), role: "user" },
//     { id: 2, username: "admin", password: bcrypt.hashSync("admin123", 10), role: "admin" }
// ];

// const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

app.get("/", (req, res) => {
  res.json({ message: "Hello World from Backend!" });
});

// Login Route
app.post("/login", async (req, res) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;
        const domain = email.split("@")[1];

        const allowedDomains = await getAllowedDomains();
        const isAdmin = allowedDomains.includes(domain);

        res.json({ email, isAdmin });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
    // const user = users.find(u => u.username === username);
    // if (!user || !bcrypt.compareSync(password, user.password)) {
    //     return res.status(401).json({ message: "Invalid credentials" });
    // }
    // const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    // res.json({ token, role: user.role });
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
