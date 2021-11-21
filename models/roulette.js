const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;
const { status } = require("../constants/modelConstants");

const rouletteSchema = new Schema(
  {
    thrownNumber: {
      type: Number,
      trim: true,
      min: 1,
      max: 36,
    },
    startTime: {
      type: Date,
      trim: true,
    },
    endTime: {
      type: Date,
      trim: true,
    },
    dealer: {
      type: ObjectId,
      ref: "User",
    },
    bets: [
      {
        type: ObjectId,
        ref: "Bet",
      },
    ],
    status: {
      type: String,
      default: status.open,
    },
  },
  { timestamps: true, collection: "Roulette" }
);

module.exports = mongoose.model("Roulette", rouletteSchema);
