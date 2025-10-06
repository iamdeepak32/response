const mysql = require("mysql2/promise");
const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

function sendResponse(res, success, message, data = null, statusCode = 200) {
  res.status(statusCode).json({ success, message, data });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function startServer() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "deepak123",
      database: "detail",
    });

    console.log(" Connected to MySQL");

   app.post("/", async (req, res) => {
  const {
    name,
    firstName,
    lastName,
    phoneNumber,
    companyName,
    email,
    password,
    isActive = true,
    isDeleted = false,
  } = req.body;

  if (!password) return sendResponse(res, false, "Password is required", null, 400);
  if (!email || !isValidEmail(email)) return sendResponse(res, false, "Invalid email format", null, 400);

  try {
    const [nameRows] = await connection.execute("SELECT id FROM users WHERE name = ?", [name]);
    if (nameRows.length > 0)
      return sendResponse(res, false, "Name already exists. Please use another name.", null, 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, firstName, lastName, phoneNumber, companyName, email, password, isActive, isDeleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      name,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      hashedPassword,
      isActive,
      isDeleted,
    ]);

    sendResponse(res, true, "User added successfully", null, 201);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      if (err.message.includes("users.email")) {
        return sendResponse(res, false, "Email already exists. Please use another email.", null, 400);
      } else if (err.message.includes("users.name")) {
        return sendResponse(res, false, "Name already exists. Please use another name.", null, 400);
      }
    }

    sendResponse(res, false, "DB insert failed", { error: err.message }, 500);
  }
});


   app.get("/", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT id, name, firstName, lastName, phoneNumber, companyName, email, isActive, isDeleted FROM users ORDER BY id ASC"
    );

    const users = rows.map((user) => ({
      ...user,
      isActive: Boolean(user.isActive),
      isDeleted: Boolean(user.isDeleted),
    }));

    if (users.length === 0) {
      return sendResponse(res, true, "No users found", []);
    }

    sendResponse(res, true, "Get successful", users);
  } catch (err) {
    sendResponse(res, false, "DB fetch failed", { error: err.message }, 500);
  }
});


    app.put("/api/user/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);
      const { name, email, password, firstName, lastName, phoneNumber, companyName, isActive, isDeleted } = req.body;

      try {
        const [existingUserRows] = await connection.execute("SELECT * FROM users WHERE id = ?", [id]);
        if (existingUserRows.length === 0)
          return sendResponse(res, false, "User not found", null, 404);

        if (email && !isValidEmail(email))
          return sendResponse(res, false, "Invalid email format", null, 400);
            
        if (name) {
          const [nameRows] = await connection.execute("SELECT id FROM users WHERE name = ?", [name]);
          if (nameRows.length > 0 && nameRows[0].id !== id)
            return sendResponse(res, false, "Name already exists", null, 400);
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
        if (isActive !== undefined) { fields.push("isActive=?"); values.push(isActive); }
        if (isDeleted !== undefined) { fields.push("isDeleted=?"); values.push(isDeleted); }

        if (fields.length === 0)
          return sendResponse(res, false, "No fields to update", null, 400);

        values.push(id);
        await connection.execute(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, values);

        const [updatedRows] = await connection.execute(
          "SELECT id, name, email, firstName, lastName, phoneNumber, companyName, isActive, isDeleted FROM users WHERE id = ?",
          [id]
        );

        sendResponse(res, true, "User updated successfully", updatedRows[0]);
      } catch (err) {
        sendResponse(res, false, "Server error", { error: err.message }, 500);
      }
    });

    app.delete("/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);

      try {
        const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0)
          return sendResponse(res, false, "User not found", null, 404);

        sendResponse(res, true, "User deleted successfully", null);
      } catch (err) {
        sendResponse(res, false, "DB delete failed", { error: err.message }, 500);
      }
    });

    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}

startServer();




