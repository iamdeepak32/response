import { pool } from "../../db/conn.js";

export async function DeleteCompany(req, res) {
  const id = parseInt(req.params.id, 10);

  try {
    const [result] = await pool.query("DELETE FROM company WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
