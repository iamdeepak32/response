import bcrypt from "bcryptjs";
import { pool } from "../../db/conn";

export async function GetUsers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, firstName, lastName, phoneNumber, companyName, email, isActive, isDeleted FROM users"
    );
    res.json({ success: true, message: "Fetched users successfully", data: rows });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
