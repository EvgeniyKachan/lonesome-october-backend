const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const characterSchema = new Schema({
  characterName: {
    type: String,
    required: true,
  },
  characterRole: {
    type: String,
    required: true,
  },
  characterDescription: {
    type: String,
    required: true,
  },
  characterImage: {
    type: String,
  },
  familiar: {
    familiarName: {
      type: String,
      required: true,
    },
    familiarSpecies: {
      type: String,
      required: true,
    },
    familiarDescription: {
      type: String,
      required: true,
    },
    familiarImage: {
      type: String,
    },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Character", characterSchema);
