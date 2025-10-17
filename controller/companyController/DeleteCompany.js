import { pool } from "../../db/conn.js";

export async function DeleteCompany(req, res) {
  const id = parseInt(req.params.id, 10); 

  try {
    const [company] = await pool.query("SELECT * FROM company WHERE id = ?", [id]);
    if (company.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const [deletedUsers] = await pool.query(
      "DELETE FROM users WHERE assignedCompanies = ?",
      [id]
    );

    const [deletedCompany] = await pool.query("DELETE FROM company WHERE id = ?", [id]);

    res.json({
      success: true,
      message: `Company deleted successfully. ${deletedUsers.affectedRows} user(s) also deleted.`,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
