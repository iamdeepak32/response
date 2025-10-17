import bcrypt from "bcryptjs";
import { pool } from "../../db/conn.js";

export async function CreateUser(req, res) {
  try {
    const {
      name,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      password,
      assignedCompanies
    } = req.body;
 
    const [emailExists] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (emailExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    let assigned = null;
    if (assignedCompanies) {
      if (Array.isArray(assignedCompanies) && assignedCompanies.length > 0) {
        assigned = String(assignedCompanies[0]);
      } else if (typeof assignedCompanies === "string" && assignedCompanies.trim() !== "") {
        assigned = assignedCompanies.trim();
      }
    }
    
    if (assigned) {
      const [companyExists] = await pool.query(
        "SELECT id FROM users WHERE assignedCompanies = ?",
        [assigned]
      );
      if (companyExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Company with ID "${assigned}" already exists`,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
      (name, firstName, lastName, phoneNumber, companyName, email, password, assignedCompanies, isActive, isDeleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
      [name, firstName, lastName, phoneNumber, companyName, email, hashedPassword, assigned]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}
