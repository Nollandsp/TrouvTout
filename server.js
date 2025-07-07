const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config(); // Charge les variables d’environnement

// ✅ Vérification obligatoire de JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error(
    "❌ ERREUR : La variable d'environnement JWT_SECRET est manquante !"
  );
  process.exit(1); // Arrête le serveur immédiatement
}

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/annonces", require("./routes/annonce.routes.js"));
app.use("/api/users", require("./routes/user.routes.js"));
app.use("/api/categories", require("./routes/category.routes.js"));
app.use("/api/favoris", require("./routes/favori.routes.js"));
app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/images", require("./routes/image.routes.js"));

// Fichiers statiques (public/index.html, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Route d'accueil (optionnelle)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).json({ message: "Erreur serveur interne" });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
