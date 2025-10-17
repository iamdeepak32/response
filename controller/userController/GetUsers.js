import { pool } from "../../db/conn.js";

export async function GetUsers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, firstName, lastName, phoneNumber, companyName, email, assignedCompanies, isActive, isDeleted FROM users"
    );

    const users = rows.map(user => {
      let parsed = [];

      if (user.assignedCompanies) {
        parsed = [Number(user.assignedCompanies)];
      }

      return {
        ...user,
        assignedCompanies: parsed
      };
    });
           
    res.json({
      success: true,
      message: "Fetched users successfully",
      data: users
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
}
