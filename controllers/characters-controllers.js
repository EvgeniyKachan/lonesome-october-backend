const Character = require("../models/characters");

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

exports.getCharacters = getCharacters;
