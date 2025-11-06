// controller/userController/sendinvitation.js
import { pool } from "../../db/conn.js";
import { sendInvitationEmail } from "../utils/sendMessage.js";

export async function sendinvitation(req, res) {
  try {
    const userId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    await sendInvitationEmail(user);

    res.json({
      success: true,
      message: `Invitation email sent successfully to ${user.email}`,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send invitation",
      error: error.message,
    });
  }
}
