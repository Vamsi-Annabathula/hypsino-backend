const _ = require("lodash");
const Roulette = require("../models/roulette");
const User = require("../models/user");
const Bet = require("../models/bet");
const {
  status,
  minNumber,
  maxNumber,
  betStatus,
} = require("../constants/modelConstants");

exports.getOpenRooms = (req, res) => {
  Roulette.find({ status: status.open }).exec((err, rooms) => {
    if (err || !rooms) {
      return res.status(400).json({
        error: "No Open rooms found",
      });
    }
    res.status(200).json(rooms);
  });
};

exports.enterRoom = async (req, res) => {
  let bet = new Bet();
  const participant = new User(req.profile);
  let room = await Roulette.findOne({ dealer: req.body.id })
    .populate("bets")
    .exec();
  const participationFee = req.game.participationFee;

  console.log(room);
  const isParticipantAllowed = room.bets.find((ele) => {
    if (_.isEqual(ele.participant._id, participant._id)) {
      return ele;
    }
  });

  if (isParticipantAllowed == undefined) {
    if (participant.wallet < participationFee) {
      return res.status(400).json({
        error: "Insufficient Balance, Please recharge your wallet",
      });
    }
    //updating user wallet
    User.findByIdAndUpdate(
      {
        _id: participant._id,
      },
      {
        $set: { wallet: participant.wallet - participationFee },
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

    bet.participant = participant;
    room.bets.push(bet);

    bet.save((err, bet) => {
      if (err) {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
      //res.status(200).json(bet);
    });

    room.save((err, room) => {
      if (err) {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
      res.status(200).json(room);
    });
  } else {
    res.status(400).json({
      error: "You have entered the game",
    });
  }
};

exports.startGame = async (req, res) => {
  let room = await Roulette.findOne({ dealer: req.profile._id }).exec();
  room.startTime = new Date();
  room.status = status.opentobet;
  room.save((err, room) => {
    if (err) {
      return res.status(400).json({
        error: "Internal error occured",
      });
    }
    res.status(200).json(room);
  });
  console.log(room);
};

exports.placeBet = async (req, res) => {
  let bet = await Bet.findOne({ participant: req.profile._id })
    .populate("participant")
    .exec();

  if (bet == undefined) {
    return res.status(400).json({
      error: "You are not authorised to place bet",
    });
  }

  if (req.body.betAmount > req.profile.wallet) {
    return res.status(400).json({
      error: "Insufficient Balance to place this bet",
    });
  } else {
    bet.betNumber = req.body.betNumber;
    bet.betAmount = req.body.betAmount;
    bet.save((err, bet) => {
      if (err) {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
      res.status(200).json(bet);
    });
  }
};

exports.throwNumber = async (req, res) => {
  let room = await Roulette.findOne({ dealer: req.profile._id }).exec();
  if (room.status == status.opentobet) {
    room.thrownNumber = Math.floor(
      Math.random() * (maxNumber - minNumber + 1) + minNumber
    );
    room.endTime = new Date();
    room.status = status.closedtobet;
    room.save((err, room) => {
      if (err) {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
      res.status(200).json(room);
    });
  } else {
    return res.status(400).json({
      error: "Cannot throw number in closed room",
    });
  }
};

exports.rewards = async (req, res) => {
  let bet = await Bet.findOne({ participant: req.profile._id })
    .populate("participant")
    .exec();
  let room = await Roulette.findOne({ dealer: req.body.id }).exec();

  if (room.thrownNumber == bet.betNumber) {
    //updating user wallet
    User.findByIdAndUpdate(
      {
        _id: req.profile._id,
      },
      {
        $set: { wallet: req.profile.wallet + 2 * bet.betAmount },
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

    bet.status = betStatus.win;
    bet.save((err, bet) => {
      if (err) {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
      res.status(200).json({
        msg: `Congratulations you won total of ${2 * bet.betAmount}`,
      });
    });
  } else {
    //updating user wallet
    User.findByIdAndUpdate(
      {
        _id: req.profile._id,
      },
      {
        $set: { wallet: req.profile.wallet - bet.betAmount },
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

    bet.status = betStatus.loss;
    bet.save((err, bet) => {
      if (err) {
        return res.status(400).json({
          error: "Internal error occured",
        });
      }
      res.status(200).json({
        msg: `Oops! you lost your investment, try again`,
      });
    });
  }
  console.log(req.profile._id, req.profile.wallet, bet.betAmount);
};
