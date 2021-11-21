const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/auth");
const roulleteRoutes = require("./routes/roulette");
const userRoutes = require("./routes/user");
const gameRoutes = require("./routes/game");

const { PORT, DATABASE, NODE_ENV } = require("./config/serverConfig");
const IN_PROD = NODE_ENV === "production";
const app = express();

/**
 * Middlewares
 * */
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//swagger
const swaggerDocument = YAML.load("./swagger.yml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Routes
app.use("/api", authRoutes);
app.use("/api", roulleteRoutes);
app.use("/api", userRoutes);
app.use("/api", gameRoutes);

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
