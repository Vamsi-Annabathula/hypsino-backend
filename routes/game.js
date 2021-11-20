const express = require("express");

const router = express.Router();

const {
  createGame,
  getAllGames,
  registerAsDealer,
} = require("../controllers/game");
const { getUserById } = require("../controllers/user");
const { isAdmin, isDealer } = require("../controllers/auth");

router.param("userId", getUserById);

router.post("/game/create/:userId", isAdmin, createGame);
router.get("/game/getAll", getAllGames);
router.post("/game/registerAsDealer", isDealer, registerAsDealer);

module.exports = router;
