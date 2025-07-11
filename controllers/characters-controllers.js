import mongoose from "mongoose";
import createError from "http-errors";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import Character from "../models/character.js";

const getCharacters = async (req, res, next) => {
  let characters;
  try {
    characters = await Character.find({});
  } catch (err) {
    return next(
      createError(500, "Fetching characters failed, please try again later.", {
        err: err.message,
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
        err: err.message,
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

  const userId = req.user.userId;

  const {
    characterName,
    characterRole,
    characterDescription,
    characterImage,
    familiar,
  } = req.body;

  const createdCharacter = new Character({
    characterName,
    characterRole,
    characterDescription,
    characterImage,
    familiar: {
      familiarName: familiar.familiarName,
      familiarSpecies: familiar.familiarSpecies,
      familiarDescription: familiar.familiarDescription,
      familiarImage: familiar.familiarImage,
    },
    creator: userId,
  });

  let user;
  try {
    user = await User.findById(createdCharacter.creator);
  } catch (error) {
    return next(
      createError(500, "Creating character failed, please try again", {
        error: error.message,
      })
    );
  }

  if (!user) {
    return next(createError(404, "Could not find user for provided id"));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCharacter.save({ session: sess });
    user.characters.push(createdCharacter);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      createError(500, "Creating character failed, please try again", {
        error: error.message,
      })
    );
  }

  res
    .status(201)
    .json({ character: createdCharacter.toObject({ getters: true }) });
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

  const {
    characterName,
    characterRole,
    characterDescription,
    characterImage,
    familiar,
  } = req.body;
  const characterId = req.params.characterId;
  const userId = req.user.userId;

  let character;
  try {
    character = await Character.findById(characterId);
  } catch (err) {
    return next(
      createError(500, "Could not fetch character.", { error: err.message })
    );
  }

  if (!character) {
    return next(createError(404, "Character not found."));
  }

  if (character.creator.toString() !== userId) {
    return next(
      createError(403, "You are not allowed to edit this character.")
    );
  }

  character.characterName = characterName;
  character.characterRole = characterRole;
  character.characterImage = characterImage;
  character.characterDescription = characterDescription;
  character.familiar = {
    familiarName: familiar.familiarName,
    familiarSpecies: familiar.familiarSpecies,
    familiarDescription: familiar.familiarDescription,
    familiarImage: familiar.familiarImage,
  };

  try {
    await character.save();
  } catch (err) {
    return next(
      createError(500, "Could not update character.", { error: err.message })
    );
  }

  res.status(200).json({ character: character.toObject({ getters: true }) });
};

const deleteCharacter = async (req, res, next) => {
  const characterId = req.params.characterId;
  const userId = req.user.userId;

  let character;
  try {
    character = await Character.findById(characterId).populate("creator");
  } catch (error) {
    return next(
      createError(500, "Something went wrong, could not delete character.", {
        error: error.message,
      })
    );
  }

  if (!character) {
    return next(createError(404, "Could not find character for this id."));
  }

  if (character.creator._id.toString() !== userId) {
    return next(
      createError(403, "You are not allowed to delete this character.")
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await character.deleteOne({ session: sess });
    character.creator.characters.pull(character);
    await character.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      createError(500, "Something went wrong, could not delete character.", {
        error: error.message,
      })
    );
  }

  res.status(200).json({ message: "Deleted character." });
};

export default {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
