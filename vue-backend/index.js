const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
    { id: 1, username: "user", password: bcrypt.hashSync("user123", 10), role: "user" },
    { id: 2, username: "admin", password: bcrypt.hashSync("admin123", 10), role: "admin" }
];

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

app.get("/", (req, res) => {
  res.json({ message: "Hello World from Backend!" });
});

// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, role: user.role });
});

// Protected Route Example (Admin Only)
app.get("/admin", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
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
