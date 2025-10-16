import bcrypt from "bcryptjs";
import { pool } from "../../db/conn.js";

export async function UpdateCompany(req, res) {
  const id = parseInt(req.params.id, 10);
  const updates = req.body;

  try {
    const [existing] = await pool.query("SELECT * FROM company WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const setClause = fields.map(field => `${field} = ?`).join(", ");
    const values = fields.map(key => updates[key]);
    values.push(id);

    await pool.query(`UPDATE company SET ${setClause} WHERE id = ?`, values);

    res.json({ success: true, message: "Company updated successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
