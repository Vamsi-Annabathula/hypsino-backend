const Game = require("../models/game");

exports.createGame = (req, res) => {
  const newGame = new Game(req.body);
  newGame.save((err, game) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          error: `${newGame.name} already exists`,
        });
      } else {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
    }
    res.status(200).json(game);
  });
};

exports.getAllGames = (req, res) => {
  Game.find().exec((err, games) => {
    if (err || !games) {
      return res.status(400).json({
        error: "No users found",
      });
    }
    res.status(200).json(games);
  });
};

exports.registerAsDealer = (req, res) => {
    res.status(400)
};
