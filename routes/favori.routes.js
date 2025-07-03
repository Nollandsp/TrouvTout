const express = require("express");
const router = express.Router();
const favoriController = require("../controllers/favori.Controller");

router.get("/", favoriController.getAllFavoris);
router.get("/:user_id", favoriController.getFavorisByUser);
router.post("/", favoriController.addFavori);
router.delete("/", favoriController.deleteFavori);

module.exports = router;
