const express = require("express");
const router = express.Router();

const {
  getOpenRooms,
  enterRoom,
  startGame,
  placeBet,
  throwNumber,
  rewards
} = require("../controllers/roulette");
const { getUserById } = require("../controllers/user");
const { getGameName } = require("../controllers/game");

router.param("userId", getUserById);
router.param("gameName", getGameName);

//get routes
router.get("/roulette/rooms", getOpenRooms);

//post routes
router.post("/roulette/start-game/:userId", startGame);
router.post("/:gameName/enter-room/:userId", enterRoom);
router.post("/roulette/place-bet/:userId", placeBet);
router.post("/roulette/throw-number/:userId", throwNumber);
router.post("/roulette/rewards/:userId", rewards);

module.exports = router;

//ObjectId("61967e934e60ece36b865265")
//ObjectId("619761154e60ece36b86526f")
