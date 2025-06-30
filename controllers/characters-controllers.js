const createError = require("http-errors");
const Character = require("../models/character");

const getCharacters = async (req, res, next) => {
  let characters;
  try {
    characters = await Character.find({});
  } catch (err) {
    return next(
      createError(500, "Fetching characters failed, please try again later.", {
        err: err.array(),
      })
    );
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
    return next(
      createError(500, "Fetching characters failed, please try again later.", {
        err: err.array(),
      })
    );
  }
  if (!character) {
    return next(createError(404, "Character not found."));
  }
  res.json({
    character: character.toObject({ getters: true }),
  });
};

const createCharacter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      createError(422, "Invalid inputs passed, please check your data.", {
        errors: errors.array(),
      })
    );
  }

  const { name, role, description, image, familiar, creator } = req.body;

  const createdCharacter = new Character({
    name,
    role,
    description,
    image,
    familiar: {
      name: familiar.name,
      species: familiar.species,
      description: familiar.description,
      image: familiar?.image,
    },
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(
      createError(500, "Creating character failed, please try again", {
        err: err.array(),
      })
    );
  }

  if (!user) {
    return next(createError(404, "Could not find user for provided id"));
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCharacter.save({ session: sess });
    user.characters.push(createdCharacter);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      createError(500, "Creating character failed, please try again", {
        err: err.array(),
      })
    );
  }

  res.status(201).json({ character: createdCharacter });
};

const updateCharacter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      createError(422, "Invalid inputs passed, please check your data.", {
        errors: errors.array(),
      })
    );
  }

  const { name, role, description, image, familiar, creator } = req.body;
  const characterId = req.params.characterId;

  let character;
  try {
    character = await Character.findById(characterId);
  } catch (err) {
    return next(
      createError(500, "Something went wrong, could not update character.", {
        err: err.array(),
      })
    );
  }

  character.name = name;
  character.role = role;
  character.image = image;
  character.familiar.name = familiar.name;
  character.familiar.species = familiar.species;
  character.familiar.description = familiar.description;
  character.familiar.image = familiar?.image;
  character.description = description;

  try {
    await character.save();
  } catch (err) {
    return next(
      createError(500, "Something went wrong, could not update character.", {
        err: err.array(),
      })
    );
  }

  res.status(200).json({ character: character.toObject({ getters: true }) });
};

const deleteCharacter = async (req, res, next) => {
  const characterId = req.params.characterId;

  let character;
  try {
    character = await Character.findById(characterId).populate("creator");
  } catch (err) {
    return next(
      createError(500, "Something went wrong, could not delete character.", {
        err: err.array(),
      })
    );
  }

  if (!character) {
    return next(createError(404, "Could not find character for this id."));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await character.remove({ session: sess });
    character.creator.characters.pull(character);
    await character.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      createError(500, "Something went wrong, could not delete character.", {
        err: err.array(),
      })
    );
  }

  res.status(200).json({ message: "Deleted character." });
};

exports.getCharacters = getCharacters;
exports.getCharacterById = getCharacterById;
exports.createCharacter = createCharacter;
exports.updateCharacter = updateCharacter;
exports.deleteCharacter = deleteCharacter;
