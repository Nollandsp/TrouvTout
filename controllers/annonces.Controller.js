const annonceModel = require("../models/annonces.model");

exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await annonceModel.getAllAnnonces();
    return res.status(200).json(annonces);
  } catch (error) {
    console.error("Erreur getAllAnnonces:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des annonces.",
    });
  }
};

exports.getAnnoncesById = async (req, res) => {
  try {
    const annonce = await annonceModel.getAnnoncesById(req.params.id);
    if (annonce) {
      return res.status(200).json(annonce);
    } else {
      return res.status(404).json({ message: "Annonce non trouvée." });
    }
  } catch (error) {
    console.error("Erreur getAnnoncesById:", error.message);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de l'annonce.",
    });
  }
};

exports.creationAnnonces = async (req, res) => {
  const { titre, description, prix, localité, user_id, category_id } = req.body;

  if (
    !titre ||
    !description ||
    isNaN(prix) ||
    !localité ||
    !user_id ||
    isNaN(category_id)
  ) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires." });
  }

  try {
    const annonce = await annonceModel.createAnnonces([
      {
        titre,
        description,
        prix,
        localité,
        user_id,
        category_id,
      },
    ]);
    return res.status(201).json(annonce);
  } catch (error) {
    console.error("Erreur creationAnnonces:", error.message);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de l'annonce.",
    });
  }
};

exports.updateAnnonces = async (req, res) => {
  const { titre, description, prix, localité } = req.body;

  if (!titre && !description && !prix && !localité) {
    return res.status(400).json({
      message:
        "Au moins un champ (titre, description, prix ou localité) est requis pour la mise à jour.",
    });
  }

  try {
    const updatedAnnonce = await annonceModel.updateAnnonces(req.params.id, {
      ...(titre && { titre }),
      ...(description && { description }),
      ...(prix && { prix }),
      ...(localité && { localité }),
    });

    if (updatedAnnonce) {
      return res.status(200).json(updatedAnnonce);
    } else {
      return res.status(404).json({
        message: "Annonce non trouvée pour la mise à jour.",
      });
    }
  } catch (error) {
    console.error("Erreur updateAnnonces:", error.message);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de l'annonce.",
    });
  }
};

exports.deleteAnnonces = async (req, res) => {
  try {
    const success = await annonceModel.deleteAnnonces(req.params.id);
    if (success) {
      return res.status(204).send(); // No Content
    } else {
      return res
        .status(404)
        .json({ message: "Annonce non trouvée pour la suppression." });
    }
  } catch (error) {
    console.error("Erreur deleteAnnonces:", error.message);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression de l'annonce.",
    });
  }
};
