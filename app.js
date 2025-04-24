const express = require("express");
const app = express();
const users = require("./users");

app.use(express.json());

// Simule une authentification par query string (ex: ?user=1)
app.use((req, res, next) => {
  const userId = req.query.user;
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).send("Unauthorized");
  req.user = user;
  next();
});

// Route protégée correctement (GET)
app.get("/api/user/:id", (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).send("Forbidden GET");
  }
  res.send(`User profile of ID ${req.params.id}`);
});

// Route vulnérable (DELETE sans contrôle d'accès)
app.delete("/api/user/:id", (req, res) => {
  res.send(`User ID ${req.params.id} deleted (vulnérable !)`);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
