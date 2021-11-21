const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      trim: true,
      unique: true,
      required: true
    },
    registrationAmount: {
      type: Number,
      trim: true,
    },
    participationFee: {
      type: Number,
      trim: true,
    },
    dealer: [
      {
        type: ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true, collection: "Game" }
);

module.exports = mongoose.model("Game", gameSchema);
