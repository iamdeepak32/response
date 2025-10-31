import { pool } from "../../db/conn.js";

export async function DeleteAddress(req, res) {
  try {
    const id = req.params.id;

    const [result] = await pool.query("DELETE FROM addresses WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error("Error in DeleteAddress:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
