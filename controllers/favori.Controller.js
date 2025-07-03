const favoriModel = require("../models/favori.model");

exports.getAllFavoris = async (req, res) => {
  try {
    const favoris = await favoriModel.getAllFavoris();
    res.status(200).json(favoris);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des favoris." });
  }
};

exports.getFavorisByUser = async (req, res) => {
  try {
    const favoris = await favoriModel.getFavorisByUser(req.params.user_id);
    res.status(200).json(favoris);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des favoris." });
  }
};

exports.addFavori = async (req, res) => {
  const { user_id, annonce_id } = req.body;
  if (!user_id || !annonce_id) {
    return res
      .status(400)
      .json({ message: "user_id et annonce_id sont requis." });
  }
  try {
    const favori = await favoriModel.addFavori(user_id, annonce_id);
    res.status(201).json(favori);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du favori." });
  }
};

exports.deleteFavori = async (req, res) => {
  const { user_id, annonce_id } = req.body;
  if (!user_id || !annonce_id) {
    return res
      .status(400)
      .json({ message: "user_id et annonce_id sont requis." });
  }
  try {
    await favoriModel.deleteFavori(user_id, annonce_id);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du favori." });
  }
};
