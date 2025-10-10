import bcrypt from "bcryptjs";
import { pool } from "../../db/conn";

export async function CreateUser(req, res) {
  try {
    const { name, firstName, lastName, phoneNumber, companyName, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, firstName, lastName, phoneNumber, companyName, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, firstName, lastName, phoneNumber, companyName, email, hashedPassword]
    );

    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

