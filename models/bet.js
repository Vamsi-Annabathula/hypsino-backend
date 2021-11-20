const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;

const betSchema = new Schema(
  {
    betNumber: {
      type: Number,
      trim: true,
      min: 0,
      max: 36,
    },
    betAmount: {
      type: Number,
      trim: true,
    },
    participant: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, collection: "Bet" }
);

module.exports = mongoose.model("bet", betSchema);
