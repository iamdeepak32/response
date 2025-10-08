const pool = require("../../db/conn");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { name, firstName, lastName, phoneNumber, companyName, email } = req.body;

  try {
    const sql = `
      UPDATE users 
      SET name = ?, firstName = ?, lastName = ?, phoneNumber = ?, companyName = ?, email = ?
      WHERE id = ? AND isDeleted = 0
    `;
    const [result] = await pool.query(sql, [name, firstName, lastName, phoneNumber, companyName, email, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("UpdateUser Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
