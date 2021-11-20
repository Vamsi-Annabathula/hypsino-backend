const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { Schema } = mongoose;

const rouletteSchema = new Schema(
  {
    thrownNumber: {
      type: Number,
      trim: true,
      min: 0,
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
    status:{
      type: String,
      default: "Open",
      enum:[
        "Open",
        "Closed"
      ]
    }
  },
  { timestamps: true, collection: "Roulette" }
);

module.exports = mongoose.model("Roulette", rouletteSchema);
