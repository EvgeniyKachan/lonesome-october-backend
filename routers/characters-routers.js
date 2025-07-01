const express = require("express");
const { body } = require("express-validator");
const charactersController = require("../controllers/characters-controllers");

const router = express.Router();

router.get("/", charactersController.getCharacters);
router.get("/:characterId", charactersController.getCharacterById);
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
    body("familiar.name").notEmpty().withMessage("Familiar name is required"),
    body("familiar.species")
      .notEmpty()
      .withMessage("Familiar species is required"),
    body("familiar.description")
      .notEmpty()
      .withMessage("Familiar description is required"),
    body("familiar.image")
      .optional()
      .isURL()
      .withMessage("Familiar image must be a valid URL"),
    body("creator")
      .notEmpty()
      .withMessage("Creator ID is required")
      .isMongoId(),
  ],
  charactersController.createCharacter
);

router.patch(
  "/:characterId",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("role").optional().notEmpty().withMessage("Role cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("image").optional().isURL().withMessage("Image must be a valid URL"),
    body("familiar.name")
      .optional()
      .notEmpty()
      .withMessage("Familiar name cannot be empty"),
    body("familiar.species")
      .optional()
      .notEmpty()
      .withMessage("Familiar species cannot be empty"),
    body("familiar.description")
      .optional()
      .notEmpty()
      .withMessage("Familiar description cannot be empty"),
    body("familiar.image")
      .optional()
      .isURL()
      .withMessage("Familiar image must be a valid URL"),
  ],
  charactersController.updateCharacter
);
router.delete("/:characterId", charactersController.deleteCharacter);

module.exports = router;
