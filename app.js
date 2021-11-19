const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");

const { PORT, DATABASE, NODE_ENV } = require("./config/serverConfig");
const IN_PROD = NODE_ENV === "production";
const app = express();

/**
 * Middlewares
 * */
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);

const startApp = async () => {
  try {
    await mongoose
      .connect(DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to database");
      })
      .catch(() => {
        console.log("Error in connection");
      });

    app.listen(PORT, () => {
      console.log("Server started and listening on port " + PORT);
    });
  } catch (err) {
    console.log(err);
  }
};
startApp();
