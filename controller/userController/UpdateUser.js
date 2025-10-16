import bcrypt from "bcryptjs";
import { pool } from "../../db/conn.js";

export async function UpdateUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const updates = { ...req.body };

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
      }

      const [emailExists] = await pool.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [updates.email, id]
      );
      if (emailExists.length > 0) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

if (Object.prototype.hasOwnProperty.call(updates, "assignedCompanies")) {
  let assigned = updates.assignedCompanies;

  if (Array.isArray(assigned)) {
    assigned = assigned.length > 0 ? assigned[0] : null;
  } else if (typeof assigned === "string") {
    assigned = assigned.trim();
  }

  if (assigned === "" || assigned === null || assigned === undefined) {
    delete updates.assignedCompanies;
  } else {
    updates.assignedCompanies = String(assigned);
  }
}


    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((key) => updates[key]);
    values.push(id);

    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);

    const [updated] = await pool.query(
      "SELECT id, name, firstName, lastName, phoneNumber, companyName, email, assignedCompanies, isActive, isDeleted FROM users WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: updated[0],
    });
  } catch (err) {
    console.error("Error in UpdateUser:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
