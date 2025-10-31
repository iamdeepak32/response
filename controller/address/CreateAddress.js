import { pool } from "../../db/conn.js";
import { randomUUID } from "crypto";

export async function CreateAddress(req, res) {
  try {
    const {
      user_id,
      type,
      is_default,
      recipient_name,
      phone,
      address_line_1,
      address_line_2,
      city,
      state_province,
      postal_code,
      country,
      latitude,
      longitude,
    } = req.body;

    if (!user_id || !address_line_1 || !city || !country) {
      return res.status(400).json({
        success: false,
        message: "user_id, address_line_1, city, and country are required",
      });
    }

    const [user] = await pool.query("SELECT id FROM users WHERE id = ?", [user_id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
          
    const id = randomUUID();

    if (is_default) {
      await pool.query("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [user_id]);
    }

    await pool.query(
      `INSERT INTO addresses (
        id, user_id, type, is_default, recipient_name, phone, address_line_1,
        address_line_2, city, state_province, postal_code, country, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        user_id,
        type || "shipping",
        is_default || false,
        recipient_name || null,
        phone || null,
        address_line_1,
        address_line_2 || null,
        city,
        state_province || null,
        postal_code || null,
        country,
        latitude || null,
        longitude || null,
      ]
    );

    res.json({ success: true, message: "Address created successfully", id });
  } catch (err) {
    console.error("Error in CreateAddress:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
