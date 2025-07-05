const express = require("express");
const { body } = require("express-validator");
const charactersController = require("../controllers/characters-controllers");
const authenticateJWT = require("../utils/authenticateJWT");

const router = express.Router();

router.get("/", charactersController.getCharacters);
router.get("/:characterId", charactersController.getCharacterById);
router.post(
  "/",
  [
    body("characterName").notEmpty().withMessage("Name is required"),
    body("characterRole").notEmpty().withMessage("Role is required"),
    body("characterDescription")
      .notEmpty()
      .withMessage("Description is required"),
    body("characterImage")
      .optional()
      .isURL()
      .withMessage("Image must be a valid URL"),
    body("familiar.familiarName")
      .notEmpty()
      .withMessage("Familiar name is required"),
    body("familiar.familiarSpecies")
      .notEmpty()
      .withMessage("Familiar species is required"),
    body("familiar.familiarDescription")
      .notEmpty()
      .withMessage("Familiar description is required"),
    body("familiar.familiarImage")
      .optional()
      .isURL()
      .withMessage("Familiar image must be a valid URL"),
  ],
  authenticateJWT,
  charactersController.createCharacter
);

router.patch(
  "/:characterId",
  [
    body("characterName")
      .optional()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("characterRole")
      .optional()
      .notEmpty()
      .withMessage("Role cannot be empty"),
    body("characterDescription")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("characterImage")
      .optional()
      .isURL()
      .withMessage("Image must be a valid URL"),
    body("familiar.familiarName")
      .optional()
      .notEmpty()
      .withMessage("Familiar name cannot be empty"),
    body("familiar.familiarSpecies")
      .optional()
      .notEmpty()
      .withMessage("Familiar species cannot be empty"),
    body("familiar.familiarDescription")
      .optional()
      .notEmpty()
      .withMessage("Familiar description cannot be empty"),
    body("familiar.familiarImage")
      .optional()
      .isURL()
      .withMessage("Familiar image must be a valid URL"),
  ],
  authenticateJWT,
  charactersController.updateCharacter
);

router.delete(
  "/:characterId",
  authenticateJWT,
  charactersController.deleteCharacter
);

module.exports = router;
