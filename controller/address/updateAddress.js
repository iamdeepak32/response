import { pool } from "../../db/conn.js";

export async function updateAddress(req, res) {
  try {
    const { id } = req.params;
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

    const [address] = await pool.query("SELECT * FROM addresses WHERE id = ?", [id]);
    if (address.length === 0) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (is_default) {
      await pool.query("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [user_id]);
    }

    await pool.query(
      `UPDATE addresses 
       SET type = ?, is_default = ?, recipient_name = ?, phone = ?, 
           address_line_1 = ?, address_line_2 = ?, city = ?, state_province = ?, 
           postal_code = ?, country = ?, latitude = ?, longitude = ?
       WHERE id = ?`,
      [
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
        id,
      ]
    );

    res.json({ success: true, message: "Address updated successfully" });
  } catch (err) {
    console.error("Error in updateAddress:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
 