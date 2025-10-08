const pool = require("../../db/conn");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
