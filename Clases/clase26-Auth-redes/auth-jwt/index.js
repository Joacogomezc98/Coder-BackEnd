import express from "express";
import jwt from "jsonwebtoken";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("api works");
});

app.get("/api/protected", auth, (req, res) => {
  res.send("protected");
});

app.post("/api/register", (req, res) => {
  const user = req.body;
  const token = jwt.sign({ user }, "mi_token_secreto");
  res.json({
    token,
  });
});

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "mi_token_secreto", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "not authorized",
      });
    }

    req.user = decoded.data;
    next();
  });
}

app.listen(3000, () => {
  console.log("Server on port 3000");
});
