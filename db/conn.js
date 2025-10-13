import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "deepak123",
  database: "detail",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

