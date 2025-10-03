const mysql = require("mysql2/promise");
const express = require("express");
const bcrypt = require("bcryptjs"); 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

async function startServer() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "deepak123",
      database: "detail",
    });

    const [tables] = await connection.query("SHOW TABLES");
    console.log("Tables in database:", tables);
    console.log("Connected to MySQL");

    app.post("/", async (req, res) => {
      const { name, firstName, lastName, phoneNumber, companyName, email, password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      try {
        const [nameRows] = await connection.execute("SELECT id FROM users WHERE name = ?", [name]);
        if (nameRows.length > 0) {
          return res.status(400).json({ message: "Name already exists. Please use another name." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
          INSERT INTO users (name, firstName, lastName, phoneNumber, companyName, email, password)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(query, [name, firstName, lastName, phoneNumber, companyName, email, hashedPassword]);

        res.status(201).json({ message: "User added successfully" });
      } catch (err) {
        res.status(500).json({ message: "DB insert failed", error: err.message });
      }
    });

    app.get("/", async (req, res) => {
      try {
        const [rows] = await connection.execute(
          "SELECT id, name, firstName, lastName, phoneNumber, companyName, email FROM users ORDER BY id ASC"
        );

        if (rows.length === 0) {
          return res.status(200).json({ message: "No users found", data: [] });
        }

        res.status(200).json({ message: "Get successful", data: rows });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "DB fetch failed", error: dbError.message });
      }
    });

    app.put("/api/user/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);
      const { name, email, password, firstName, lastName, phoneNumber, companyName } = req.body;

      try {
        const [existingUserRows] = await connection.execute("SELECT * FROM users WHERE id = ?", [id]);
        if (existingUserRows.length === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) {
          const [nameRows] = await connection.execute("SELECT id FROM users WHERE name = ?", [name]);
          if (nameRows.length > 0 && nameRows[0].id !== id) {
            return res.status(400).json({ success: false, message: "Name already exists" });
          }
        }

        const fields = [];
        const values = [];

        if (name) { fields.push("name=?"); values.push(name); }
        if (email) { fields.push("email=?"); values.push(email); } 
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          fields.push("password=?"); values.push(hashedPassword);
        }
        if (firstName) { fields.push("firstName=?"); values.push(firstName); }
        if (lastName) { fields.push("lastName=?"); values.push(lastName); }
        if (phoneNumber) { fields.push("phoneNumber=?"); values.push(phoneNumber); }
        if (companyName) { fields.push("companyName=?"); values.push(companyName); }

        if (fields.length === 0) {
          return res.status(400).json({ success: false, message: "No fields to update" });
        }

        values.push(id);

        await connection.execute(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, values);

        const [updatedRows] = await connection.execute(
          "SELECT id, name, email, firstName, lastName, phoneNumber, companyName FROM users WHERE id = ?",
          [id]
        );

        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: updatedRows[0]
        });

      } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
      }
    });

    app.delete("/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);

      try {
        const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "DB delete failed", error: dbError.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}

startServer();
