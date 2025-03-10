const express = require("express");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(express.json());

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
