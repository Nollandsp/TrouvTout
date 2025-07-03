const fs = require("fs");
const { supabase } = require("../services/supabaseClient");
const imageModel = require("../models/image.model");

// Récupérer toutes les images (ex: /api/images)
exports.getAllImages = async (req, res) => {
  try {
    // Si tu n'as pas de fonction getAllImages dans ton modèle,
    // tu peux récupérer toutes les images comme ça :
    const { data, error } = await supabase.from("images").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur getAllImages:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des images." });
  }
};

// Récupérer les images d'une annonce spécifique (ex: /api/images/annonce/:annonce_id)
exports.getImagesByAnnonce = async (req, res) => {
  try {
    const annonce_id = req.params.annonce_id;
    const images = await imageModel.getImagesByAnnonce(annonce_id);
    res.status(200).json(images);
  } catch (error) {
    console.error("Erreur getImagesByAnnonce:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des images." });
  }
};

// Upload d'une image liée à une annonce
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image manquante." });
    }
    const annonce_id = req.body.annonce_id;
    if (!annonce_id) {
      return res.status(400).json({ message: "annonce_id requis." });
    }

    // Fichier temporaire uploadé par multer
    const filePath = req.file.path;
    const fileName = `${Date.now()}_${req.file.originalname}`;

    // Upload dans Supabase Storage (bucket "images")
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, fs.createReadStream(filePath), {
        cacheControl: "3600",
        upsert: false,
        contentType: req.file.mimetype,
      });

    // Supprimer le fichier temporaire local
    fs.unlinkSync(filePath);

    if (error) {
      throw error;
    }

    // URL publique de l'image uploadée
    const publicUrl = supabase.storage.from("images").getPublicUrl(fileName)
      .data.publicUrl;

    // Ajouter l’URL dans la table images
    const imageRecord = await imageModel.addImage(annonce_id, publicUrl);

    res.status(201).json(imageRecord);
  } catch (error) {
    console.error("Erreur uploadImage:", error);
    res.status(500).json({ message: "Erreur lors de l’upload de l’image." });
  }
};
