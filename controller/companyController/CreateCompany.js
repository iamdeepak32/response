import bcrypt from "bcryptjs";
import { pool } from "../../db/conn.js";

export async function CreateCompany(req, res) {
  try {
    const { companyName, companyId, sapUrl, password, databaseName } = req.body;

    if (!companyName || !companyId || !password) {
      return res.status(400).json({ success: false, message: "companyName, companyId, and password are required" });
    }

    const [existing] = await pool.query("SELECT * FROM company WHERE companyId = ? OR companyName = ?", [companyId, companyName]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Company already exists" });
    }
             
    const hashedPassword = await bcrypt.hash(password, 10);
          
    await pool.query(
      "INSERT INTO company (companyName, companyId, sapUrl, password, databaseName) VALUES (?, ?, ?, ?, ?)",
      [companyName, companyId, sapUrl, hashedPassword, databaseName]
    );
              
    res.json({ success: true, message: "Company created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
