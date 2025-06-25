const express = require("express");

const charactersController = require("../controllers/characters-controllers");

const router = express.Router();

router.get("/", charactersController.getCharacters);
router.get("/:characterId", charactersController.getCharacterById);

module.exports = router;
