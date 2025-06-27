const Character = require("../models/character");

const getCharacters = async (req, res, next) => {
  let characters;
  try {
    characters = await Character.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching characters failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    characters: characters.map((character) =>
      character.toObject({ getters: true })
    ),
  });
};

const getCharacterById = async (req, res, next) => {
  const characterId = req.params.characterId;
  let character;
  try {
    character = await Character.findById(characterId);
  } catch (err) {
    const error = new HttpError(
      "Fetching character failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!character) {
    const error = new HttpError("Character not found.", 404);
    return next(error);
  }
  res.json({
    character: character.toObject({ getters: true }),
  });
};

exports.getCharacters = getCharacters;
exports.getCharacterById = getCharacterById;
