const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          error: "Account with this Email ID already exists",
        });
      } else {
        return res.status(400).json({
          error: err,
        });
      }
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.test = (req, res) => {
  res.send("Hey There");
};
// exports.signin = (req, res) => {
//res.send("Signed in");
// };

// exports.signout = (req, res) => {
// 	res.status(200).json({
// 		message: "Signed out"
// 	});
// };