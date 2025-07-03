const express = require("express");
const router = express.Router();
const annonceController = require("../controllers/annonces.Controller");

router.get("/", annonceController.getAllAnnonces);
router.get("/:id", annonceController.getAnnoncesById);
router.post("/", annonceController.creationAnnonces);
router.put("/:id", annonceController.updateAnnonces);
router.delete("/:id", annonceController.deleteAnnonces);

module.exports = router;
