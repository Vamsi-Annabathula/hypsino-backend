const _ = require("lodash");
const Game = require("../models/game");
const User = require("../models/user");
const Roulette = require("../models/roulette");
const { status } = require("../constants/modelConstants");

exports.getGameName = (req, res, next, gameName) => {
  Game.findOne({ name: gameName }).exec((err, game) => {
    if (err) {
      return res.status(400).json({
        message: err,
      });
    }
    if (!game) {
      return res.status(400).json({
        message: "Game doesn't exist",
      });
    }
    req.game = game;
    next();
  });
};

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

exports.registerGameAsDealer = async (req, res) => {
  let dealer = new User(req.profile);
  let game = new Game(req.game);
  let roulette = new Roulette();

  const isDealerExists = game.dealer.find((ele) => {
    if (_.isEqual(ele, dealer._id)) {
      return ele;
    }
  });

  if (isDealerExists == undefined) {
    //payment for registration
    if (dealer.wallet < game.registrationAmount) {
      return res.status(400).json({
        error: "Insufficient Balance, Please recharge your wallet",
      });
    } else {
      //updating user wallet
      User.findByIdAndUpdate(
        {
          _id: req.profile._id,
        },
        {
          $set: { wallet: req.profile.wallet - req.game.registrationAmount },
        },
        {
          new: true,
          useFindAndModify: false,
        },
        (err, user) => {
          if (err) {
            return res.status(400).json({
              message: err,
            });
          }
          //res.status(200).send(`Wallet is successfully recharged!`);
        }
      );

      //adding dealer to roulette
      roulette.dealer = dealer;
      roulette.save((err, game) => {
        if (err) {
          return res.status(400).json({
            error: "Internal error occured",
          });
        }
      });

      //updating game details
      game.dealer?.push(dealer);
      game.save((err, game) => {
        if (err) {
          return res.status(400).json({
            error: "Internal error occured",
          });
        }
        res.status(200).json(game);
      });
    }
  } else {
    res.status(400).json({
      error: "Dealer already registered to this Game",
    });
  }
};

exports.getGameDealers = async (req, res) => {
  const game = await new Game(req.game).populate("dealer");
  if (_.isEmpty(game.dealer)) {
    res.status(400).json({
      error: "No Dealers found",
    });
  } else {
    res.status(200).json(game.dealer);
  }
};
