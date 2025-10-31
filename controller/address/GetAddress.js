import { pool } from "../../db/conn.js";

export async function GetAddress(req, res) {
  try {
    const userId = req.params.userId;

    const [rows] = await pool.query("SELECT * FROM addresses WHERE user_id = ?", [userId]);

    res.json({
      success: true,
      message: "Fetched addresses successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Error in GetAddress:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
