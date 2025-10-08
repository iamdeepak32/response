const pool = require("../../db/conn");

module.exports = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE isDeleted = 0");
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error("GetUsers Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
