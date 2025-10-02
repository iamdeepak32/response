const mysql = require("mysql2/promise");
const express = require("express");
const e = require("express");
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
    console.log("Connected to MySQL ");

    app.post("/", async (req, res) => {
      const { name, firstName, lastName, phoneNumber, companyName, email, password } = req.body;

      try {
        const query = `
          INSERT INTO users (name, firstName, lastName, phoneNumber, companyName, email, password)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(query, [name, firstName, lastName, phoneNumber, companyName, email, password]);

        res.status(201).json({ message: "User added successfully" });
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(409).json({ message: "Email already exists. Please use another email." });
        } else {
          res.status(500).json({ message: "DB insert failed", error: err.message });
        }
      }
    });

    app.get("/", async (req, res) => {
      try {
        const [rows] = await connection.execute("SELECT * FROM users ORDER BY id ASC");

        if (rows.length === 0) {
          return res.status(200).json({ message: "No users found", data: [] });
        }

        res.status(200).json({ message: "Get successful", data: rows });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "DB fetch failed", error: dbError.message });
      }
    });
               
    app.put("/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is missing" });
      }

      const { name, email, password, firstName, lastName, phoneNumber, companyName } = req.body;

      try {
        const fields = [];
        const values = [];

        if (name) { fields.push("name=?"); values.push(name); }
        if (email) { fields.push("email=?"); values.push(email); }
        if (password) { fields.push("password=?"); values.push(password); }
        if (firstName) { fields.push("firstName=?"); values.push(firstName); }
        if (lastName) { fields.push("lastName=?"); values.push(lastName); }
        if (phoneNumber) { fields.push("phoneNumber=?"); values.push(phoneNumber); }
        if (companyName) { fields.push("companyName=?"); values.push(companyName); }

        if (fields.length === 0) {
          return res.status(400).json({ message: "No fields to update" });
        }

        values.push(id);

        const query = `UPDATE users SET ${fields.join(", ")} WHERE id=?`;

        const [result] = await connection.execute(query, values);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully" });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "DB update failed", error: dbError.message });
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
   
