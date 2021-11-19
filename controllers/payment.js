const Payment = require("../models/payment");

exports.rechargeBalance = (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};
