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

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $set: req.body,
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
      return res.status(200).json(user);
    }
  );
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role != 2) {
		return res.status(403).json({
			error: "Not authorized to perform this operation"
		});
	}
	next();
};

exports.isDealer = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: "Not authorized to perform this operation"
		});
	}
	next();
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
