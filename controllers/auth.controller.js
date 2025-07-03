const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { supabase } = require("../services/supabaseClient");
const { JWT_SECRET } = process.env;

// Enregistrement d’un utilisateur
exports.register = async (req, res) => {
  const { pseudo, prénom, nom, téléphone, localité, email, password } =
    req.body;

  if (!email || !password || !pseudo) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  try {
    // Vérifie si l'email est déjà utilisé
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const { data, error } = await supabase.from("users").insert([
      {
        email,
        password: hashedPassword,
        pseudo,
        prénom,
        nom,
        téléphone,
        localité,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Connexion d’un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cherche l'utilisateur
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password, pseudo, prénom, nom, téléphone, localité")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    // Vérifie le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Crée un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // **RENVOIE TOUS LES CHAMPS**
    res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
        prénom: user.prénom,
        nom: user.nom,
        téléphone: user.téléphone,
        localité: user.localité,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
