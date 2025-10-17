import bcrypt from "bcryptjs";
import { pool } from "../../db/conn.js";

export async function DeleteUser(req, res) {
  const id = parseInt(req.params.id, 10);

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
      
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

 





