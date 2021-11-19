const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, collection: "User" }
);

module.exports = mongoose.model("Payment", paymentSchema);
