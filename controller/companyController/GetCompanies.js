import { pool } from "../../db/conn.js";

export async function GetCompanies(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM company");

    const formattedData = rows.map(item => ({
      ...item,
      isActive: item.isActive === 1,
      isDeleted: item.isDeleted === 1
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}
