const User = require("../models/user");
const { role } = require("../constants/modelConstants");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        message: err,
      });
    }
    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  const user = new User(req.profile);
  return res.status(200).json(user);
};

exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No users found",
      });
    }
    res.status(200).json(users);
  });
};

exports.getAllDealers = (req, res) => {
  User.find({ role: role.dealer }).exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No users found",
      });
    }
    res.status(200).json(users);
  });
};

exports.recharge = (req, res) => {
  //updating user wallet
  User.findByIdAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $set: { wallet: req.profile.wallet + req.body.wallet },
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
      res.status(200).send(`Wallet is successfully recharged!`);
    }
  );
};
