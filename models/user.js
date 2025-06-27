const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    unique: true,
    validate: {
      validator: async function (value) {
        if (!this.isNew && !this.isModified("email")) return true;
        const exists = await this.constructor.exists({ email: value });
        return !exists;
      },
      message: (props) => `Email «${props.value}» already exists.`,
    },
  },
  password: { type: String, required: true, minlength: 6 },
  characters: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Character" },
  ],
});

module.exports = mongoose.model("User", userSchema);
