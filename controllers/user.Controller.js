const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des utilisateurs.",
    });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(404).json({ message: "Utilisateur non trouvé." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de l'utilisateur.",
    });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const updated = await userModel.updateUser(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
};

// **Nouvelle méthode pour l'inscription d'un utilisateur**
exports.registerUser = async (req, res) => {
  try {
    const userData = req.body;

    // Vérification simple des champs obligatoires
    if (!userData.pseudo || !userData.email || !userData.password) {
      return res
        .status(400)
        .json({ message: "Pseudo, email et mot de passe sont requis." });
    }

    // Hachage du mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Création utilisateur avec mot de passe haché
    const newUser = await userModel.createUser({
      ...userData,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};
