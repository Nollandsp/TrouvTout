const categoryModel = require("../models/category.model");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des catégories." });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    if (category) res.status(200).json(category);
    else res.status(404).json({ message: "Catégorie non trouvée." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la catégorie." });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await categoryModel.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la catégorie." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await categoryModel.updateCategory(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la catégorie." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la catégorie." });
  }
};
