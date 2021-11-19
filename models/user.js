const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "User" }
);

module.exports = mongoose.model("User", userSchema);
