const express = require("express");

const router = express.Router();

const {
  createGame,
  getAllGames,
  registerGameAsDealer,
  getGameName,
  getGameDealers
} = require("../controllers/game");
const { getUserById } = require("../controllers/user");
const { isAdmin, isDealer } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("gameName", getGameName);

//get routes
router.get("/game/get-all", getAllGames);
router.get("/game/dealers/:gameName", getGameDealers);

//create routes
router.post("/game/create/:userId", isAdmin, createGame);
router.put("/game/register/dealer/:gameName/:userId", isDealer, registerGameAsDealer);

module.exports = router;


//619761154e60ece36b86526f