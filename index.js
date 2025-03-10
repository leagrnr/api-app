const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const SECRET_KEY = process.env.SECRET_KEY;
let db;
setTimeout(() => {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }
    console.log("Connected to MySQL");
  });
}, 5000);

const app = express();
app.use(express.json());

app.post("/data", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    const { message } = req.body;
    db.query(
      "INSERT INTO messages (content) VALUES (?)",
      [message],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Database error");
        }
        res.send("Data inserted successfully");
      }
    );
  });
});

app.get("/read", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    db.query("SELECT * FROM messages", (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database error");
      }
      res.send(result);
    });
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API app running on port ${PORT}`);
});
